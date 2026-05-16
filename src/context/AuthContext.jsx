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
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user already exists
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    
    let finalRole = selectedRole;
    let isProfileComplete = false;

    if (docSnap.exists()) {
      // If user exists, respect their existing role
      finalRole = docSnap.data().role;
      isProfileComplete = docSnap.data().profileComplete || false;
    } else {
      // Store new user data in Firestore
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
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      setCurrentUser(user);
      
      if (user) {
        // Set a timeout for the Firestore fetch so we don't hang forever
        const timeoutId = setTimeout(() => {
          if (loading) {
            console.warn("Firestore fetch timed out, falling back to default state.");
            setLoading(false);
          }
        }, 10000); // 10 second timeout

        const fetchUserData = async () => {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              console.log("User data fetched:", data);
              setUserData(data);
              setUserRole(data.role);
              setProfileComplete(data.profileComplete || false);
            } else {
              console.log("No user document found in Firestore.");
              setUserData(null);
              setUserRole(null);
              setProfileComplete(false);
            }
          } catch (error) {
            console.error("Error fetching user data from Firestore:", error);
          } finally {
            clearTimeout(timeoutId);
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
