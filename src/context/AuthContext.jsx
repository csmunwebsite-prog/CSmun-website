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
  const [loading, setLoading] = useState(true);

  async function loginWithGoogle(selectedRole) {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user already exists
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    
    let finalRole = selectedRole;
    if (docSnap.exists()) {
      // If user exists, optionally respect their existing role instead of overriding
      finalRole = docSnap.data().role;
    } else {
      // Store new user data in Firestore
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        role: finalRole,
        name: user.displayName,
        createdAt: new Date().toISOString()
      });
    }

    setUserRole(finalRole);
    return result;
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch role from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        } else {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
