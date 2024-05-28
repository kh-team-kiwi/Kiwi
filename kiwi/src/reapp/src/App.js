import React, { useEffect } from 'react';
import Regist from './Regist';
import Login from './Login';
import Header from './Header';
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {

  return (
      <BrowserRouter>
          <Header />
          <Routes>
              {/*element={<Navigate to="/Home" replace />}*/}
              <Route path="/" element={<Home />} />
              <Route path="/regist" element={<Regist/>}></Route>
              <Route path="/Login" element={<Login/>}></Route>
          </Routes>
      </BrowserRouter>
  );
}

function Home() {
    return <h1>홈 페이지입니다.</h1>;
}

export default App;