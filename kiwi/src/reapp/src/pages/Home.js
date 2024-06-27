import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import backgroundImage from '../images/background.png'; 

import CreateTeam from '../components/home/CreateTeam';
import ToggleLanguageButton from '../components/common/ToggleLanguageButton';
import Logo from '../components/common/Logo';

import EmptyIcon from '../images/empty.png';

import AccountSettings from '../components/common/AccountSettings';



import '../styles/pages/Home.css';
import {getSessionItem, removeLocalItem, removeSessionItem, setSessionItem} from "../jwt/storage";
import axiosHandler from "../jwt/axiosHandler";
import ErrorImageHandler from "../components/common/ErrorImageHandler";
import {TeamContext} from "../context/TeamContext";

import DownArrow from '../images/svg/shapes/DownArrow';
import PlusIcon from '../images/svg/shapes/PlusIcon';

import ProfileIconCircle from '../images/svg/account/ProfileIconCircle';
import NotificationIcon from '../images/svg/account/NotificationIcon';
import SettingsIcon from '../images/svg/buttons/SettingsIcon';
import HelpIcon from '../images/svg/buttons/HelpIcon';
import LogoutIcon from '../images/svg/buttons/LogoutIcon';


const Home = () => {
    const { t } = useTranslation();
    const [userDropdown, setUserDropdown] = useState(false);
    const [welcomeStyle, setWelcomeStyle] = useState({ marginTop: '180px' });

    const [teamListStyle, setTeamListStyle] = useState({ marginTop: '15px' });
    const [createTeamVisible, setCreateTeamVisible] = useState(false);
    const [hideCreateTeam, setHideCreateTeam] = useState(false);

    const [teamName, setTeamName] = useState('');

    const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);

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

    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.backgroundImage = `url(${backgroundImage})`;
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

    const [teams, setTeams] = useContext(TeamContext);

    const fetchTeams = async () => {
        const memberId = getSessionItem("profile").username;
        try {
            const res = await axiosHandler.get("/api/team/list/" + memberId);
            if (res.status === 200) {
                console.log("home.js > fetchTeams : ",res.data);
                setTeams(res.data);
                setSessionItem("teams",res.data);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleCreateTeam = async (formTeamData) => {
        const memberId = getSessionItem("profile").username;
        console.log("home.js> handleCreateTeam : ",memberId);
        console.log("home.js> handleCreateTeam : ",formTeamData)
        const response = await axiosHandler.post(`/api/team/create?memberId=${memberId}`, formTeamData);
        if (response.status === 200) {
        fetchTeams();
        }
    };

    const user = getSessionItem("profile");
    /* 로그아웃 */
    async function logoutBtn(){

        const response = await axiosHandler.post("/api/auth/logout");
        if (response.status === 200) {
            removeLocalItem("accessToken");
            removeSessionItem("profile");
            removeSessionItem("teams");
            removeSessionItem("events");
            localStorage.getItem("")
            navigate('/', {replace:true});
        }
    }

    return (
        <div className="home-background">
            <Logo/>

            <ToggleLanguageButton/>
                <AccountSettings isOpen={accountSettingsOpen} onClose={closeAccountSettings} />


                <div className={`home-user-container ${userDropdown ? 'active' : ''}`}>
                    <div className='home-user-details'  onClick={toggleUserDropdown}>
                        <img className='home-user-profile-image' src={getSessionItem("profile").filepath} onError={ErrorImageHandler} alt='user-profile-image'>

                        </img>
                        &nbsp;&nbsp;{getSessionItem("profile").username}&nbsp;&nbsp;
                        <div className={`down-arrow ${userDropdown ? 'flipped' : ''}`}>

                            <DownArrow />
                        </div>
                    </div>

                    {userDropdown && (
                        <>
                        <div className='home-user-dropdown'>
                            <div className='home-user-dropdown-profile' >
                                <ProfileIconCircle className='home-user-dropdown-icon' />
                                {t('profile')}
                            </div>
                            <div>
                                <NotificationIcon className='home-user-dropdown-icon' />
                                {t('notifications')}
                            </div>

                            <div className='home-user-dropdown-settings'onClick={openAccountSettings} >
                                <SettingsIcon className='home-user-dropdown-icon' />
                                {t('account-settings')}
                            </div>
                            </div>

                            <div className='home-user-dropdown-bottom'>
                                <div className='home-help' >
                                    <HelpIcon className='home-user-dropdown-icon' />

                                    {t('help')}

                                </div>
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
                    {t('welcome-back')}, {getSessionItem("profile").name}

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
        <div className="home-team-list" >
            {teams.map(team => (
                <div key={team.team} className="team-item">
                    <img className='home-team-image' src={team.teamFilepath} onError={ErrorImageHandler} />
                    <div className='home-team-info'>
                        <div>
                            <div className='home-team-name'>{team.teamName}</div>
                            {/* <u className='home-team-num'>{team.team}</u> */}
                            <div className='home-team-owner-container'>
                                <span className='home-team-owner'>{t('owner')}</span>
                                <span className='home-team-owner-name'>&nbsp;{team.teamAdminMemberId}</span>
                            </div>
                            <div className='home-team-count'>{t('members')}:&nbsp;{team.teamCount}</div>


                        </div>
                    </div>
                    <div className='home-team-buttons'>
                        <button className='home-team-settings'>
                            <SettingsIcon className="home-settings-icon"/>
                        </button>
                        <button className='home-team-launch'
                                onClick={() => navigate(`/team/${team.team}`)}>{t('launch')}</button>
                    </div>
                </div>
            ))}
        </div>
    )}
            </div>

            <div className='create-new-team-button-container' >
                <button className='create-new-team-button' onClick={toggleTeamView}>
                    <PlusIcon className='create-team-plus-icon'/>
                    <div>
                        {t('create-team')}
                    </div>
                </button>
            </div>
            
            {hideCreateTeam && 
                <div className='create-team-toggle'>
                    
                    <CreateTeam onCreateTeam={handleCreateTeam} toggleTeamView={toggleTeamView}/>
                </div>
            }




        </div>
        
    );
};

export default Home;
