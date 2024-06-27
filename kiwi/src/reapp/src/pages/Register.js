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

import RegularCircle from "../images/svg/checkbox/RegularCircle";
import CheckedCircle from "../images/svg/checkbox/CheckedCircle"

const Register = () => {
    const { t } = useTranslation();
    const [isAnimating, setIsAnimating] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [showTac, setShowTac] = useState(false);
    const [tacChecked, setTacChecked] = useState(false);
    const [showValidator, setShowValidator] = useState(false);
    const [validatorType, setValidatorType] = useState("");

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

    const [emailCheck, setEmailCheck] = useState({
        emptyWhitespacePattern: false,
        emailPattern: false,
        duplicatePattern: false
    })

    const [usernameCheck, setUsernameCheck] = useState({
        emptyWhitespacePattern: false,
        least2char:false
    })

    const [passwordCheck, setPasswordCheck] = useState({
        emptyWhitespacePattern: false,
        least8char: false,
        specialSymbol: false,
        duplicatePattern: false
    })

    const [confirmPwCheck, setConfirmPwCheck] = useState({
        emptyWhitespacePattern: false,
        least8char: false,
        specialSymbol: false,
        duplicatePattern: false
    })

    const [registerBtn, setRegisterBtn] = useState(true);

    useEffect(() => {
        if (emailCheck.emailPattern && emailCheck.emptyWhitespacePattern) {
            // 중복 검사 실행
            axios.post("/api/auth/duplicate", { 'memberId': formData.memberId })
                .then(res => {
                    setEmailCheck(prevState => ({...prevState, duplicatePattern: res.data.result}));
                })
                .catch(error => {
                    console.error("handleChange >> email check : "+error);
                });
        } else {
            // 조건 미충족 시 duplicatePattern false 설정
            setEmailCheck(prevState => ({...prevState, duplicatePattern: false}));
        }
    }, [emailCheck.emailPattern, emailCheck.emptyWhitespacePattern, formData.memberId]); // 의존성 배열에 포함

    useEffect(() => {
        if(passwordCheck.emptyWhitespacePattern && passwordCheck.least8char && passwordCheck.specialSymbol) {
            if(formData.memberPwd === formData.confirmPwd) {
                setPasswordCheck(prevState => ({ ...prevState, duplicatePattern: true}));
            } else {
                setPasswordCheck(prevState => ({ ...prevState, duplicatePattern: false}));
            }
        } else {
            setPasswordCheck(prevState => ({...prevState, duplicatePattern: false}));
        }
    }, [passwordCheck.emptyWhitespacePattern, passwordCheck.least8char, passwordCheck.specialSymbol, confirmPwCheck.duplicatePattern, formData.memberPwd]);

    useEffect(() => {
        if(confirmPwCheck.emptyWhitespacePattern && confirmPwCheck.least8char && confirmPwCheck.specialSymbol) {
            if(formData.memberPwd === formData.confirmPwd) {
                setConfirmPwCheck(prevState => ({ ...prevState, duplicatePattern: true}));
            } else {
                setConfirmPwCheck(prevState => ({ ...prevState, duplicatePattern: false}));
            }
        } else {
            setConfirmPwCheck(prevState => ({...prevState, duplicatePattern: false}));
        }
    }, [confirmPwCheck.emptyWhitespacePattern, confirmPwCheck.least8char, confirmPwCheck.specialSymbol, passwordCheck.duplicatePattern, formData.confirmPwd]);


    useEffect(() => {
        if(tacChecked && formStateCheck(emailCheck) && formStateCheck(usernameCheck) && formStateCheck(passwordCheck) && formStateCheck(confirmPwCheck)) {
            setRegisterBtn(false);
        } else {
            setRegisterBtn(true);
        }
    }, [tacChecked, emailCheck, usernameCheck, passwordCheck, confirmPwCheck]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        validateInput(e.target);
    };

    const validateInput = (target) => {
        const emptyPattern = target.value.length===0;
        const whitespacePattern = /^\s*$/.test(target.value);
        const noSpacesPattern = /^\S+$/.test(target.value);

        setPatternCheck(target.name, 'emptyWhitespacePattern', !emptyPattern && !whitespacePattern && noSpacesPattern);

        if(target.name==='memberPwd' ){
            const least8char = /^[\w가-힣!@#$%^]{8,16}$/.test(target.value);
            let specialSymbol = /^(?=.*[!@#$%^])[a-zA-Z0-9!@#$%^]{8,16}$/.test(target.value);
            if(!least8char) specialSymbol=false;
            setPasswordCheck(prevState => ({...prevState, least8char: least8char, specialSymbol:specialSymbol}));
        } else if(target.name==='confirmPwd' ) {
            const least8char = /^[\w가-힣!@#$%^]{8,16}$/.test(target.value);
            let specialSymbol = /^(?=.*[!@#$%^])[a-zA-Z0-9!@#$%^]{8,16}$/.test(target.value);
            if(!least8char) specialSymbol=false;
            setConfirmPwCheck(prevState => ({...prevState, least8char: least8char, specialSymbol:specialSymbol}));
        }


        if(target.name==='memberId'){
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(target.value);
            setEmailValidate('emailPattern',emailPattern);
        }

        if(target.name==='memberNickname') {
            const least2char = /^[\w가-힣]{2,10}$/.test(target.value);
            setUsernameCheck(prevState => ({...prevState, least2char: least2char}));
        }
    };

    const setPatternCheck = (field, patternType, value) => {
        switch (field) {
            case 'memberId':
                setEmailCheck(prevState => ({ ...prevState, [patternType]: value }));
                break;
            case 'memberNickname':
                setUsernameCheck(prevState => ({ ...prevState, [patternType]: value }));
                break;
            case 'memberPwd':
                setPasswordCheck(prevState => ({ ...prevState, [patternType]: value }));
                break;
            case 'confirmPwd':
                setConfirmPwCheck(prevState => ({ ...prevState, [patternType]: value }));
                break;
            default:
                break;
        }
    };

    const setEmailValidate = (patternType, value) => {
        setEmailCheck(prevState => ({ ...prevState, [patternType]: value }));
    }


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

    const formStateCheck = (state) => {
        for(const [key, value] of Object.entries(state)){
            if(!value) return value;
        }
        return true;
    }

    const handleLoginClick = () => {
        setIsAnimating(true);
        setTimeout(() => {
            navigate('/');
        }, 150); 
    };

    const handleFocus = (e) => {
        setValidatorType(e.target.id);
        setShowValidator(true);
    }

    const handleBlur = () => {
        setValidatorType("")
        setShowValidator(false);
    }

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
                                <EmailIcon className={`register-icon ${emailCheck.emailPattern && emailCheck.emptyWhitespacePattern && emailCheck.duplicatePattern ? 'clear' : ''}`}/>
                            </div>
                            <input className="register-id-input" type="text" id="memberId" name="memberId"
                                   placeholder={t('email')} value={formData.memberId} onChange={handleChange}
                                   onFocus={handleFocus} onBlur={handleBlur} required/>
                        </div>
                        <div className='register-input-container'>
                            <div className="register-icon-container">
                                <ProfileIcon className={`register-icon ${usernameCheck.least2char && usernameCheck.emptyWhitespacePattern ? 'clear' : ''}`}/>
                            </div>
                            <input className="register-name-input" type="text" id="memberNickname" name="memberNickname"
                                   placeholder={t('username')} value={formData.memberNickname} onChange={handleChange}
                                   onFocus={handleFocus} onBlur={handleBlur} required/>
                        </div>
                    </div>

                    <div className='register-field-group'>
                        <div className='register-input-container'>
                            <div className="register-icon-container">
                                <PasswordIcon className={`register-icon ${passwordCheck.specialSymbol && passwordCheck.duplicatePattern && passwordCheck.emptyWhitespacePattern && passwordCheck.duplicatePattern ? 'clear' : ''}`}/>
                            </div>
                            <input className="register-password-input" type="password" id="memberPwd" name="memberPwd"
                                   placeholder={t('password')} value={formData.memberPwd} onChange={handleChange}
                                   onFocus={handleFocus} onBlur={handleBlur} required/>
                        </div>
                        <div className='register-input-container'>
                            <div className="register-icon-container">
                                <PasswordIcon className={`register-icon ${confirmPwCheck.specialSymbol && confirmPwCheck.duplicatePattern && confirmPwCheck.emptyWhitespacePattern && confirmPwCheck.duplicatePattern ? 'clear' : ''}`}/>
                            </div>
                            <input className="register-password-input" type="password" id="confirmPwd" name="confirmPwd"
                                   placeholder={t('confirm-password')} value={formData.confirmPwd}
                                   onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange} required/>
                        </div>
                    </div>

                    <div className="tac-container">
                        <input type="checkbox" checked={tacChecked} id="tac-checkbox"
                               onChange={() => setTacChecked(!tacChecked)}/>
                        &nbsp;{t('accept')} <span className="blue-text"
                                                  onClick={toggleTac}>{t('terms-and-conditions')}</span>
                    </div>

                    <button className="register-button" type="submit" disabled={registerBtn}>{t('create-account')} </button>
                </form>
                <div className="already-have-account">
                    <Link to="#" onClick={handleLoginClick}
                          className="tac-text blue-text">{t('already-have-an-account')}</Link>
                </div>
            </div>
            <div className={`tac-dialogue-box ${showTac ? 'show' : 'hide'}`}>
                <div className="tac-header">
                    <div className="tac-top">
                        <b>{t('terms-and-conditions')}</b>
                    </div>
                    <div onClick={toggleTac}>
                        <ExitIcon className='tac-exit'/>
                    </div>

                </div>


                <div className="tac-text">
                    <ol>
                        <li>
                            <div><span
                                className='bold-text'>{t('terms.acceptance-of-terms-title')}:</span> {t('terms.acceptance-of-terms')}
                            </div>
                        </li>
                        <br/>
                        <li>
                            <div><span
                                className='bold-text'>{t('terms.user-registration-title')}:</span> {t('terms.user-registration')}
                            </div>
                        </li>
                        <br/>
                        <li>
                            <div><span
                                className='bold-text'>{t('terms.user-conduct-title')}:</span> {t('terms.user-conduct')}
                            </div>
                        </li>
                        <br/>
                        <li>
                            <div><span
                                className='bold-text'>{t('terms.content-guidelines-title')}:</span> {t('terms.content-guidelines')}
                            </div>
                        </li>
                        <br/>
                        <li>
                            <div><span className='bold-text'>{t('terms.privacy-title')}:</span> {t('terms.privacy')}
                            </div>
                        </li>
                        <br/>
                        <li>
                            <div><span
                                className='bold-text'>{t('terms.intellectual-property-title')}:</span> {t('terms.intellectual-property')}
                            </div>
                        </li>
                        <br/>
                        <li>
                            <div><span
                                className='bold-text'>{t('terms.termination-title')}:</span> {t('terms.termination')}
                            </div>
                        </li>
                        <br/>
                        <li>
                            <div><span
                                className='bold-text'>{t('terms.changes-to-terms-title')}:</span> {t('terms.changes-to-terms')}
                            </div>
                        </li>
                        <br/>
                        <li>
                            <div><span
                                className='bold-text'>{t('terms.disclaimer-of-warranties-title')}:</span> {t('terms.disclaimer-of-warranties')}
                            </div>
                        </li>
                        <br/>
                        <li>
                            <div><span
                                className='bold-text'>{t('terms.limitation-of-liability-title')}:</span> {t('terms.limitation-of-liability')}
                            </div>
                        </li>
                        <br/>
                        <li>
                            <div><span
                                className='bold-text'>{t('terms.governing-law-title')}:</span> {t('terms.governing-law')}
                            </div>
                        </li>
                        <br/>
                    </ol>

                </div>

                <div className="tac-bottom">
                    <button className="tac-button decline" onClick={() => tacResponse(false)}>{t('decline')}</button>
                    <button className="tac-button accept" onClick={() => tacResponse(true)}>{t('accept')}</button>
                </div>
            </div>
            <div
                className={`validator-email-box ${showValidator && validatorType === 'memberId' ? 'show' : 'hide'}`}>
                <div className='validator-header'>
                    {/*<b>{t('terms-and-conditions')}</b>*/}
                </div>
                <ul className='validator-content'>
                    <li>
                        <span>공백이 없어야 합니다.</span>
                        <span>{emailCheck.emptyWhitespacePattern ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}</span>
                    </li>
                    <li>
                        <span>이메일 형식을 지켜주세요.</span>
                        <span>{emailCheck.emailPattern ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}</span>
                    </li>
                    <li>
                        <span>중복되지 않은 이메일 입니다.</span>
                        <span>{emailCheck.duplicatePattern ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}</span>
                    </li>
                </ul>
            </div>
            <div
                className={`validator-username-box ${showValidator && validatorType === 'memberNickname' ? 'show' : 'hide'}`}>
                <div className='validator-header'>
                    {/*<b>{t('terms-and-conditions')}</b>*/}
                </div>
                <ul className='validator-content'>
                    <li>
                        <span>공백이 없어야 합니다.</span>
                        <span>{usernameCheck.emptyWhitespacePattern ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}</span>
                    </li>
                    <li>
                        <span>2글자 이상 10글자 이하만 가능합니다.</span>
                        <span>{usernameCheck.least2char ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}</span>
                    </li>
                </ul>
            </div>
            <div
                className={`validator-password-box ${showValidator && validatorType === 'memberPwd' ? 'show' : 'hide'}`}>
                <div className='validator-header'>
                    {/*<b>{t('terms-and-conditions')}</b>*/}
                </div>
                <ul className='validator-content'>
                    <li>
                        <span>공백이 없어야 합니다.</span>
                        <span>{passwordCheck.emptyWhitespacePattern ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}</span>
                    </li>
                    <li>
                        <span>최소 8글자 이상이어야합니다.</span>
                        <span>{passwordCheck.least8char ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}</span>
                    </li>
                    <li>
                        <span>특수문자(!@#$%^)를 포함해야합니다.</span>
                        <span>{passwordCheck.specialSymbol ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}</span>
                    </li>
                    <li>
                        <span>비밀번호가 일치합니다.</span>
                        <span>{passwordCheck.duplicatePattern ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}</span>
                    </li>
                </ul>
            </div>
            <div
                className={`validator-confirmPW-box ${showValidator && validatorType === 'confirmPwd' ? 'show' : 'hide'}`}>
                <div className='validator-header'>
                    {/*<b>{t('terms-and-conditions')}</b>*/}
                </div>
                <ul className='validator-content'>
                    <li>
                        <span>공백이 없어야 합니다.</span>
                        {confirmPwCheck.emptyWhitespacePattern ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}
                    </li>
                    <li>
                        <span>최소 8글자 이상이어야합니다.</span>
                        <span>{confirmPwCheck.least8char ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}</span>
                    </li>
                    <li>
                        <span>특수문자(!@#$%^)를 포함해야합니다.</span>
                        <span>{confirmPwCheck.specialSymbol ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}</span>
                    </li>
                    <li>
                        <span>비밀번호가 일치합니다.</span>
                        <span>{confirmPwCheck.duplicatePattern ? <CheckedCircle className='checkedCircle'/> :
                            <RegularCircle className='regularCircle'/>}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Register;