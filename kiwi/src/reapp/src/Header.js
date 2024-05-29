import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav>
            <ul style={styles.ul}>
                <li style={styles.li}><Link to="/" style={styles.link}>홈</Link></li>
                <li style={styles.li}><Link to="/login" style={styles.link}>로그인</Link></li>
                <li style={styles.li}><Link to="/regist" style={styles.link}>회원가입</Link></li>
                <li style={styles.li}><Link to="/FileManagement" style={styles.link}>드라이브</Link></li>
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


export default Header;
