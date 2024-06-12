import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/pages/Register.css';

const Register = () => {
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


    const [formData, setFormData] = useState({
        memberId: '',
        memberPwd: '',
        confirmPwd: '',
        memberFilepath: '',
        memberNickname: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const response = await axios.post('/api/auth/signup', formData)
            .then((res)=>{
                if(res.data.result){
                    console.log('회원가입 성공:', res.data);
                    navigate('/',{replace:true});
                } else {
                    console.error('회원가입 실패:', res.data);
                }

            }).catch((err)=>{
                console.error("회원가입 실패:",err)
            });
    };

    const handleLoginClick = () => {
        setIsAnimating(true);
        setTimeout(() => {
            navigate('/login');
        }, 150); 
    };

    return (
        <div className={`register-container ${initialLoad ? 'flick-down' : ''} ${isAnimating ? 'flick-up' : ''}`}>
            <form onSubmit={handleSubmit}>
                <div>Create Account</div>
                <div>
                    <input className="register-id-input" type="text" id="memberId" name="memberId" placeholder='User Id' value={formData.memberId} onChange={handleChange}
                           required/>
                </div>
                <div>
                    <input className="register-password-input"  type="password" id="memberPwd" name="memberPwd" placeholder='Password' value={formData.memberPwd}
                           onChange={handleChange} required/>
                </div>
                <div>
                    <input className="register-id-input" type="password" id="confirmPwd" name="confirmPwd" placeholder='Comfirm Password' value={formData.confirmPwd}
                           onChange={handleChange} required/>
                </div>
                <div>
                    <input className="register-name-input" type="text" id="memberNickname" name="memberNickname" placeholder='Name' value={formData.memberNickname}
                           onChange={handleChange} required/>
                </div>
                <button className="register-button" type="submit">가입하기</button>
            </form>
            <div className="already-have-account">
                <Link to="#" onClick={handleLoginClick}>Already have an account?</Link>
            </div>
        </div>
    );
};

export default Register;
