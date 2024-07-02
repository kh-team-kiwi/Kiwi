import React, {useContext, useEffect, useState} from 'react';
import '../../styles/components/common/SideMenuBar.css';
import {useLocation, useNavigate} from "react-router-dom";
import MemberManageIcon from "../../images/svg/settings/MemberManageIcon";
import PersonalManageIcon from "../../images/svg/settings/PersonalManageIcon";
import TeamManageIcon from "../../images/svg/settings/TeamManageIcon";
import {TeamContext} from "../../context/TeamContext";

const SideMenuBar = () => {

    const location = useLocation();
    const {role} = useContext(TeamContext);
    const getItems = () => {
        switch (role) {
            case 'MEMBER':
                return [{
                    name: "개인 설정",
                    url: "/personal-manage"
                }];
            case 'ADMIN':
                return [
                    {
                        name: "개인 설정",
                        url: "/personal-manage"
                    },
                    {
                        name: "멤버 관리",
                        url: "/member-manage"
                    }
                ];
            case 'OWNER':
                return [
                    {
                        name: "개인 설정",
                        url: "/personal-manage"
                    },
                    {
                        name: "멤버 관리",
                        url: "/member-manage"
                    },
                    {
                        name: "팀 관리",
                        url: "/team-manage"
                    }
                ];
            default:
                return [];
        }
    };

    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(
        items.find(item => location.pathname.endsWith(item.url)) || {}
    );
    const navigate = useNavigate();

    const handleOnClick = (item) => {
        setSelected(item)
        navigate(location.pathname.slice(0,34)+item.url);
    }

    useEffect(() => {
        const updatedItems = getItems();
        setItems(updatedItems);
        const currentItem = updatedItems.find(item => location.pathname.endsWith(item.url)) || {};
        setSelected(currentItem);
    }, [location.pathname,role]);

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