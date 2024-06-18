import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import backgroundImage from '../images/background.png'; 

import ToggleLanguageButton from '../components/common/ToggleLanguageButton';
import Logo from '../components/common/Logo';



import '../styles/pages/Register.css';

const Register = () => {
    const { t, i18n } = useTranslation();
    const [isAnimating, setIsAnimating] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
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



    return (
        <div>
            <Logo/>

            <ToggleLanguageButton/>

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
                        {/* <div className="register-email-check">{emailCheckText}</div> */}
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
