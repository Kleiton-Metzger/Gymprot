import React, { createContext, useState, useEffect } from 'react';


export const AuthContext = createContext({});

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
        setUser(user);
        if (loading) setLoading(false);
        });
        return unsubscribe;
    }, [loading]);
    
    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
        {children}
        </AuthContext.Provider>
    );
    }

    