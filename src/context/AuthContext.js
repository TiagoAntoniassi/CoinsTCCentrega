import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState('');
    const [userType, setUserType] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { email, userType } = JSON.parse(storedUser);
            setUserEmail(email);
            setUserType(userType);
            setIsLoggedIn(true);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('user');
        setUserEmail('');
        setUserType('');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ userEmail, setUserEmail, userType, setUserType, isLoggedIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
