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
import {TeamContext, TeamProvider} from "../context/TeamContext";
import TeamLayout from "../pages/TeamLayout";

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

    const location = useLocation();
    const hideHeaderPaths = ['/register', '/', '/home'];
    const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

        return (
            <>
                <TeamProvider>
                <Routes>
                    {/* 시작페이지이자 로그인페이지 */}
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/register" element={<Register/>}></Route>
                    <Route path="/home" element={<Home/>}></Route>
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

                    {/* 팀 관련 경로 그룹화 */}
                    <Route path="/team/:teamno/*" element={<TeamLayout />}>
                        <Route path="FileManagement" element={<FileManagement/>}></Route>
                        <Route path='chat' element={<Chat />} />
                        <Route path='calendar' element={<Calendar />} />
                        <Route path='drive' element={<Drive />} />
                        <Route path="documents" element={<Documents/>}></Route>
                        <Route path="teamsettings" element={<TeamSettings/>}></Route>
                    </Route>
                </Routes>
                </TeamProvider>
            </>
        );
};


// const IsLogin = ({isLogin}) => {
//     if(!isLogin){
//         alert("로그인이 필요합니다.")
//     }
//     return isLogin ? <Outlet /> : <Navigate to="/" />
// };


export default RootRoutes;