import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import backgroundImage from '../images/background.png'; 
import kiwiImage from '../images/kiwi.png'; 
import kiwiWord from '../images/kiwi-word.png'; 
import CreateTeam from '../components/home/CreateTeam';


import '../styles/pages/Home.css';
import {getSessionItem, removeLocalItem, removeSessionItem} from "../jwt/storage";
import axiosHandler from "../jwt/axiosHandler";


const Home = () => {
    const { t, i18n } = useTranslation();
    const [initialLoad, setInitialLoad] = useState(true);
    const [languageOptionsVisible, setLanguageOptionsVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
    const [userDropdown, setUserDropdown] = useState(false);
    const [welcomeStyle, setWelcomeStyle] = useState({ marginTop: '170px' });

    const [teamListStyle, setTeamListStyle] = useState({ marginTop: '30px' });
    const [createTeamStyle, setCreateTeamStyle] = useState({ marginTop: '-100%' });
    const [createTeamVisible, setCreateTeamVisible] = useState(false);
    const [hideCreateTeam, setHideCreateTeam] = useState(false);

    const [teamName, setTeamName] = useState('');
  
    const toggleTeamView = () => {
        setCreateTeamVisible(!createTeamVisible);


      setTeamListStyle(prevStyle => ({
        marginTop: prevStyle.marginTop === '30px' ? '-100%' : '30px'
      }));
      setCreateTeamStyle(prevStyle => ({
        marginTop: prevStyle.marginTop === '-100%' ? '30px' : '-100%'
      }));
      setWelcomeStyle(prevStyle => ({
        marginTop: prevStyle.marginTop === '170px' ? '-100%' : '170px'
      }));

      if (createTeamVisible) {
        setTimeout(() => {
          setHideCreateTeam(false);
        }, 500);
    } else {
        setHideCreateTeam(!hideCreateTeam);

    }

    };

    const toggleUserDropdown = () => {
        setUserDropdown(!userDropdown);
    };

    const teams = [
        {
            id: 1,
            name: 'Team Name 1',
            image: 'Team Image URL',
            members: '12',
        },
        {
            id: 2,
            name: 'Team Name 2',
            image: 'Team Image URL',
            members: '16',
        }
        ,
        {
            id: 3,
            name: 'Team Name 3',
            image: 'Team Image URL',
            members: '15',
        }
    ];

    const navigate = useNavigate();

    useEffect(() => {
        setInitialLoad(true);
        const timer = setTimeout(() => {
            setInitialLoad(false);
        }, 250);
        return () => clearTimeout(timer);
    }, []);

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


    const handleDropdownClick = () => {
        if (languageOptionsVisible === true) {
          setLanguageOptionsVisible(false);
        } else {
          setLanguageOptionsVisible(true);
        }
  
      };
  
      const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setSelectedLanguage(lng);

        setLanguageOptionsVisible(false);
      };

      const handleCreateTeam = (formTeamData) => {
        console.log('Team created:', formTeamData);
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
            <div className="logo-container">
                <img src={kiwiImage} alt="Kiwi-icon" className='kiwi-icon' />
                <img src={kiwiWord} alt="Kiwi-word" className='kiwi-word' />

            </div>

            <div className='change-language-button-container'>


            <div onClick={handleDropdownClick} className={`change-language-button ${languageOptionsVisible ? 'clicked' : ''}`}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-globe" viewBox="0 0 16 16">
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
                    </svg>
                </div>

                <div>
                    &nbsp; {t('language')} &nbsp;
                </div>

                <div className={`down-arrow ${languageOptionsVisible ? 'flipped' : ''}`}>
                    <svg width="17" height="9" viewBox="0 0 17 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.183617 0.183617C0.241674 0.125413 0.310644 0.0792341 0.386575 0.047726C0.462507 0.016218 0.543908 0 0.626117 0C0.708326 0 0.789728 0.016218 0.865659 0.047726C0.941591 0.0792341 1.01056 0.125413 1.06862 0.183617L8.12612 7.24237L15.1836 0.183617C15.2417 0.125507 15.3107 0.0794115 15.3866 0.0479627C15.4626 0.0165138 15.5439 0.000327229 15.6261 0.000327229C15.7083 0.000327229 15.7897 0.0165138 15.8656 0.0479627C15.9415 0.0794115 16.0105 0.125507 16.0686 0.183617C16.1267 0.241727 16.1728 0.310713 16.2043 0.386637C16.2357 0.462562 16.2519 0.543937 16.2519 0.626117C16.2519 0.708297 16.2357 0.789672 16.2043 0.865596C16.1728 0.941521 16.1267 1.01051 16.0686 1.06862L8.56862 8.56862C8.51056 8.62682 8.44159 8.673 8.36566 8.70451C8.28973 8.73602 8.20833 8.75223 8.12612 8.75223C8.04391 8.75223 7.96251 8.73602 7.88658 8.70451C7.81064 8.673 7.74167 8.62682 7.68362 8.56862L0.183617 1.06862C0.125413 1.01056 0.0792347 0.94159 0.0477266 0.865659C0.0162186 0.789728 0 0.708326 0 0.626117C0 0.543908 0.0162186 0.462506 0.0477266 0.386575C0.0792347 0.310643 0.125413 0.241674 0.183617 0.183617Z" fill="black"/>
                    </svg>
                </div>
            </div>
            {languageOptionsVisible && (
                    <div className='home-language-list'>
                        <div onClick={() => changeLanguage('ko')} className={selectedLanguage === 'ko' ? 'selected-language' : ''}>한국어</div>
                        <div onClick={() => changeLanguage('en')} className={selectedLanguage === 'en' ? 'selected-language' : ''}>English</div>
                        <div onClick={() => changeLanguage('es')} className={selectedLanguage === 'es' ? 'selected-language' : ''}>Español</div>
                        <div onClick={() => changeLanguage('fr')} className={selectedLanguage === 'fr' ? 'selected-language' : ''}>Français</div>
                        <div onClick={() => changeLanguage('de')} className={selectedLanguage === 'de' ? 'selected-language' : ''}>Deutsch</div>
                        <div onClick={() => changeLanguage('ja')} className={selectedLanguage === 'ja' ? 'selected-language' : ''}>日本語</div>
                        <div onClick={() => changeLanguage('zh')} className={selectedLanguage === 'zh' ? 'selected-language' : ''}>中文</div>
                    </div>
                )}
            </div>


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


                <ul className="team-list">
                    {teams.map(team => (
                        <li key={team.id} className="team-item">
                            <img className='team-image' src={team.image} />
                            <div className='team-info'>
                                <div className='team-name'>{team.name}</div>
                                <div className='team-members' >{team.members} {t('members')}</div>
                            </div>
                            <div className='team-buttons'>
                                <button className='team-settings' >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="settings-icon" viewBox="0 0 16 16">
                                    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                                    </svg> 

                                </button>
                                <button className='team-launch' >{t('launch')} </button>

                            </div>

                        </li>
                    ))}

                </ul>



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
