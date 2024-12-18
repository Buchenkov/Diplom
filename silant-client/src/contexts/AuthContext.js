// import React, { createContext, useState, useEffect, useContext } from 'react';
// import api from '../api'; 

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const loadUserData = async () => {
//             try {
//                 const token = localStorage.getItem('accessToken');
//                 const tokenExpire = localStorage.getItem('tokenExpire');

//                 if (token && tokenExpire && new Date().getTime() < new Date(tokenExpire).getTime()) {
//                     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//                     const response = await api.get('/api/user-info/');
//                     console.log('Данные пользователя загружены из localStorage:', response.data);
//                     setUser(response.data);
//                 } else {
//                     localStorage.removeItem('accessToken');
//                     localStorage.removeItem('tokenExpire');
//                 }
//             } catch (error) {
//                 console.error('Ошибка при загрузке данных пользователя из localStorage', error);
//                 localStorage.removeItem('accessToken');
//                 localStorage.removeItem('tokenExpire');
//             }
//         };

//         loadUserData();
//     }, []);

//     const login = async (token, tokenExpire) => {
//         try {
//             localStorage.setItem('accessToken', token);
//             localStorage.setItem('tokenExpire', tokenExpire);
//             api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//             const response = await api.get('/api/user-info/');
//             console.log('Данные пользователя после логина:', response.data);
//             setUser(response.data);
//         } catch (error) {
//             console.error('Ошибка при логине', error);
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('tokenExpire');
//         delete api.defaults.headers.common['Authorization'];
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };





import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
