import React, {useState, useRef, useContext, useEffect} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import ToggleButton from './ToggleButton';
import { useTranslation } from 'react-i18next';


import '../../styles/components/common/Header.css';
import ErrorImageHandler from "./ErrorImageHandler";
import {TeamContext} from "../../context/TeamContext";
import {getSessionItem, removeLocalItem, removeSessionItem, setSessionItem} from "../../jwt/storage";
import axiosHandler from "../../jwt/axiosHandler";

import KoreanFlag from '../../images/svg/flags/KoreanFlag';
import EnglishFlag from '../../images/svg/flags/EnglishFlag';
import SpanishFlag from '../../images/svg/flags/SpanishFlag';
import FrenchFlag from '../../images/svg/flags/FrenchFlag';
import GermanFlag from '../../images/svg/flags/GermanFlag';
import JapaneseFlag from '../../images/svg/flags/JapaneseFlag';
import ChineseFlag from '../../images/svg/flags/ChineseFlag';

import AccountSettings from './AccountSettings';

import { toast } from 'react-toastify';



const Header = () => {
  const { teams, setTeams, joinTeam} = useContext(TeamContext);
  const { teamno } = useParams();
  const { role } = useContext(TeamContext);

  const [activePage, setActivePage] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);

  const [teamDropdown, setTeamDropdown] = useState(false);

  const [memberSettingsDropdown, setMemberSettingsDropdown] = useState(false);


  const dropdownRef = useRef(null);
  const userProfileRef = useRef(null);
  const userNotificationRef = useRef(null);

  const teamButtonRef = useRef(null);
  const teamDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);


  const [languageOptionsVisible, setLanguageOptionsVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState({});

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

    const defaultImage = '../../image/default-image.png'; 

    const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);

    const openAccountSettings = () => setAccountSettingsOpen(true);
    const closeAccountSettings = () => setAccountSettingsOpen(false);

    const location = useLocation();

    useEffect(() => {
      const path = location.pathname;
      if (path.includes('calendar')) {
        setActivePage('calendar');
      } else if (path.includes('chat')) {
        setActivePage('chat');
      } else if (path.includes('drive')) {
        setActivePage('drive');
      } else if (path.includes('documents')) {
        setActivePage('documents');
      } else if (path.includes('settings')) {
        setActivePage('settings');
      } else {
        navigate(`/team/${teamno}/calendar`);
        window.location.reload();

      }
    }, [location]); 


  const fetchData = async () => {
    const memberId = getSessionItem("profile").username;
    try {
      const res = await axiosHandler.get("/api/team/member/" + memberId);
      if (res.status === 200) {
        setTeams(res.data);
        setSessionItem("teams", res.data);
      } else {
        if(res.data) toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.data.message);
    }

    try {
      const res = await axiosHandler.get(`/api/team/${teamno}/member/${memberId}`);
      if(res.status===200){
        joinTeam(res.data);
      } else {
        if(res.data) toast.error(res.data.message);
      }
    } catch (e) {
      toast.error(e.data.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (teams.length > 0) {
      const findTeam = teams.find(team => team.team === teamno);
      if (findTeam) {
        setSelectedTeam(findTeam);
      } else {
        setSelectedTeam({});
      }
    }
  }, [teamno, teams]);

  const handleClick = (page) => {
    setActivePage(page);
    navigate(`/team/${teamno}/${page}`);
  };

  const handleDropdownClick = () => {
    if (notificationDropdownVisible) {
      setNotificationDropdownVisible(false);

    }
    if (languageOptionsVisible) {
      setLanguageOptionsVisible(false);
    } else {
      setDropdownVisible(prevVisible => !prevVisible);
      setLanguageOptionsVisible(false);

    }

  };

  const handleNotificationClick = () => {

      setNotificationDropdownVisible(prevVisible => !prevVisible);

      if (dropdownVisible) {
        setDropdownVisible(false);

      }
    

  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);

    setLanguageOptionsVisible(false);
    setDropdownVisible(true);
  };


  const handleLanguageClick = () => {
    setLanguageOptionsVisible(true);
    setDropdownVisible(false);
  };

  const toggleTeamDropdown = () => {
    setTeamDropdown(!teamDropdown);
  };

  const toggleMemberSettingsDropdown = () => {
    setMemberSettingsDropdown(!memberSettingsDropdown);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleDarkModeToggle = () => {
    setIsDarkMode(prevState => !prevState);
    document.body.classList.toggle('dark-mode');
  };

  const handleTeamClick = (team) => {
    setTeamDropdown(false);
    setSelectedTeam(team);
    navigate(`/team/${team.team}`);
  };

  const handleOutsideClick = (event) => {
    if (
      dropdownVisible &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      userProfileRef.current &&
      !userProfileRef.current.contains(event.target) &&
      !teamButtonRef.current.contains(event.target)
    ) {
      setDropdownVisible(false);
    }

    if (
      notificationDropdownVisible &&
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target) &&
      userNotificationRef.current &&
      !userNotificationRef.current.contains(event.target) &&
      !teamButtonRef.current.contains(event.target)
    ) {
      setNotificationDropdownVisible(false);
    }

    if (
      teamDropdownRef.current &&
      !teamDropdownRef.current.contains(event.target) &&
      teamButtonRef.current &&
      !teamButtonRef.current.contains(event.target) &&
      !userProfileRef.current.contains(event.target) &&
      (!languageDropdownRef.current || !languageDropdownRef.current.contains(event.target))
        ) {
      setTeamDropdown(false);
      setLanguageOptionsVisible(false);
    }

    
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dropdownVisible, notificationDropdownVisible]);

  async function logoutBtn(){
    try{
      const response = await axiosHandler.get("/api/auth/logout");
      if (response.status === 200) {
        removeLocalItem("accessToken");
        removeSessionItem("profile");
        removeSessionItem("teams");
        removeSessionItem("events");
        localStorage.getItem("")
        navigate('/', {replace:true});
      } else {
        toast('An error occurred');
      }
    } catch (e) {
      toast('An error occurred');
    }
  }

  const handleLeaveTeam = async () => {
    try {
      const res = await axiosHandler.delete("/api/team/"+teamno+"/member/"+getSessionItem("profile").username);
        if (res.data.result) {
            toast.success(res.data.message);
            navigate('/home', { replace: true });
        } else {
            toast.error(res.data.message);
        }
    } catch (e) {
        toast.error('Failed to leave team.');
        toast.error('error');
    }
}

  const renderSettingsIcon = () => {
    if (role === 'MEMBER') {
      console.log('settings member')
      return (
        <div className={`header-page-member-settings-container ${activePage === 'membersettings' ? 'active' : 'inactive'}`} onClick={() => toggleMemberSettingsDropdown()}>
          <svg className='header-page-icon' xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" viewBox="0 0 16 16">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
          </svg>
        </div>
      );
    }
    return (
      <div className={`header-page-settings-container ${activePage === 'settings' ? 'active' : 'inactive'}`} onClick={() => handleClick('settings')}>
        <svg className='header-page-icon' xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" viewBox="0 0 16 16">
          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
        </svg>
      </div>
    );
  };

  return (
    <header className='header-container'>
                      <AccountSettings isOpen={accountSettingsOpen} onClose={closeAccountSettings} />

      <div className='header-team-container-wrapper'>
        <div className={`header-team-container ${teamDropdown ? 'active' : ''}`} ref={teamDropdownRef}>
          <div className='header-selected-team-details' onClick={toggleTeamDropdown} ref={teamButtonRef}>
            <img className='header-selected-team-profile-image' src={selectedTeam.teamFilepath===null ? '':selectedTeam.teamFilepath}  alt={''} onError={ErrorImageHandler}/>
            <div className='header-selected-team-name'>
              {selectedTeam.teamName}
            </div>
            <div className={`header-team-arrow-container down-arrow ${teamDropdown ? 'flipped' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="home-icon" viewBox="0 0 16 16" style={{marginTop: '2px'}}>
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
              </svg>
            </div>
          </div>

          <div className={`header-team-dropdown ${teamDropdown ? 'open' : 'closed'}`}>
            <div className={`header-team-dropdown-list-container ${teamDropdown ? 'open' : 'closed'}`}>
              <div className={`header-team-dropdown-list ${teamDropdown ? 'open' : 'closed'}`}>
                {teams.map(team => (
                  <div 
                    className={`header-team-details ${team.team === selectedTeam.team ? 'selected' : ''}`}
                    key={team.team}
                    onClick={() => handleTeamClick(team)}
                  >
                    <img className='header-team-profile-image' src={team.teamFilepath===null ? '':team.teamFilepath} alt={''} onError={ErrorImageHandler} />
                    <div className='header-team-name'>
                      {team.teamName}
                    </div>
                    {selectedTeam.team === team.team && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className='header-tick-icon' viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    )}

                  </div>
                ))}
              </div>

            </div>


            <div className='header-create-team-button-container'>
              <div className='header-create-team-button' onClick={()=>{navigate('/home')}}>

              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
              </svg>
                <div>&nbsp;&nbsp;{t('Go to Home')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`header-page-icon-container ${activePage === 'calendar' ? 'active' : 'inactive'}`} onClick={() => handleClick('calendar')}>
        <svg className='header-page-icon' width="25" height="25" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.25 0.78125C6.25 0.57405 6.16769 0.375336 6.02118 0.228823C5.87466 0.0823101 5.67595 0 5.46875 0C5.26155 0 5.06284 0.0823101 4.91632 0.228823C4.76981 0.375336 4.6875 0.57405 4.6875 0.78125V1.5625H3.125C2.2962 1.5625 1.50134 1.89174 0.915291 2.47779C0.32924 3.06384 0 3.8587 0 4.6875L0 6.25H25V4.6875C25 3.8587 24.6708 3.06384 24.0847 2.47779C23.4987 1.89174 22.7038 1.5625 21.875 1.5625H20.3125V0.78125C20.3125 0.57405 20.2302 0.375336 20.0837 0.228823C19.9372 0.0823101 19.7385 0 19.5312 0C19.324 0 19.1253 0.0823101 18.9788 0.228823C18.8323 0.375336 18.75 0.57405 18.75 0.78125V1.5625H6.25V0.78125ZM25 21.875V7.8125H0V21.875C0 22.7038 0.32924 23.4987 0.915291 24.0847C1.50134 24.6708 2.2962 25 3.125 25H21.875C22.7038 25 23.4987 24.6708 24.0847 24.0847C24.6708 23.4987 25 22.7038 25 21.875ZM14.8438 10.9375H16.4062C16.6135 10.9375 16.8122 11.0198 16.9587 11.1663C17.1052 11.3128 17.1875 11.5115 17.1875 11.7188V13.2812C17.1875 13.4885 17.1052 13.6872 16.9587 13.8337C16.8122 13.9802 16.6135 14.0625 16.4062 14.0625H14.8438C14.6365 14.0625 14.4378 13.9802 14.2913 13.8337C14.1448 13.6872 14.0625 13.4885 14.0625 13.2812V11.7188C14.0625 11.5115 14.1448 11.3128 14.2913 11.1663C14.4378 11.0198 14.6365 10.9375 14.8438 10.9375ZM19.5312 10.9375H21.0938C21.301 10.9375 21.4997 11.0198 21.6462 11.1663C21.7927 11.3128 21.875 11.5115 21.875 11.7188V13.2812C21.875 13.4885 21.7927 13.6872 21.6462 13.8337C21.4997 13.9802 21.301 14.0625 21.0938 14.0625H19.5312C19.324 14.0625 19.1253 13.9802 18.9788 13.8337C18.8323 13.6872 18.75 13.4885 18.75 13.2812V11.7188C18.75 11.5115 18.8323 11.3128 18.9788 11.1663C19.1253 11.0198 19.324 10.9375 19.5312 10.9375ZM3.125 16.4062C3.125 16.199 3.20731 16.0003 3.35382 15.8538C3.50034 15.7073 3.69905 15.625 3.90625 15.625H5.46875C5.67595 15.625 5.87466 15.7073 6.02118 15.8538C6.16769 16.0003 6.25 16.199 6.25 16.4062V17.9688C6.25 18.176 6.16769 18.3747 6.02118 18.5212C5.87466 18.6677 5.67595 18.75 5.46875 18.75H3.90625C3.69905 18.75 3.50034 18.6677 3.35382 18.5212C3.20731 18.3747 3.125 18.176 3.125 17.9688V16.4062ZM8.59375 15.625H10.1562C10.3635 15.625 10.5622 15.7073 10.7087 15.8538C10.8552 16.0003 10.9375 16.199 10.9375 16.4062V17.9688C10.9375 18.176 10.8552 18.3747 10.7087 18.5212C10.5622 18.6677 10.3635 18.75 10.1562 18.75H8.59375C8.38655 18.75 8.18784 18.6677 8.04132 18.5212C7.89481 18.3747 7.8125 18.176 7.8125 17.9688V16.4062C7.8125 16.199 7.89481 16.0003 8.04132 15.8538C8.18784 15.7073 8.38655 15.625 8.59375 15.625Z" fill="white"/>
        </svg>
    </div>

      <div className={`header-page-icon-container ${activePage === 'chat' ? 'active' : 'inactive'}`} onClick={() => handleClick('chat')}>
        <svg className='header-page-icon' width="26" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 10.7827C25 16.7379 19.4031 21.5655 12.5 21.5655C11.2619 21.5682 10.0288 21.4097 8.83281 21.0941C7.92031 21.5501 5.825 22.425 2.3 22.9949C1.9875 23.0442 1.75 22.7238 1.87344 22.4373C2.42656 21.1496 2.92656 19.4336 3.07656 17.8685C1.1625 15.9738 0 13.4938 0 10.7827C0 4.82758 5.59687 0 12.5 0C19.4031 0 25 4.82758 25 10.7827ZM7.03125 6.16156C6.82405 6.16156 6.62534 6.24271 6.47882 6.38715C6.33231 6.53159 6.25 6.72749 6.25 6.93176C6.25 7.13602 6.33231 7.33193 6.47882 7.47637C6.62534 7.62081 6.82405 7.70195 7.03125 7.70195H17.9688C18.176 7.70195 18.3747 7.62081 18.5212 7.47637C18.6677 7.33193 18.75 7.13602 18.75 6.93176C18.75 6.72749 18.6677 6.53159 18.5212 6.38715C18.3747 6.24271 18.176 6.16156 17.9688 6.16156H7.03125ZM7.03125 10.0125C6.82405 10.0125 6.62534 10.0937 6.47882 10.2381C6.33231 10.3826 6.25 10.5785 6.25 10.7827C6.25 10.987 6.33231 11.1829 6.47882 11.3273C6.62534 11.4718 6.82405 11.5529 7.03125 11.5529H17.9688C18.176 11.5529 18.3747 11.4718 18.5212 11.3273C18.6677 11.1829 18.75 10.987 18.75 10.7827C18.75 10.5785 18.6677 10.3826 18.5212 10.2381C18.3747 10.0937 18.176 10.0125 17.9688 10.0125H7.03125ZM7.03125 13.8635C6.82405 13.8635 6.62534 13.9447 6.47882 14.0891C6.33231 14.2335 6.25 14.4294 6.25 14.6337C6.25 14.838 6.33231 15.0339 6.47882 15.1783C6.62534 15.3228 6.82405 15.4039 7.03125 15.4039H13.2812C13.4885 15.4039 13.6872 15.3228 13.8337 15.1783C13.9802 15.0339 14.0625 14.838 14.0625 14.6337C14.0625 14.4294 13.9802 14.2335 13.8337 14.0891C13.6872 13.9447 13.4885 13.8635 13.2812 13.8635H7.03125Z" fill="white"/>
        </svg>
      </div>
      <div className={`header-page-icon-container ${activePage === 'drive' ? 'active' : 'inactive'}`} onClick={() => handleClick('drive')}>
        <svg className='header-page-icon' width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 17.5C0 16.5717 0.368749 15.6815 1.02513 15.0251C1.6815 14.3687 2.57174 14 3.5 14H24.5C25.4283 14 26.3185 14.3687 26.9749 15.0251C27.6313 15.6815 28 16.5717 28 17.5V19.25C28 20.1783 27.6313 21.0685 26.9749 21.7249C26.3185 22.3813 25.4283 22.75 24.5 22.75H3.5C2.57174 22.75 1.6815 22.3813 1.02513 21.7249C0.368749 21.0685 0 20.1783 0 19.25V17.5ZM4.375 19.25C4.60706 19.25 4.82962 19.1578 4.99372 18.9937C5.15781 18.8296 5.25 18.6071 5.25 18.375C5.25 18.1429 5.15781 17.9204 4.99372 17.7563C4.82962 17.5922 4.60706 17.5 4.375 17.5C4.14294 17.5 3.92038 17.5922 3.75628 17.7563C3.59219 17.9204 3.5 18.1429 3.5 18.375C3.5 18.6071 3.59219 18.8296 3.75628 18.9937C3.92038 19.1578 4.14294 19.25 4.375 19.25ZM7.875 19.25C8.10706 19.25 8.32962 19.1578 8.49372 18.9937C8.65781 18.8296 8.75 18.6071 8.75 18.375C8.75 18.1429 8.65781 17.9204 8.49372 17.7563C8.32962 17.5922 8.10706 17.5 7.875 17.5C7.64294 17.5 7.42038 17.5922 7.25628 17.7563C7.09219 17.9204 7 18.1429 7 18.375C7 18.6071 7.09219 18.8296 7.25628 18.9937C7.42038 19.1578 7.64294 19.25 7.875 19.25ZM1.5925 12.607C2.20062 12.3705 2.84751 12.2494 3.5 12.25H24.5C25.172 12.25 25.816 12.376 26.4075 12.607L23.1402 6.6185C22.9145 6.20437 22.5813 5.85872 22.1757 5.6179C21.7701 5.37709 21.3072 5.25 20.8355 5.25H7.1645C6.69282 5.25 6.22986 5.37709 5.82429 5.6179C5.41872 5.85872 5.08553 6.20437 4.85975 6.6185L1.5925 12.607Z" fill="white"/>
        </svg>
      </div>
      <div className={`header-page-icon-container ${activePage === 'documents' ? 'active' : 'inactive'}`} onClick={() => handleClick('documents')}>
        <svg className='header-page-icon' xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" style={{ marginTop: '9px' }} viewBox="0 0 16 16">
          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z"/>
        </svg>
      </div>

      {renderSettingsIcon()}

      
      {memberSettingsDropdown && (
        <>
          <div className='header-member-settings-dropdown'>
            <div className='header-leave-team-button' onClick={handleLeaveTeam}>팀 탈퇴하기</div>

          </div>
        </>

      )}


      {/* <div className={`header-page-settings-container ${activePage === 'teamsettings/personal-manage' ? 'active' : 'inactive'}`} onClick={() => handleClick('teamsettings/personal-manage')}>
        <svg className='header-page-icon' xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" viewBox="0 0 16 16">
          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
        </svg>
      </div> */}

      <div className='header-user-container'>
        {/* <div className='header-notification-button' onClick={handleNotificationClick} ref={userNotificationRef}>
          <svg xmlns="http://www.w3.org/2000/svg" className='header-notification-icon' viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
          </svg>

        </div> */}

        <div className='header-user-profile-button' onClick={handleDropdownClick} ref={userProfileRef}>
          <img className='header-user-profile-container' src={getSessionItem("profile").filepath || defaultImage} alt={''} onError={ErrorImageHandler}></img>
          <div className='header-user-profile-name'>
          {getSessionItem('profile').name}
          </div>
        </div>
      </div>

      {/* <div className={`header-notification-dropdown-container ${notificationDropdownVisible ? 'open' : 'close'}`}  ref={notificationDropdownRef}>
          <div className='header-notification-dropdown-top'>
            <div className='header-notification-dropdown-top-left'>
              <div>
              Notifications
              </div>
              <div>
              6
              </div>
            </div>
            <div className='header-notification-dropdown-top-right'>
                Clear
            </div>

          </div>
          <div className='header-notification-dropdown-list'>
            <div className='header-notification-dropdown-profile-container'>
              <div className='header-notification-dropdown-profile-image-container'>
                <img className='header-notification-dropdown-profile-image' src={''} alt={''} onError={ErrorImageHandler}></img>
              </div>
              <div className='header-notification-dropdown-profile-info-container'>
                <div className='header-notification-dropdown-name' >
                  Username
                </div>
                <div className='header-notification-dropdown-email' >
                  Username@gmail.com
                </div>
              </div>
            </div>

          </div>


      </div> */}

      {languageOptionsVisible && (
        <div className='header-language-dropdown-list' ref={languageDropdownRef}>
          <div className='header-language-top'>
            <div className='header-language-back-button' onClick={() => {
              setLanguageOptionsVisible(false);
              setDropdownVisible(true);
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
            </div>
            
            <div className='header-language-text' >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="gray" viewBox="0 0 16 16">
                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
                </svg>
                <div>
                  {t('language-word')}
                </div>
            </div>
          </div>
              <div className='header-language-option-container'>
              <div onClick={() => changeLanguage('ko')} className={`header-toggle-language-option ${selectedLanguage === 'ko' ? 'language-selected' : ''}`}>
                    한국어
                    <KoreanFlag />
                </div>
                <div onClick={() => changeLanguage('en')} className={`header-toggle-language-option ${selectedLanguage === 'en' ? 'language-selected' : ''}`}>
                    English
                    <EnglishFlag />
                </div>
                <div onClick={() => changeLanguage('es')} className={`header-toggle-language-option ${selectedLanguage === 'es' ? 'language-selected' : ''}`}>
                    Español
                    <SpanishFlag />
                </div>
                <div onClick={() => changeLanguage('fr')} className={`header-toggle-language-option ${selectedLanguage === 'fr' ? 'language-selected' : ''}`}>
                    Français
                    <FrenchFlag />
                </div>
                <div onClick={() => changeLanguage('de')} className={`header-toggle-language-option ${selectedLanguage === 'de' ? 'language-selected' : ''}`}>
                    Deutsch
                    <GermanFlag />
                </div>
                <div onClick={() => changeLanguage('ja')} className={`header-toggle-language-option ${selectedLanguage === 'ja' ? 'language-selected' : ''}`}>
                    日本語
                    <JapaneseFlag />
                </div>
                <div onClick={() => changeLanguage('zh')} className={`header-toggle-language-option ${selectedLanguage === 'zh' ? 'language-selected' : ''}`}>
                    中文
                    <ChineseFlag />
                </div>

              </div>
                
        </div>
      )}

        <div className={`header-profile-dropdown-list ${dropdownVisible ? 'open' : 'close'}`}  ref={dropdownRef}>
          <div className='header-profile-dropdown-profile-container'>
            <div className='header-profile-dropdown-profile-image-container'>
              <img className='header-profile-dropdown-profile-image' src={getSessionItem("profile").filepath || defaultImage} alt={''} onError={ErrorImageHandler}></img>
            </div>
            <div className='header-profile-dropdown-profile-info-container'>
              <div className='header-profile-dropdown-name' >
                {getSessionItem('profile').name}
              </div>
              <div className='header-profile-dropdown-email' >
                {getSessionItem('profile').username}
              </div>
            </div>
          </div>

          <div className='header-profile-dropdown-option-container'>
            <div className='header-profile-dropdown-darkmode'>
              <div className='header-profile-dropdown-option-left' >
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" className='header-user-icon' viewBox="0 0 16 16">
                  <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
                  <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
                </svg>
                <div className='header-text-bold'>
                  {t('darkmode')}

                </div>
              </div>
              <ToggleButton
                isChecked={isDarkMode}
                onToggle={handleDarkModeToggle}
              />
            </div>
            <div className='header-profile-dropdown-option' onClick={handleLanguageClick}>
              <div className='header-profile-dropdown-option-left' >

                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" className='header-user-icon' viewBox="0 0 16 16">
                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
                </svg>
                <div className='header-text-bold'>
                  {t('language-word')}

                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='header-user-icon' viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
              </svg>
            </div>
            <div className='header-profile-dropdown-option'  onClick={openAccountSettings}>
              <div className='header-profile-dropdown-option-left' >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" className='header-user-icon' viewBox="0 0 16 16">
                  <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                </svg>
                <div className='header-text-bold' >
                {t('account-settings')}
                </div>
              </div>
            </div>            
          </div>
          <div className='header-profile-dropdown-bottom' onClick={() => handleClick('logout')}>
            <div className='header-profile-dropdown-bottom-left' >
              {/*<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" className='header-user-icon' viewBox="0 0 17 17">*/}
              {/*  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>*/}
              {/*</svg>*/}
              {/*<div className='header-text-bold'>*/}

              {/*{t('help')}*/}

              {/*</div>*/}
            </div>

            <div className='header-profile-dropdown-bottom-right' onClick={()=>logoutBtn()} >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" className='header-logout-icon ' viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
              </svg>
              <div className='header-text-bold'>
              {t('logout')}

              </div>
            </div>
          </div>


        </div>
      
    </header>
  );
};

export default Header;