import React, { useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Cookies} from "react-cookie";

const OAuth2RedirectHandler = () => {

    // axios.interceptors.response.use(
    //     response => response,
    //     async error => {
    //         const originalRequest = error.config;
    //         if (error.response.status === 401 && !originalRequest._retry) {
    //             originalRequest._retry = true;
    //             try {
    //                 const response = await axios.post('/auth/refresh-token', {}, { withCredentials: true });
    //                 const newAccessToken = response.data.accessToken;
    //                 axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    //                 originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
    //                 return axios(originalRequest);
    //             } catch (e) {
    //                 console.error('Refresh token expired or invalid', e);
    //                 // 로그인 페이지로 리다이렉트 등 추가 처리
    //             }
    //         }
    //         return Promise.reject(error);
    //     }
    // );

// API 요청 예시
    useEffect(() => {

        axios.post('/api/auth/reissue', { withCredentials: true })
            .then(response => {
                alert(response.headers['access']);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });

    },[]);
};

export default OAuth2RedirectHandler;
