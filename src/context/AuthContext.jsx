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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        if (user) {
          // Fetch role and profile status from Firestore
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserRole(docSnap.data().role);
            setProfileComplete(docSnap.data().profileComplete || false);
          } else {
            setUserRole(null);
            setProfileComplete(false);
          }
        } else {
          setUserRole(null);
          setProfileComplete(false);
        }
      } catch (err) {
        console.error("Error in auth state change:", err);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    profileComplete,
    setProfileComplete,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
