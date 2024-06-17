import DocumentDetail from './components/documents/DocumentDetails'; // DocumentDetail 컴포넌트를 import 합니다
import './styles/App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import FileManagement from "./components/drive/FileManagement";
import Main from './pages/Main';
import Documents from "./pages/Documents";
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import Drive from './pages/Drive';
import Header from './components/common/Header';
import OAuth2RedirectHandler from './jwt/OAuth2RedirectHandler';

function App() {
    const [isLogin, setIsLogin] = useState({ result:false});

    const location = useLocation();
    const hideHeaderPaths = ['/chat', '/calendar', '/drive', '/documents'];
    const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken');
        setIsLogin(authToken !== null);
    }, []);

    return (
        <>
            {shouldHideHeader && <Header />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
                <Route path="/FileManagement" element={<FileManagement />} />
                <Route path="/main" element={<Main />} />
                <Route path='/chat' element={<Chat />} />
                <Route path='/calendar' element={<Calendar />} />
                <Route path='/drive' element={<Drive />} />
                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                <Route path="/documents" element={<Documents />} />
                {/* 문서 세부 정보를 위한 라우트 추가 */}
                <Route path="/documents/details/:docId" component={DocumentDetail} />
            </Routes>
        </>
    );
}

const Home = () => {
    const token = sessionStorage.getItem('accessToken');
    const expiry = sessionStorage.getItem('refreshToken');
    const user = JSON.parse(sessionStorage.getItem('userInfo'));
    console.log(token);
    console.log(expiry);
    console.log(user);

    return <h1>홈 페이지입니다.</h1>;
}

export default App;
