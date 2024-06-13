import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';


import '../styles/pages/Login.css';
import googleImage from '../images/google.png';
import kakaoImage from '../images/kakao.png';
import naverImage from '../images/naver.png';

const Login = ({ setIsLogin }) => {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [languageOptionsVisible, setLanguageOptionsVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setInitialLoad(true);
        const timer = setTimeout(() => {
            setInitialLoad(false);
        }, 250);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('id:', email);
        console.log('password:', password);

        const response = await axios.post('/api/auth/login', {
            id: email,
            password: password})
            .then((response)=>{
                if(response.data.result){
                    console.log('로그인 성공:', response.data);
                    sessionStorage.setItem("accessToken",response.data.data.accessToken);
                    sessionStorage.setItem("refreshToken",response.data.data.refreshToken);
                    sessionStorage.setItem("userInfo",JSON.stringify(response.data.data.member));
                    setIsLogin(true);
                    navigate('/main',{replace:true});
                } else {
                    console.error('로그인 실패:', response.data);
                }
            })
            .catch((err)=>{
                console.error('로그인 실패:', err);
            });

    };

    const handleJoinNowClick = () => {
        setIsAnimating(true);
        setTimeout(() => {
            navigate('/register');
        }, 150); 
    };



    const handleDropdownClick = () => {
        if (languageOptionsVisible === true) {
          setLanguageOptionsVisible(false);
        } else {
          setLanguageOptionsVisible(true);
        }
  
      };
  
      const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLanguageOptionsVisible(false);
      };
    
      const handleLanguageClick = () => {
        setLanguageOptionsVisible(true); 
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
        <div className="login-background">
            <div onClick={handleDropdownClick} >
                <div className='change-language-button'>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-globe" viewBox="0 0 16 16">
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
                        </svg>

                    </div>

                    <div>
                    &nbsp; {t('language')}

                    </div>
                </div>
            </div>
            {languageOptionsVisible && (
      <div className='login-language-list'>
      
        <div onClick={() => changeLanguage('ko')}>한국어</div>
        <div onClick={() => changeLanguage('en')}>English</div>
        <div onClick={() => changeLanguage('es')}>Español</div>
        <div onClick={() => changeLanguage('fr')}>Français</div>
        <div onClick={() => changeLanguage('ja')}>日本語</div>
        <div onClick={() => changeLanguage('zh')}>中文</div>
        <div onClick={() => changeLanguage('de')}>Deutsch</div>
      </div>
    )}

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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('email')}
                    />
                </div>
                <div className="login-input-container">
                <div className="login-icon-container" >
                    <svg className='login-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="gray" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"/>
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
                        username: <Link to="#" title="Username" />,
                        password: <Link to="#" title="Password" />
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
