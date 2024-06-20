import React, {useState} from 'react';
import Header from "../components/common/Header";
import {Navigate, Outlet, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import FileManagement from "../components/drive/FileManagement";
import Chat from "../pages/Chat";
import Calendar from "../pages/Calendar";
import Drive from "../pages/Drive";
import TeamSettings from "../pages/TeamSettings";
import OAuth2RedirectHandler from "../jwt/OAuth2RedirectHandler";
import Documents from "../pages/Documents";
import Home from "../pages/Home";
import Error from "../components/common/Error";

const RootRoutes = () => {

    /*
    *  이 구간에 관리자페이지 접근시 코드 작성예정
    * */

    return (
        <Routes>
            {/* 임시 에러페이지 */}
            <Route path="/error" element={<Error />} />
            <Route path="*" element={<SecondRouts />}></Route>
        </Routes>
    );
};

const SecondRouts = () => {
    const [isLogin, setIsLogin] = useState(true);

    const location = useLocation();
    const hideHeaderPaths = ['/register', '/', '/home'];
    const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

        return (
            <>
                {!shouldHideHeader && <Header />}
                <Routes>
                    {/* 시작페이지이자 로그인페이지 */}
                    <Route path="/" element={<Login setIsLogin={setIsLogin} />}></Route>
                    <Route path="/register" element={<Register/>}></Route>
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler setIsLogin={setIsLogin} />} />

                    {/* 로그인 해야 접속가능한 페이지들 */}
                    <Route element={<IsLogin isLogin={isLogin} />}>
                        <Route path="/FileManagement" element={<FileManagement/>}></Route>
                        <Route path='/chat' element={<Chat />} />
                        <Route path='/calendar' element={<Calendar />} />
                        <Route path='/drive' element={<Drive />} />
                        <Route path="/documents" element={<Documents/>}></Route>
                        <Route path="/home" element={<Home/>}></Route>
                        <Route path="/teamsettings" element={<TeamSettings/>}></Route>

                    </Route>

                    {/* 존재하지 않는 경로에 대한 처리 */}
                    {/*<Route path="*" element={<Navigate to="/error" state={{ from: location.pathname }} />} />*/}
                </Routes>
            </>
        );
};


const IsLogin = ({isLogin}) => {
    if(!isLogin){
        alert("로그인이 필요합니다.")
    }
    return isLogin ? <Outlet /> : <Navigate to="/" />
};


export default RootRoutes;