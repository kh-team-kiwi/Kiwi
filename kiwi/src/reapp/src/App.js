import './styles/App.css';
import React, { useEffect, useState } from 'react';
import RootRoutes from "./routes/RootRoutes";
import ToastNotification from './components/common/ToastNotification';

function App() {

  return (
    <>
            <RootRoutes />
            <ToastNotification />
    </>


  );
}

export default App;
