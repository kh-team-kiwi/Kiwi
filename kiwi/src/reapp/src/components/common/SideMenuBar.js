import React, { useContext, useEffect, useState } from 'react';
import '../../styles/components/common/SideMenuBar.css';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MemberManageIcon from "../../images/svg/settings/MemberManageIcon";
import PersonalManageIcon from "../../images/svg/settings/PersonalManageIcon";
import TeamManageIcon from "../../images/svg/settings/TeamManageIcon";
import { TeamContext } from "../../context/TeamContext";
import axiosHandler from "../../jwt/axiosHandler";
import { getSessionItem } from "../../jwt/storage";

import { toast } from 'react-toastify';

const SideMenuBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { teamno } = useParams();
    const { role } = useContext(TeamContext);



    const getItems = () => {
        switch (role) {
            case 'MEMBER':
                return [{
                    // name: "개인 설정",
                    // url: "/personal-manage"
                }];
            case 'ADMIN':
                return [
                    // {
                    //     name: "개인 설정",
                    //     url: "/personal-manage"
                    // },
                    {
                        name: "멤버 관리",
                        url: "/member-manage"
                    }
                ];
            case 'OWNER':
                return [
                    // {
                    //     name: "개인 설정",
                    //     url: "/personal-manage"
                    // },
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

    const handleOnClick = (item) => {
        setSelected(item)
        navigate(location.pathname.slice(0, 34) + item.url);
    }

    useEffect(() => {
        const updatedItems = getItems();
        setItems(updatedItems);
        const currentItem = updatedItems.find(item => location.pathname.endsWith(item.url)) || {};
        setSelected(currentItem);
    }, [location.pathname, role]);

    const handleLeaveTeam = async () => {
        const dto = {
            memberId: getSessionItem("profile").username,
            team: teamno
        }
        try {
            const res = await axiosHandler.post("/api/team/leaveTeam", dto);
            if (res.data.result) {
                toast.success(res.data.message);
                navigate('/home', { replace: true });
            } else {
                toast.error(res.data.message);
            }
        } catch (e) {
            console.error("handleLeaveTeam failed: ", e);
            toast.error('Failed to leave team.');
            toast.error('error');
        }
    }

    return (
        <div className='side-menu-bar'>
            <ul className='side-menu-bar-inner'>
                {items.map((item, index) => (
                    <li key={index} onClick={() => handleOnClick(item)} className='side-menu-bar-item'>
                        {
                            item.name === "멤버 관리" ? (<MemberManageIcon className={`teamsettings-icon ${item.name === selected.name ? 'select' : ''}`} />) :
                                (<TeamManageIcon className={`teamsettings-icon ${item.name === selected.name ? 'select' : ''}`} />)} <span className={`teamsettings-item-name ${item.name === selected.name ? 'select' : ''}`}>{item.name}</span>
                    </li>
                ))}
            </ul>
            <div className='teamsettings-sidebar-bottom'>
                <div className='leave-team-button' onClick={handleLeaveTeam}>팀 탈퇴하기</div>
            </div>
        </div>
    );
};

export default SideMenuBar;
