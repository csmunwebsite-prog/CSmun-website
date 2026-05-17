import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { 
  GoogleAuthProvider,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loginWithGoogle(selectedRole) {
    // 1. Proactively clear any stale or corrupt Firebase Auth session data to prevent state-mismatch bugs
    try {
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('firebase') || key.includes('auth')) {
          sessionStorage.removeItem(key);
        }
      });
      Object.keys(localStorage).forEach(key => {
        if (key.includes('firebase') || key.includes('auth')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn("Storage clearing warning:", e);
    }

    const provider = new GoogleAuthProvider();
    // Force account selection so they don't get trapped in a stale Google session
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save to localStorage immediately as a fallback
      localStorage.setItem(`csmun_role_${user.uid}`, selectedRole);
      
      // Check if user already exists
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      let finalRole = selectedRole;
      let isProfileComplete = false;

      if (docSnap.exists()) {
        finalRole = docSnap.data().role || selectedRole;
        isProfileComplete = docSnap.data().profileComplete || false;
        
        if (!docSnap.data().role) {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, { role: finalRole }, { merge: true });
        }
        
        localStorage.setItem(`csmun_role_${user.uid}`, finalRole);
      } else {
        await setDoc(docRef, {
          uid: user.uid,
          email: user.email,
          role: finalRole,
          name: user.displayName,
          profileComplete: false,
          createdAt: new Date().toISOString()
        });
        isProfileComplete = false;
      }

      setUserRole(finalRole);
      setProfileComplete(isProfileComplete);
      return { result, isProfileComplete };
    } catch (error) {
      console.error("Firebase Sign-In Error Details:", error);
      
      // Check for storage partitioning or Brave Shields / Safari third-party cookie block
      const isStorageIssue = 
        error.message?.includes('missing initial state') || 
        error.message?.includes('sessionStorage') ||
        error.message?.includes('storage-partitioned') ||
        error.code === 'auth/web-storage-unsupported';

      if (isStorageIssue) {
        alert(
          "⚠️ Secure Sign-In Blocked by Browser:\n\n" +
          "Your browser is blocking access to local storage/session data, which is required by Google Sign-In.\n\n" +
          "How to fix this:\n" +
          "1. If you are using Brave, please click the Shield icon in your URL bar and toggle off Brave Shields for CSMUN.\n" +
          "2. If you are using Safari, go to Safari Preferences -> Privacy and temporarily uncheck 'Prevent Cross-Site Tracking'.\n" +
          "3. Try signing in using a private/incognito window or a different browser (Chrome/Firefox)."
        );
      } else {
        alert("Sign-in failed: " + (error.message || "Unknown error occurred. Please try again."));
      }
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      setCurrentUser(user);
      
      if (user) {
        // Set a fast 1.5-second timeout for the Firestore fetch to prevent hangs
        const timeoutId = setTimeout(() => {
          console.warn("Firestore fetch timed out, falling back to local credentials.");
          const savedRole = localStorage.getItem(`csmun_role_${user.uid}`) || 'delegate';
          const savedName = localStorage.getItem(`csmun_name_${user.uid}`) || user.displayName || 'Delegate';
          setUserData({
            uid: user.uid,
            name: savedName,
            certificateName: savedName,
            email: user.email,
            role: savedRole,
            profileComplete: true
          });
          setUserRole(savedRole);
          setProfileComplete(true);
          setLoading(false);
        }, 1500);

        const fetchUserData = async () => {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              console.log("User data fetched:", data);
              
              // HEAL: If role is missing or empty in Firestore, heal it immediately using localStorage
              if (!data.role) {
                const savedRole = localStorage.getItem(`csmun_role_${user.uid}`) || 'delegate';
                console.log("Healing user document with role:", savedRole);
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, { role: savedRole }, { merge: true });
                data.role = savedRole;
              }
              
              // Save custom name to localStorage for fallback
              if (data.name) {
                localStorage.setItem(`csmun_name_${user.uid}`, data.name);
              }
              
              clearTimeout(timeoutId);
              setUserData(data);
              setUserRole(data.role);
              setProfileComplete(data.profileComplete || false);
              setLoading(false);
            } else {
              console.log("No user document found in Firestore.");
              clearTimeout(timeoutId);
              setUserData(null);
              setUserRole(null);
              setProfileComplete(false);
              setLoading(false);
            }
          } catch (error) {
            console.error("Error fetching user data from Firestore:", error);
            clearTimeout(timeoutId);
            
            // Safe fallback on error
            const savedRole = localStorage.getItem(`csmun_role_${user.uid}`) || 'delegate';
            const savedName = localStorage.getItem(`csmun_name_${user.uid}`) || user.displayName || 'Delegate';
            setUserData({
              uid: user.uid,
              name: savedName,
              certificateName: savedName,
              email: user.email,
              role: savedRole,
              profileComplete: true
            });
            setUserRole(savedRole);
            setProfileComplete(true);
            setLoading(false);
          }
        };
        fetchUserData();
      } else {
        setUserData(null);
        setUserRole(null);
        setProfileComplete(false);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  async function updateUserProfile(data) {
    if (!currentUser) return;
    try {
      console.log("Updating user profile with data:", data);
      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, data, { merge: true });
      
      // Save name to localStorage immediately
      if (data.name) {
        localStorage.setItem(`csmun_name_${currentUser.uid}`, data.name);
      }
      
      // Refresh local state
      const updatedSnap = await getDoc(docRef);
      if (updatedSnap.exists()) {
        const updatedData = updatedSnap.data();
        console.log("Updated user data re-fetched:", updatedData);
        setUserData(updatedData);
        if (updatedData.role) setUserRole(updatedData.role);
        if (updatedData.profileComplete !== undefined) setProfileComplete(updatedData.profileComplete);
      }
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      throw error; // Re-throw to be handled by the component
    }
  }

  const value = {
    currentUser,
    userData,
    userRole,
    profileComplete,
    setProfileComplete,
    loginWithGoogle,
    logout,
    updateUserProfile
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0c16', color: 'white', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #8b1e1e', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p>Loading CSMUN Portal...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
