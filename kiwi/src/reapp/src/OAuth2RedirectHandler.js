import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Cookies} from "react-cookie";

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchToken = async () => {
            try {
                // 서버로부터 리다이렉트된 URL에서 토큰 가져오기
                const response = await axios.get('http://localhost:8080/oauth2/redirect', {
                    withCredentials: true
                });

                // HTTP 헤더에서 access 토큰 추출
                const accessToken = response.headers['access'];

                // 쿠키에서 refresh 토큰 추출
                const refreshToken = getCookie('refresh');

                // const params = new URLSearchParams(window.location.search);
                // const accessToken = params.get("accessToken");
                // const refreshToken = params.get("refreshToken");

                // 토큰값을 알람으로 출력
                alert(`Access Token: ${accessToken}`);
                alert(`Refresh Token: ${refreshToken}`);

                // 로컬 스토리지에 토큰 저장
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                // 메인 페이지로 리다이렉트
                navigate('/main', { replace: true });
            } catch (error) {
                console.error('토큰 가져오기 실패:', error);
                // 실패 시 처리
            }
        };

        fetchToken();
    }, [navigate]);

    // 쿠키에서 토큰 가져오는 함수
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;
