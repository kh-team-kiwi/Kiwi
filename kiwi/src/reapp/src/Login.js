// src/Login.js
import React, { useState } from 'react';
import './css/Login.css';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Login = ({setIsLogin}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 여기에 로그인 로직을 추가하면 됩니다.
        console.log('id:', email);
        console.log('password:', password);

        const response = await axios.post('/api/auth/login', {
            id: email,
            password: password})
            .then((response)=>{
                if(response.data.result){
                    // 로그인 성공 시 처리
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
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Login</h2>
                <div style={styles.inputGroup}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Login</button>
                <button className="naverBtn" onClick={naverLogin}></button>
                <button className="googleBtn" onClick={googleLogin}></button>
                <button className="kakaoBtn" onClick={kakaoLogin}></button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    form: {
        padding: '2rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    inputGroup: {
        marginBottom: '1rem',
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        marginTop: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Login;