import React, {useEffect, useState} from 'react';
import Regist from './Regist';
import Login from './Login';
import Header from './Header';
import FileManagement from "./components/FileManagement";
import {BrowserRouter, Route, Routes} from "react-router-dom";

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
              <Route path="/Login" element={<Login setIsLogin={setIsLogin} />}></Route>
              <Route path="/FileManagement" element={<FileManagement/>}></Route>
          </Routes>
      </BrowserRouter>
  );
}

const Home = () => {
    const token = sessionStorage.getItem('authToken');
    const expiry = sessionStorage.getItem('authExpr');
    const user = JSON.parse(sessionStorage.getItem('userInfo'));
    console.log(token);
    console.log(expiry);
    console.log(user);

    return <h1>홈 페이지입니다.</h1>;
}

export default App;