import React, { createContext, useEffect, useState, useContext, use } from 'react';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const stored = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (stored) {
            setToken(stored);
            setUser(storedUser ? JSON.parse(storedUser) : null);
        }
    }, []);
    const login = (tokenLogin: string, userlogin: any) => {
        localStorage.setItem('token', tokenLogin);
        localStorage.setItem('user', JSON.stringify(userlogin));
        setUser(userlogin);
        setToken(tokenLogin);
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}