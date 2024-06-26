import React, {useEffect, useState} from 'react';
import '../../styles/components/common/SideMenuBar.css';
import {useLocation, useNavigate} from "react-router-dom";
import MemberManageIcon from "../../images/svg/settings/MemberManageIcon";
import PersonalManageIcon from "../../images/svg/settings/PersonalManageIcon";
import TeamManageIcon from "../../images/svg/settings/TeamManageIcon";

const SideMenuBar = ({menuItems}) => {

    const [items, setItems] = useState(menuItems);
    const [item, setItem] = useState(menuItems[0]);

    const navigate = useNavigate();
    const location = useLocation();

    const handleOnClick = (url) => {

        navigate(location.pathname.slice(0,34)+url);
    }

    return (
        <div className='side-menu-bar'>
            {/* <ul className='side-menu-bar-inner'>
                {items.map((item, index)=>(
                        <li key={index} onClick={()=>handleOnClick(item.url)} className='side-menu-bar-item'>
                            {item.name==="개인 설정" ? (<PersonalManageIcon className={`teamsettings-icon`} />) :
                            item.name==="멤버 관리" ? (<MemberManageIcon className={} />) :
                                (<TeamManageIcon className={} />)} {item.name}
                        </li>
                    ))}
            </ul> */}
        </div>
    );
};

export default SideMenuBar;