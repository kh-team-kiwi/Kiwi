import React, {useEffect, useState} from 'react';
import '../../styles/components/common/SideMenuBar.css';
import {useLocation, useNavigate} from "react-router-dom";
import MemberManageIcon from "../../images/svg/settings/MemberManageIcon";
import PersonalManageIcon from "../../images/svg/settings/PersonalManageIcon";
import TeamManageIcon from "../../images/svg/settings/TeamManageIcon";

const SideMenuBar = ({menuItems}) => {
    const location = useLocation();
    const [items, setItems] = useState(menuItems);
    const [selected, setSelected] = useState(items.filter(item=>item.url===location.pathname.slice(34,location.pathname.length))[0]);
    const navigate = useNavigate();

    const handleOnClick = (item) => {
        setSelected(item)
        navigate(location.pathname.slice(0,34)+item.url);
    }

    return (
        <div className='side-menu-bar'>
            <ul className='side-menu-bar-inner'>
                {items.map((item, index)=>(
                        <li key={index} onClick={()=>handleOnClick(item)} className='side-menu-bar-item'>
                            {item.name==="개인 설정" ? (<PersonalManageIcon className={`teamsettings-icon ${item.name===selected.name ? 'select' : ''}`} />) :
                            item.name==="멤버 관리" ? (<MemberManageIcon className={`teamsettings-icon ${item.name===selected.name  ? 'select' : ''}`} />) :
                                (<TeamManageIcon className={`teamsettings-icon ${item.name===selected.name  ? 'select' : ''}`} />)} <span className={`teamsettings-item-name ${item.name===selected.name  ? 'select' : ''}`}>{item.name}</span>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default SideMenuBar;