import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import backgroundImage from '../images/background.png'; 

import ToggleLanguageButton from '../components/common/ToggleLanguageButton';
import Logo from '../components/common/Logo';

import EmailIcon from '../images/svg/account/EmailIcon';
import PasswordIcon from '../images/svg/account/PasswordIcon';
import ProfileIcon from '../images/svg/account/ProfileIcon';
import ExitIcon from '../images/svg/buttons/ExitIcon';


import '../styles/pages/Register.css';

const Register = () => {
    const { t } = useTranslation();
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
                                <EmailIcon className='register-icon' />
                            </div>
                            <input className="register-id-input" type="text" id="memberId" name="memberId"
                                   placeholder={t('email')} value={formData.memberId} onChange={handleChange} required/>
                        </div>
                        {/* <div className="register-email-check">{emailCheckText}</div> */}
                        <div className='register-input-container'>
                            <div className="register-icon-container">
                                <ProfileIcon className='register-icon'/>
                            </div>
                            <input className="register-name-input" type="text" id="memberNickname" name="memberNickname"
                                   placeholder={t('username')} value={formData.memberNickname} onChange={handleChange}
                                   required/>
                        </div>
                    </div>

                    <div className='register-field-group'>
                        <div className='register-input-container'>
                            <div className="register-icon-container">
                                <PasswordIcon className='register-icon'/>
                            </div>
                            <input className="register-password-input" type="password" id="memberPwd" name="memberPwd" placeholder={t('password')} value={formData.memberPwd} onChange={handleChange} required />
                        </div>
                        <div className='register-input-container'>
                            <div className="register-icon-container">
                                <PasswordIcon className='register-icon'/>
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
                    <div  onClick={toggleTac}>
                        <ExitIcon className='tac-exit'/>
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
