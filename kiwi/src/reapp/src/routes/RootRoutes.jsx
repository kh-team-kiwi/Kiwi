import React, {useState} from 'react';
import Header from "../components/common/Header";
import {Route, Routes, useLocation} from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import FileManagement from "../components/drive/FileManagement";
import Main from "../pages/Main";
import Chat from "../pages/Chat";
import Calendar from "../pages/Calendar";
import Drive from "../pages/Drive";
import OAuth2RedirectHandler from "../jwt/OAuth2RedirectHandler";
import Documents from "../pages/Documents";
import Home from "../pages/Home";
import Error from "../components/common/Error";

const RootRoutes = () => {
    return (
        <Routes>
            {/* 시작페이지이자 로그인페이지 */}
            <Route path="/" element={<Login />}></Route>
            {/* 임시 에러페이지 */}
            <Route path="/error" element={<Error />} />
            {/* 로그인 해야 접속가능한 페이지들 */}
            <Route path="*" element={<SecondRouts />}></Route>
        </Routes>
    );
};

const SecondRouts = () => {

    const location = useLocation();
    const hideHeaderPaths = ['/chat', '/calendar', '/drive', '/documents'];
    const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

    const [mounted, setMounted] = useState(true);

    if(mounted){
        return (
            <>
                {shouldHideHeader && <Header />}
                <Routes>

                    <Route path="/register" element={<Register/>}></Route>

                    <Route path="/FileManagement" element={<FileManagement/>}></Route>
                    <Route path="/main" element={<Main/>}></Route>
                    <Route path='/chat' element={<Chat />} />
                    <Route path='/calendar' element={<Calendar />} />
                    <Route path='/drive' element={<Drive />} />
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                    <Route path="/documents" element={<Documents/>}></Route>
                    <Route path="/home" element={<Home/>}></Route>
                </Routes>
            </>
        );
    }
};


export default RootRoutes;