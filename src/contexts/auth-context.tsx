import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'admin' | 'tester';

interface User {
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
    provider?: 'google' | 'github' | 'email';
}

interface AuthContextType {
    user: User | null;
    login: (role: UserRole, data?: { email?: string, name?: string, avatar?: string, provider?: 'google' | 'github' | 'email' }) => void;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Load user from local storage
        const storedUser = localStorage.getItem('cloudsight-user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (role: UserRole, data?: { email?: string, name?: string, avatar?: string, provider?: 'google' | 'github' | 'email' }) => {
        const newUser: User = {
            name: data?.name || (role === 'admin' ? 'Admin User' : 'Tester Account'),
            email: data?.email || (role === 'admin' ? 'admin@cloudsight.io' : 'tester@cloudsight.io'),
            role: role,
            avatar: data?.avatar || 'https://github.com/shadcn.png',
            provider: data?.provider || 'email'
        };

        setUser(newUser);
        localStorage.setItem('cloudsight-user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cloudsight-user');
    };

    const updateProfile = (data: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('cloudsight-user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
