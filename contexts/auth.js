import React, { useState, createContext, useEffect } from 'react';
import { auth, onAuthStateChanged } from '../storage/Firebase';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, [setUser]);

    return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
    );
}

