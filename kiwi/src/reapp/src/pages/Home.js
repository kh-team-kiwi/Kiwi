import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import backgroundImage from '../images/background.png'; 

import CreateTeam from '../components/home/CreateTeam';
import ToggleLanguageButton from '../components/common/ToggleLanguageButton';
import Logo from '../components/common/Logo';



import '../styles/pages/Home.css';
import {getSessionItem, removeLocalItem, removeSessionItem} from "../jwt/storage";
import axiosHandler from "../jwt/axiosHandler";


const Home = () => {
    const { t, i18n } = useTranslation();
    const [initialLoad, setInitialLoad] = useState(true);
    const [userDropdown, setUserDropdown] = useState(false);
    const [welcomeStyle, setWelcomeStyle] = useState({ marginTop: '180px' });

    const [teamListStyle, setTeamListStyle] = useState({ marginTop: '15px' });
    const [createTeamVisible, setCreateTeamVisible] = useState(false);
    const [hideCreateTeam, setHideCreateTeam] = useState(false);

    const [teamName, setTeamName] = useState('');
  
    const toggleTeamView = () => {
        const teamCount = teams.length;
        const dynamicMarginTop = teamCount >= 7 ? 875 : teamCount >= 2 ? 329 + (teamCount * 91) : 420;
    
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

    const [teams, setTeams] = useState([]);

    const navigate = useNavigate();

    // useEffect(() => {
    //     setInitialLoad(true);
    //     const timer = setTimeout(() => {
    //         setInitialLoad(false);
    //     }, 250);
    //     return () => clearTimeout(timer);
    // }, []);

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


    const fetchTeams = async () => {
        const memberId = getSessionItem("profile").username;
        try {
            const res = await axiosHandler.get("/api/team/list/" + memberId);
            if (res.status === 200) {
                setTeams(res.data);
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
            localStorage.getItem("")
            navigate('/');
        }
    }

    return (
        <div className="home-background">
            <Logo/>

            <ToggleLanguageButton/>

                <div className={`home-user-container ${userDropdown ? 'active' : ''}`}>
                    <div className='home-user-details'  onClick={toggleUserDropdown}>
                        <div className='home-user-profile-image'>

                        </div>
                        &nbsp;&nbsp;example-email@gmail.com&nbsp;&nbsp;
                        <div className={`down-arrow ${userDropdown ? 'flipped' : ''}`}>

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="home-icon" viewBox="0 0 16 16" style={{marginTop: '2px'}}>
                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                            </svg>
                        </div>
                    </div>

                    {userDropdown && (
                        <>
                        <div className='home-user-dropdown'>
                            <div className='user-dropdown-profile' >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                </svg>
                                {t('profile')}
                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
                                </svg>
                                {t('notifications')}
                            </div>

                            <div className='user-dropdown-settings' >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                                </svg> 
                                {t('settings')}
                            </div>
                            </div>

                            <div className='home-user-dropdown-bottom'>
                                <div className='home-help' >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                                    </svg>
                                    {t('help')}

                                </div>
                                <div className='home-logout' onClick={logoutBtn}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="home-icon" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                                    <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                                    </svg>
                                    {t('logout')}
                                </div>
                            </div>
                            </>
                    )}



                </div>



            <div className='home-welcome-container'>

                <div className='welcome-text' style={welcomeStyle}>
                    {t('welcome-back')}, Username

                </div>
            </div>
            <div className='team-list-container' style={teamListStyle}>
    {teams.length === 0 ? (
        <div className="home-no-team">
            No teams to show
        </div>
    ) : (
        <div className="team-list">
            {teams.map(team => (
                <div key={team.id} className="team-item">
                    <img className='team-image' src={team.image} />
                    <div className='team-info'>
                        <div className='team-name'>{team.name}</div>
                        <div className='team-members'>{team.members} {t('members')}</div>
                    </div>
                    <div className='team-buttons'>
                        <button className='team-settings'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="settings-icon" viewBox="0 0 16 16">
                                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                            </svg>
                        </button>
                        <button className='team-launch'>{t('launch')}</button>
                    </div>
                </div>
            ))}
        </div>
    )}
</div>

            <div className='create-new-team-button-container' >
                <button className='create-new-team-button' onClick={toggleTeamView}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
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
