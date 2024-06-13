import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import {Cookies} from "react-cookie";

function Headermenu({isLogin, setIsLogin}) {
    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('authExpr');
        sessionStorage.removeItem('userInfo');
        setIsLogin(false);
    };
    const cookies = new Cookies();
    const logout = async () => {
        console.log(cookies);

        axios.post("/logout")
            .then((res)=>{
                alert("logout // "+res);
            })
            .catch((err)=>{
                alert(err);
            });
    };

    return (
        <nav>
            <ul style={styles.ul}>
                <li style={styles.li}><Link to="/" style={styles.link}>홈</Link></li>
                {isLogin ? (
                    <>
                        <li style={styles.li}><Link to="/main" style={styles.link}>메인</Link></li>
                        <li style={styles.li}><Link to="/FileManagement" style={styles.link}>드라이브</Link></li>
                        <li style={styles.li}><Link to="/documents" style={styles.link}>전자결재</Link></li>
                        <li style={styles.li}><a onClick={handleLogout} style={styles.link}>로그아웃</a></li>
                    </>
                ) : (
                    <>
                        <li style={styles.li}><Link to="/login" style={styles.link}>로그인</Link></li>
                        <li style={styles.li}><Link to="/register" style={styles.link}>회원가입</Link></li>
                        <li style={styles.li}><Link to="/chat" style={styles.link}>채팅</Link></li>
                        <li style={styles.li}><Link to="/calendar" style={styles.link}>캘린더</Link></li>
                        <li style={styles.li}><Link to="/drive" style={styles.link}>드라이브</Link></li>
                        <li><button onClick={logout}>logout</button></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

const styles = {
    ul: {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'row'
    },
    li: {
        paddingRight: '10px'
    },
    link: {
        textDecoration: 'none',
        color: 'inherit'
    }
};



export default Headermenu;
