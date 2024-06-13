import './styles/App.css';
import React, {useEffect, useState} from 'react';
import Regist from './Regist';
import Login from './Login';
import Headermenu from './Headermenu';
import FileManagement from "./components/FileManagement";
import Main from './Main';
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import Documents from "./components/document/Documents";
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import Drive from './pages/Drive';
import Header from './components/common/Header';
import OAuth2RedirectHandler from './OAuth2RedirectHandler';

function App() {
    const [isLogin, setIsLogin] = useState(false);

    const location = useLocation();
    const hideHeaderPaths = ['/chat', '/calendar', '/drive'];
    const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken');
        setIsLogin(authToken !== null);
    }, []);

  return (
      <>
          {!shouldHideHeader && <Headermenu isLogin={isLogin} setIsLogin={setIsLogin} />}
          {shouldHideHeader && <Header />}
          <Routes>
              {/*element={<Navigate to="/Home" replace />}*/}
              <Route path="/" element={<Home />} />
              <Route path="/regist" element={<Regist/>}></Route>
              <Route path="/login" element={<Login setIsLogin={setIsLogin} />}></Route>
              <Route path="/FileManagement" element={<FileManagement/>}></Route>
              <Route path="/documents" element={<Documents/>}></Route>
              <Route path="/main" element={<Main/>}></Route>
              <Route path='/chat' element={<Chat />} />
              <Route path='/calendar' element={<Calendar />} />
              <Route path='/drive' element={<Drive />} />
              <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
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