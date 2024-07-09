import React, { useContext, useState } from 'react';
import '../../styles/components/teamsettings/TeamsettingsSidebar.css';
import { useNavigate, useParams } from "react-router-dom";
import SettingsIcon from '../../images/svg/buttons/SettingsIcon';

import { TeamContext } from "../../context/TeamContext";
import axiosHandler from "../../jwt/axiosHandler";
import { getSessionItem } from "../../jwt/storage";
import { toast } from 'react-toastify';
import TeamSettingsIcon from '../../images/svg/buttons/TeamSettingsIcon';
import ManageRolesIcon from '../../images/svg/buttons/ManageRolesIcon';


const SideMenuBar = () => {
    const navigate = useNavigate();
    const { teamno } = useParams();
    const { role } = useContext(TeamContext);
    const [selectedItem, setSelectedItem] = useState('');

    const handleOnClick = (item) => {
        setSelectedItem(item);
        navigate(`/team/${teamno}/settings/${item}`);
    }

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
        }
    }

    return (
        <div className='teamsettings-sidebar'>
            <div className='teamsettings-sidebar-header'>
                <SettingsIcon className='teamsettings-sidebar-settings-icon' />
                <div className='teamsettings-sidebar-title'> General Settings </div>
            </div>
            <div className={`teamsettings-sidebar-item ${selectedItem === 'user' ? 'selected' : 'unselected'}`} onClick={() => handleOnClick('user')}>  
                <ManageRolesIcon className='teamsettings-sidebar-roles-icon'/>
                <div>User Settings</div>
            </div>
            <div className={`teamsettings-sidebar-item ${selectedItem === 'team' ? 'selected' : 'unselected'}`} onClick={() => handleOnClick('team')}>
                <TeamSettingsIcon className='teamsettings-sidebar-icon' />

                <div>Team Settings</div>
            </div>
            <div className='teamsettings-sidebar-bottom'>
                <div className='teamsettings-sidebar-leave-team-button' onClick={handleLeaveTeam}>Leave Team</div>
            </div>
        </div>
    );
};

export default SideMenuBar;