import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import backgroundImage from '../images/background.png'; 

import CreateTeam from '../components/home/CreateTeam';
import ToggleLanguageButton from '../components/common/ToggleLanguageButton';
import Logo from '../components/common/Logo';

import EmptyIcon from '../images/empty.png';

import AccountSettings from '../components/common/AccountSettings';

import Popup from '../components/common/CongratulationsPopup';

import '../styles/pages/Home.css';
import { getSessionItem, removeLocalItem, removeSessionItem, setSessionItem } from "../jwt/storage";
import axiosHandler from "../jwt/axiosHandler";
import ErrorImageHandler from "../components/common/ErrorImageHandler";
import { TeamContext } from "../context/TeamContext";

import DownArrow from '../images/svg/shapes/DownArrow';
import PlusIcon from '../images/svg/shapes/PlusIcon';

import ProfileIconCircle from '../images/svg/account/ProfileIconCircle';
import NotificationIcon from '../images/svg/account/NotificationIcon';
import SettingsIcon from '../images/svg/buttons/SettingsIcon';
import HelpIcon from '../images/svg/buttons/HelpIcon';
import LogoutIcon from '../images/svg/buttons/LogoutIcon';
import {toast} from "react-toastify";

const Home = () => {
    const [isImageLoaded, setImageLoaded] = useState(false); 
    const [isPopupOpen, setPopupOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const [userDropdown, setUserDropdown] = useState(false);
    const [welcomeStyle, setWelcomeStyle] = useState({ marginTop: '180px' });
    const [teamListStyle, setTeamListStyle] = useState({ marginTop: '15px' });
    const [createTeamVisible, setCreateTeamVisible] = useState(false);
    const [hideCreateTeam, setHideCreateTeam] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
    const { teams, setTeams } = useContext(TeamContext);
    const navigate = useNavigate();

    const openPopup = () => setPopupOpen(true);
    const closePopup = () => setPopupOpen(false);

    const openAccountSettings = () => setAccountSettingsOpen(true);
    const closeAccountSettings = () => setAccountSettingsOpen(false);

    const toggleTeamView = () => {
        const teamCount = teams.length;
        const dynamicMarginTop = teamCount >= 7 ? 875 : teamCount >= 2 ? 329 + (teamCount * 91) : teamCount === 0 ? 511 : 420;

        setCreateTeamVisible(!createTeamVisible);

        setTeamListStyle(prevStyle => ({
            marginTop: prevStyle.marginTop === '15px' ? `-${dynamicMarginTop}px` : '15px'
        }));

        setWelcomeStyle(prevStyle => ({
            marginTop: prevStyle.marginTop === '180px' ? `-${dynamicMarginTop}px` : '180px'
        }));

        if (createTeamVisible) {
            setTimeout(() => {
                setHideCreateTeam(false);
            }, 350);
        } else {
            setHideCreateTeam(!hideCreateTeam);
        }
    };

    const toggleUserDropdown = () => {
        setUserDropdown(!userDropdown);
    };

    useEffect(() => {
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.height = '100vh';
        document.body.style.margin = '0';

        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundRepeat = '';
            document.body.style.height = '';
            document.body.style.margin = '';
        };
    }, []);

    useEffect(() => {
        const img = new Image();
        img.src = backgroundImage;
        img.onload = () => {
            document.body.style.backgroundImage = `url(${backgroundImage})`;
            setImageLoaded(true);
        };
    }, []);

    const fetchTeams = async () => {
        const profile = getSessionItem("profile");
        if (!profile) {
            console.error("Profile not found in session storage.");
            return;
        }

        const memberId = profile.username;
        try {
            const res = await axiosHandler.get("/api/team/member/" + memberId);
            if (res.status === 200) {
                setTeams(res.data);
                setSessionItem("teams", res.data);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error('An error has occurred.');
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleCreateTeam = async (formTeamData) => {
        const profile = getSessionItem("profile");
        if (!profile) {
            console.error("Profile not found in session storage.");
            return;
        }

        const memberId = profile.username;
        try{
            const response = await axiosHandler.post('/api/team/create/'+memberId, formTeamData);
            if (response.status === 200) {
                fetchTeams();
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
            toast.error('An error has occurred.');
        }
    };

    const user = getSessionItem("profile");

    const logoutBtn = async () =>  {
        try {
            const response = await axiosHandler.get("/api/auth/logout");
            if(response.status===200){
                removeLocalItem("accessToken");
                removeSessionItem("profile");
                removeSessionItem("teams");
                removeSessionItem("events");
                navigate('/', { replace: true });
            }
        } catch (e) {
            toast.error('An error has occurred.');

        }
    }

    const checkTeamMemberStatus = async (team) => {
        const memberId = getSessionItem('profile').username;
        try {
            const res = await axiosHandler.get("/api/team/"+team+"/member/"+memberId+"/status");
            if(res.data.result){
                navigate('/team/'+team);
            } else {
                toast("You're blocked and can't enter.")
            }
        } catch (e) {
            toast.error('An error has occurred.');

        }
    }

    return isImageLoaded ? (
        <div className="home-background">
            <Logo />
            <ToggleLanguageButton />
            <AccountSettings isOpen={accountSettingsOpen} onClose={closeAccountSettings} />
            <div className={`home-user-container ${userDropdown ? 'active' : ''}`}>
                <div className='home-user-details' onClick={toggleUserDropdown}>
                    <img className='home-user-profile-image' src={user?.filepath} onError={ErrorImageHandler} alt='user-profile-image' />
                    &nbsp;&nbsp;{user?.username}&nbsp;&nbsp;
                    <div className={`down-arrow ${userDropdown ? 'flipped' : ''}`}>
                        <DownArrow />
                    </div>
                </div>
                <Popup isOpen={isPopupOpen} onClose={closePopup} />
                {userDropdown && (
                    <>
                        <div className='home-user-dropdown'>

                            <div className='home-user-dropdown-settings' onClick={openAccountSettings}>
                                <SettingsIcon className='home-user-dropdown-icon' />
                                {t('account-settings')}
                            </div>
                        </div>
                        <div className='home-user-dropdown-bottom'>

                            <div className='home-logout' onClick={logoutBtn}>
                                <LogoutIcon className='home-user-dropdown-icon' />
                                {t('logout')}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className='home-welcome-container'>
                <div className='welcome-text' style={welcomeStyle}>
                    {t('welcome-back')}, {user?.name}{i18n.language === 'ko' && '님'}
                </div>
            </div>
            <div className='team-list-container' style={teamListStyle}>
                {teams.length === 0 ? (
                    <div className="home-no-team">
                        <img className='home-empty-icon' src={EmptyIcon} alt='Home is empty' />
                        <div className="home-no-team-title">No teams to show</div>
                        <div className="home-no-team-desc">To get started, create a new team!</div>
                    </div>
                ) : (
                    <div className="home-team-list">
                        {teams.map(team => (
                            <div key={team.team} className="team-item">
                                <img className='home-team-image' src={team.teamFilepath===null?'':team.teamFilepath} onError={ErrorImageHandler} />
                                <div className='home-team-info'>
                                    <div>
                                        <div className='home-team-name'>{team.teamName}</div>
                                        <div className='home-team-owner-container'>
                                            <span className='home-team-owner'>{t('owner')}</span>
                                            <span className='home-team-owner-name'>&nbsp;{team.teamAdminMemberId}</span>
                                        </div>
                                        <div className='home-team-count'>{t('members')}:&nbsp;{team.teamCount}</div>
                                    </div>
                                </div>
                                <div className='home-team-buttons'>

                                    <button className='home-team-launch' onClick={()=>checkTeamMemberStatus(team.team)}>
                                        {t('launch')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className='create-new-team-button-container'>
                <button className='create-new-team-button' onClick={toggleTeamView}>
                    <PlusIcon className='create-team-plus-icon' />
                    <div>
                        {t('create-team')}
                    </div>
                </button>
            </div>
            {hideCreateTeam && (
                <div className='create-team-toggle'>
                    <CreateTeam onCreateTeam={handleCreateTeam} toggleTeamView={toggleTeamView} />
                </div>
            )}
        </div>
    ) : (
        <div></div> 
    );
};

export default Home;
