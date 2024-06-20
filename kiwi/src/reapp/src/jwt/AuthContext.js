import React, { createContext, useState, useEffect } from 'react';
import {setSessionItem} from "./storage";

// 컨텍스트 생성
const AuthContext = createContext(null);

// 프로바이더 컴포넌트
const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('accessToken');
        return token ? { token } : null;
    });

    const [user, setUser] = useState(null);

    // 로그인 함수
    const login = (userData) => {
        setUser(userData);
        setSessionItem('')
        sessionStorage.setItem('user', JSON.stringify(userData));
    };

    // 로그아웃 함수
    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
    };

    // 컴포넌트가 마운트될 때 세션 스토리지에서 사용자 정보를 불러옵니다.
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
