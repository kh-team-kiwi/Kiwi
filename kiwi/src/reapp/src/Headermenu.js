import React from 'react';
import { Link } from 'react-router-dom';

function Headermenu({isLogin, setIsLogin}) {
    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('authExpr');
        sessionStorage.removeItem('userInfo');
        setIsLogin(false);
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
                        <li style={styles.li}><Link to="/regist" style={styles.link}>회원가입</Link></li>
                        <li style={styles.li}><Link to="/chat" style={styles.link}>채팅</Link></li>
                        <li style={styles.li}><Link to="/calendar" style={styles.link}>캘린더</Link></li>
                        <li style={styles.li}><Link to="/drive" style={styles.link}>드라이브</Link></li>
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
