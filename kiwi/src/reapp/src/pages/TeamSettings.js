import React, { useState } from 'react';
import '../styles/pages/Page.css';
import '../styles/pages/TeamSettings.css'
import SideMenuBar from "../components/common/SideMenuBar";

const TeamSettings = () => {

    const menuItems = [
        {
            name:"개인 설정",
            url:"/personal-manage"
        },
        {
            name:"멤버 관리",
            url:"/member-manage"
        },
        {
            name:"팀 관리",
            url:"/team-manage"
        }
    ]

    return (
        <>
            <SideMenuBar menuItems={menuItems}></SideMenuBar>
            <div className='content-container'>

            </div>
        </>
    );
};

export default TeamSettings;
