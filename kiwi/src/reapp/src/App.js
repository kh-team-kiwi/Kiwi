import './styles/App.css';
import React, {useEffect, useState} from 'react';
import Regist from './Regist';
import Login from './Login';
import Header from './Header';
import FileManagement from "./components/FileManagement";
import Main from './Main';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Documents from "./components/Documents";

import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import Drive from './pages/Drive';
import Header from './components/common/Header';

function App() {
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken');
        setIsLogin(authToken !== null);
    }, []);

  return (
      <BrowserRouter>
          <Header isLogin={isLogin} setIsLogin={setIsLogin} />
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
          </Routes>
      </BrowserRouter>
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