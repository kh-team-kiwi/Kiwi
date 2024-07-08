import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import '../styles/pages/Login.css';

import { toast } from 'react-toastify';


import backgroundImage from '../images/background.png'; 
import ToggleLanguageButton from '../components/common/ToggleLanguageButton';
import Logo from '../components/common/Logo';

import googleImage from '../images/google.png';
import kakaoImage from '../images/kakao.png';
import naverImage from '../images/naver.png';

import EmailIcon from '../images/svg/account/EmailIcon';
import PasswordIcon from '../images/svg/account/PasswordIcon';




import axiosHandler from "../jwt/axiosHandler";
import {setLocalItem, setSessionItem} from "../jwt/storage";

const Login = () => {
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
            const response = await axios.post('api/auth/login', {
                username: username,
                password: password});

            if (response.status === 200) {
                const accessToken = response.headers['authorization'];
                if (accessToken) {
                    // 로컬 스토리지에 저장
                    setLocalItem("accessToken",accessToken);
                    getLoginInfo(accessToken);
                }
            }

        } catch (error) {
            console.log(error);
            if ( error.response.status === 401){
                toast.error('Invalid Login. Please check your username or password.')
            }
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
            setSessionItem("profile", response.data.data);
            window.location.replace("/home");
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
        });

    }
//login.js / storage.js / ResponseDto / AuthService
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
                            <EmailIcon className='login-icon' />
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
                        <PasswordIcon className='login-icon' />

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
                    <img className='social-media-icon' src={googleImage} onClick={googleLogin} alt='Google'/>
                </button>
                <button className='social-media-container'>
                    <img className='social-media-icon' src={kakaoImage} onClick={kakaoLogin} alt='Kakao'/>
                </button>
                <button className='social-media-container'>
                    <img className='social-media-icon' src={naverImage} onClick={naverLogin} alt='Naver'/>
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
