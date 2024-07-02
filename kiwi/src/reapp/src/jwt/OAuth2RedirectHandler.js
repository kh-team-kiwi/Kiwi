import React, { useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Cookies} from "react-cookie";
import {setLocalItem, setSessionItem} from "./storage";


const OAuth2RedirectHandler = () => {

    const navigate = useNavigate();

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

//API 요청 예시
    useEffect(() => {

        axios.post('/api/auth/reissue', { withCredentials: true })
            .then(response => {

                const accessToken = response.headers['access'];
                console.log("OAuth2RedirectHandler >> accessToken : "+ accessToken);

                if (accessToken) {
                    // Access Token을 로컬 스토리지에 저장
                    setLocalItem('accessToken', accessToken);
                    getLoginInfo(accessToken);
                } else {
                    console.error('Access Token not found in response headers');
                }
            })
            .catch(error => {
                console.error(error);
            });

    },[]);

    async function getLoginInfo (jwt) {

        if (jwt) {
            // axios를 사용하여 API 요청 보내기
            axios.post('/api/auth/loginfo', {}, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            })
                .then(response => {
                    console.log(response.data);
                    setSessionItem("profile", response.data.data);
                    window.location.replace("/home");
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                });
        } else {
            console.error('No access token found in local storage');
        }

    }
};

export default OAuth2RedirectHandler;
