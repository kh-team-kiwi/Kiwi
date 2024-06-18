import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import backgroundImage from '../images/background.png'; 
import kiwiImage from '../images/kiwi.png'; 
import kiwiWord from '../images/kiwi-word.png'; 

import '../styles/pages/Register.css';

const Register = () => {
    const { t, i18n } = useTranslation();
    const [languageOptionsVisible, setLanguageOptionsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
    const [showTac, setShowTac] = useState(false);
    const [tacChecked, setTacChecked] = useState(false);

    const toggleTac = () => {
        setShowTac(prevShowTac => !prevShowTac);
    };

    const tacResponse = (response) => {
        setShowTac(false);
        setTacChecked(response);
    };

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

    const [formData, setFormData] = useState({
        memberId: '',
        memberPwd: '',
        confirmPwd: '',
        memberFilepath: '',
        memberNickname: ''
    });

    const [emailCheckText, setEmailCheckText] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // 중복검사
        if (name === 'memberId') {
            axios.post("/api/auth/duplicate",{ 'memberId': value })
                .then(res => {
                    console.log(res.data);
                    if(res.data){
                        setEmailCheckText(res.data.message);
                    }
                })
                .catch(error => {
                    console.error("handleChange >> email check : "+error);
                });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const response = await axios.post('/api/auth/signup', formData)
            .then((res) => {
                if (res.data.result) {
                    console.log('회원가입 성공:', res.data);
                    alert(res.data.message);
                    navigate('/',{replace:true});
                } else {
                    console.error('회원가입 실패:', res.data);
                    alert(res.data.message)
                }
            }).catch((err) => {
                console.error("회원가입 실패:", err);
            });
    };

    const handleLoginClick = () => {
        setIsAnimating(true);
        setTimeout(() => {
            navigate('/');
        }, 150); 
    };

    const handleDropdownClick = () => {
        setLanguageOptionsVisible(prev => !prev);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setSelectedLanguage(lng);

        setLanguageOptionsVisible(false);
      };

    return (
        <div>
            <div className="logo-container">
                <img src={kiwiImage} alt="Kiwi-icon" className='kiwi-icon' />
                <img src={kiwiWord} alt="Kiwi-word" className='kiwi-word' />
            </div>

            <div className='change-language-button-container'>
                <div onClick={handleDropdownClick} className={`change-language-button ${languageOptionsVisible ? 'clicked' : ''}`}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-globe" viewBox="0 0 16 16">
                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
                        </svg>
                    </div>

                    <div>
                        &nbsp; {t('language')} &nbsp;
                    </div>

                    <div className={`down-arrow ${languageOptionsVisible ? 'flipped' : ''}`}>
                        <svg width="17" height="9" viewBox="0 0 17 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.183617 0.183617C0.241674 0.125413 0.310644 0.0792341 0.386575 0.047726C0.462507 0.016218 0.543908 0 0.626117 0C0.708326 0 0.789728 0.016218 0.865659 0.047726C0.941591 0.0792341 1.01056 0.125413 1.06862 0.183617L8.12612 7.24237L15.1836 0.183617C15.2417 0.125507 15.3107 0.0794115 15.3866 0.0479627C15.4626 0.0165138 15.5439 0.000327229 15.6261 0.000327229C15.7083 0.000327229 15.7897 0.0165138 15.8656 0.0479627C15.9415 0.0794115 16.0105 0.125507 16.0686 0.183617C16.1267 0.241727 16.1728 0.310713 16.2043 0.386637C16.2357 0.462562 16.2519 0.543937 16.2519 0.626117C16.2519 0.708297 16.2357 0.789672 16.2043 0.865596C16.1728 0.941521 16.1267 1.01051 16.0686 1.06862L8.56862 8.56862C8.51056 8.62682 8.44159 8.673 8.36566 8.70451C8.28973 8.73602 8.20833 8.75223 8.12612 8.75223C8.04391 8.75223 7.96251 8.73602 7.88658 8.70451C7.81064 8.673 7.74167 8.62682 7.68362 8.56862L0.183617 1.06862C0.125413 1.01056 0.0792347 0.94159 0.0477266 0.865659C0.0162186 0.789728 0 0.708326 0 0.626117C0 0.543908 0.0162186 0.462506 0.0477266 0.386575C0.0792347 0.310643 0.125413 0.241674 0.183617 0.183617Z" fill="black"/>
                        </svg>
                    </div>
                </div>
                {languageOptionsVisible && (
                    <div className='login-language-list'>
                        <div onClick={() => changeLanguage('ko')} className={selectedLanguage === 'ko' ? 'selected-language' : ''}>한국어</div>
                        <div onClick={() => changeLanguage('en')} className={selectedLanguage === 'en' ? 'selected-language' : ''}>English</div>
                        <div onClick={() => changeLanguage('es')} className={selectedLanguage === 'es' ? 'selected-language' : ''}>Español</div>
                        <div onClick={() => changeLanguage('fr')} className={selectedLanguage === 'fr' ? 'selected-language' : ''}>Français</div>
                        <div onClick={() => changeLanguage('de')} className={selectedLanguage === 'de' ? 'selected-language' : ''}>Deutsch</div>
                        <div onClick={() => changeLanguage('ja')} className={selectedLanguage === 'ja' ? 'selected-language' : ''}>日本語</div>
                        <div onClick={() => changeLanguage('zh')} className={selectedLanguage === 'zh' ? 'selected-language' : ''}>中文</div>
                    </div>
                )}
            </div>

            <div className={`register-container ${initialLoad ? 'flick-down' : ''} ${isAnimating ? 'flick-up' : ''}`}>
                <form onSubmit={handleSubmit}>
                    <div className='register-title'>{t('create-account')}</div>

                    <div className='register-field-group'>
                        <div className='register-input-container'>
                            <div className="register-icon-container">
                                <svg className='register-icon' xmlns="http://www.w3.org/2000/svg" width="23" height="23"
                                     fill="gray" viewBox="0 0 16 16">
                                    <path
                                        d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                                </svg>
                            </div>
                            <input className="register-id-input" type="text" id="memberId" name="memberId"
                                   placeholder={t('email')} value={formData.memberId} onChange={handleChange} required/>
                        </div>
                        <div className="register-email-check">{emailCheckText}</div>
                        <div className='register-input-container'>
                            <div className="register-icon-container">
                                <svg className='register-icon' xmlns="http://www.w3.org/2000/svg" width="23" height="23"
                                     fill="gray" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                </svg>
                            </div>
                            <input className="register-name-input" type="text" id="memberNickname" name="memberNickname"
                                   placeholder={t('username')} value={formData.memberNickname} onChange={handleChange}
                                   required/>
                        </div>
                    </div>

                    <div className='register-field-group'>
                        <div className='register-input-container'>
                            <div className="register-icon-container">
                                <svg className='register-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="gray" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"/>
                                </svg>
                            </div>
                            <input className="register-password-input" type="password" id="memberPwd" name="memberPwd" placeholder={t('password')} value={formData.memberPwd} onChange={handleChange} required />
                        </div>
                        <div className='register-input-container'>
                            <div className="register-icon-container">
                                <svg className='register-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="gray" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"/>
                                </svg>
                            </div>
                            <input className="register-password-input" type="password" id="confirmPwd" name="confirmPwd" placeholder={t('confirm-password')} value={formData.confirmPwd} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="tac-container">
                    <input type="checkbox" checked={tacChecked} id="tac-checkbox" onChange={() => setTacChecked(!tacChecked)} />
                    &nbsp;{t('accept')} <span className="blue-text" onClick={toggleTac}>{t('terms-and-conditions')}</span>
                    </div>

                    <button className="register-button" type="submit" >{t('create-account')}</button>
                </form>
                <div className="already-have-account">
                    <Link to="#" onClick={handleLoginClick} className="tac-text blue-text">{t('already-have-an-account')}</Link>
                </div>
            </div>
            <div className={`tac-dialogue-box ${showTac ? 'show' : 'hide'}`}>
                <div className="tac-header">
                    <div className="tac-top">
                        <b>{t('terms-and-conditions')}</b>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" id="tac-exit" onClick={toggleTac} viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </div>

                </div>


                <div className="tac-text">
                <ol>
                    <li>
                        <div><span className='bold-text'>{t('terms.acceptance-of-terms-title')}:</span> {t('terms.acceptance-of-terms')}</div>
                    </li><br />
                    <li>
                        <div><span className='bold-text'>{t('terms.user-registration-title')}:</span> {t('terms.user-registration')}</div>
                    </li><br />
                    <li>
                        <div><span className='bold-text'>{t('terms.user-conduct-title')}:</span> {t('terms.user-conduct')}</div>
                    </li><br />
                    <li>
                        <div><span className='bold-text'>{t('terms.content-guidelines-title')}:</span> {t('terms.content-guidelines')}</div>
                    </li><br />
                    <li>
                        <div><span className='bold-text'>{t('terms.privacy-title')}:</span> {t('terms.privacy')}</div>
                    </li><br />
                    <li>
                        <div><span className='bold-text'>{t('terms.intellectual-property-title')}:</span> {t('terms.intellectual-property')}</div>
                    </li><br />
                    <li>
                        <div><span className='bold-text'>{t('terms.termination-title')}:</span> {t('terms.termination')}</div>
                    </li><br />
                    <li>
                        <div><span className='bold-text'>{t('terms.changes-to-terms-title')}:</span> {t('terms.changes-to-terms')}</div>
                    </li><br />
                    <li>
                        <div><span className='bold-text'>{t('terms.disclaimer-of-warranties-title')}:</span> {t('terms.disclaimer-of-warranties')}</div>
                    </li><br />
                    <li>
                        <div><span className='bold-text'>{t('terms.limitation-of-liability-title')}:</span> {t('terms.limitation-of-liability')}</div>
                    </li><br />
                    <li>
                        <div><span className='bold-text'>{t('terms.governing-law-title')}:</span> {t('terms.governing-law')}</div>
                    </li><br />
                    </ol>

                </div>

                <div className="tac-bottom">
                    <button className="tac-button decline" onClick={() => tacResponse(false)}>{t('decline')}</button>
                    <button className="tac-button accept" onClick={() => tacResponse(true)}>{t('accept')}</button>
                </div>
            </div>
        </div>
    );
};

export default Register;
