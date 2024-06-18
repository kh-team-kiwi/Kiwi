import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import backgroundImage from '../images/background.png'; 

import ToggleLanguageButton from '../components/common/ToggleLanguageButton';
import Logo from '../components/common/Logo';



import '../styles/pages/Login.css';
import googleImage from '../images/google.png';
import kakaoImage from '../images/kakao.png';
import naverImage from '../images/naver.png';
import axiosHandler from "../jwt/axiosHandler";
import {setLocalItem, setSessionItem} from "../jwt/storage";

const Login = ({ setIsLogin }) => {
    const { t, i18n } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);


    const navigate = useNavigate();

    useEffect(() => {
        setInitialLoad(true);
        const timer = setTimeout(() => {
            setInitialLoad(false);
        }, 250);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        document.body.style.backgroundImage = `url(${backgroundImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.height = '100vh';
        document.body.style.margin = '0';

        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundRepeat = '';
            document.body.style.height = '';
            document.body.style.margin = '';
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('id:', username);
        console.log('password:', password);
        try {
            const response = await axiosHandler.post('api/auth/login', {
                username: username,
                password: password});

            if (response.status === 200) {
                const accessToken = response.headers['authorization'];
                if (accessToken) {
                    // 로컬 스토리지에 저장
                    setLocalItem("accessToken",accessToken);
                    setIsLogin(true);
                    getLoginInfo(accessToken);
                }
            }
        } catch (error) {
            console.log(error);
        }

    };

    function getLoginInfo (jwt) {
        // axios를 사용하여 API 요청 보내기
        axios.post('/api/auth/loginfo', {}, {
            headers: {
                'authorization': `Bearer ${jwt}`
            }
        })
            .then(response => {
                console.log(response.data);
                setSessionItem("profile", response.data.data);
                navigate("/home");
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
    }

    const handleJoinNowClick = () => {
        setIsAnimating(true);
        setTimeout(() => {
            navigate('/register');
        }, 150); 
    };


    const naverLogin = () => {

        window.location.href = "http://localhost:8080/oauth2/authorization/naver"
    }

    const googleLogin = () => {

        window.location.href = "http://localhost:8080/oauth2/authorization/google"
    }

    const kakaoLogin = () => {

        window.location.href = "http://localhost:8080/oauth2/authorization/kakao"

    }

    return (
        <div>
            <Logo/>

            <ToggleLanguageButton/>

          <div className={`login-container ${initialLoad ? 'flick-down' : ''} ${isAnimating ? 'flick-up' : ''}`}>
            <form onSubmit={handleSubmit} className="login-form">
                <div className='login-title'>{t('login')}</div>
                <div className="login-input-container">

                    <div className="login-icon-container">
                        <svg className='login-icon' xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="gray" viewBox="0 0 16 16">
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                        </svg>
                    </div>

                    <input
                        className="login-email-input"
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={t('email')}
                    />
                </div>
                <div className="login-input-container">
                <div className="login-icon-container" >
                    <svg className='login-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="gray" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"/>
                    </svg>

                </div>

                    <input
                        className="login-password-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('password')}
                    />
                </div>
                <div className="forgot">
                    <Trans
                    i18nKey="forgot"
                    components={{
                        username: <Link className="forgot-link" to="#" title="Username" />,
                        password: <Link className="forgot-link" to="#" title="Password" />
                    }}
                    />         
                </div>
                <button type="submit" className="login-button">{t('login')}</button>
            </form>
            <div className='login-divider'>
                <div className='line' />
                <span className="divider-text">
                {t('or')} 

                </span>
                <div className='line' />
            </div>
            <div className="login-with-social-media">
                <button className='social-media-container'>
                    <img className='social-media-icon' src={googleImage} onClick={googleLogin} />
                </button>
                <button className='social-media-container'>
                    <img className='social-media-icon' src={kakaoImage} onClick={kakaoLogin} />
                </button>
                <button className='social-media-container'>
                    <img className='social-media-icon' src={naverImage} onClick={naverLogin} />
                </button>
            </div>
            <div className="create-account">
            {t('new-to-kiwi')} <Link to="#" onClick={handleJoinNowClick}>{t('join-now')}</Link>
            </div>
        </div>

        </div>
        
    );
};

export default Login;
