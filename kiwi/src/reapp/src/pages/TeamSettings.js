import React, { useState } from 'react';
import '../styles/pages/Page.css';
import '../styles/pages/TeamSettings.css'
import SideMenuBar from "../components/common/SideMenuBar";
import {Outlet} from "react-router-dom";

const TeamSettings = () => {
    return (
        <>
            <SideMenuBar></SideMenuBar>
            <div className='content-container'>
                <Outlet></Outlet>
            </div>
        </>
    );
};

export default TeamSettings;
