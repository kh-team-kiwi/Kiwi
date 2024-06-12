import React, { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import '../styles/pages/Login.css';


const Login = ({setIsLogin}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <div>
                    <label>Email:</label>
                    <input  
                        className= "login-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        className= "login-password-input"

                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};



export default Login;