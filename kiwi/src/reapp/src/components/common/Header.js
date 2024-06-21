import React, {useState, useRef, useContext, useEffect} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import ToggleButton from './ToggleButton';
import { useTranslation } from 'react-i18next';

import '../../styles/components/common/Header.css';
import ErrorImageHandler from "./ErrorImageHandler";
import {TeamContext} from "../../context/TeamContext";
import {getSessionItem, setSessionItem} from "../../jwt/storage";
import axiosHandler from "../../jwt/axiosHandler";

import Calendar from '../../images/svg/calendar.svg';


const Header = () => {

  const [teams, setTeams] = useContext(TeamContext);
  const { teamno } = useParams();

  const [activePage, setActivePage] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [teamDropdown, setTeamDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const [languageOptionsVisible, setLanguageOptionsVisible] = useState(false);
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState({});

  const fetchTeams = async () => {
    const memberId = getSessionItem("profile").username;
    try {
      const res = await axiosHandler.get("/api/team/list/" + memberId);
      if (res.status === 200) {
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


  useEffect(() => {
    if (teams.length > 0) {
      const team = teams.find(team => team.team === teamno);
      if (team) {
        setSelectedTeam(team);
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
    if (languageOptionsVisible === true) {
      setLanguageOptionsVisible(false);
    } else {
      setDropdownVisible(!dropdownVisible);
      setLanguageOptionsVisible(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
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

  return (
    <header className='header-container'>
      <div className='header-team-container-wrapper'>
        <div className={`header-team-container ${teamDropdown ? 'active' : ''}`}>
          <div className='header-selected-team-details' onClick={toggleTeamDropdown}>
            <img className='header-selected-team-profile-image' src={selectedTeam.teamFilepath} alt={''} onError={ErrorImageHandler}/>
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
            <div className='header-team-dropdown-list-container'>
              <div className='header-team-dropdown-list'>
                {teams.map(team => (
                  <div 
                    className={`header-team-details ${team.team === selectedTeam.team ? 'selected' : ''}`}
                    key={team.team}
                    onClick={() => handleTeamClick(team)}
                  >
                    <img className='header-team-profile-image' src={team.teamFilepath} alt={''} onError={ErrorImageHandler} />
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
              <div className='header-create-team-button'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '4px' }}>
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
                <div>&nbsp;&nbsp;Create Team</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`header-page-icon-container ${activePage === 'chat' ? 'active' : 'inactive'}`} onClick={() => handleClick('chat')}>
        <svg className='header-page-icon' width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 10.7827C25 16.7379 19.4031 21.5655 12.5 21.5655C11.2619 21.5682 10.0288 21.4097 8.83281 21.0941C7.92031 21.5501 5.825 22.425 2.3 22.9949C1.9875 23.0442 1.75 22.7238 1.87344 22.4373C2.42656 21.1496 2.92656 19.4336 3.07656 17.8685C1.1625 15.9738 0 13.4938 0 10.7827C0 4.82758 5.59687 0 12.5 0C19.4031 0 25 4.82758 25 10.7827ZM7.03125 6.16156C6.82405 6.16156 6.62534 6.24271 6.47882 6.38715C6.33231 6.53159 6.25 6.72749 6.25 6.93176C6.25 7.13602 6.33231 7.33193 6.47882 7.47637C6.62534 7.62081 6.82405 7.70195 7.03125 7.70195H17.9688C18.176 7.70195 18.3747 7.62081 18.5212 7.47637C18.6677 7.33193 18.75 7.13602 18.75 6.93176C18.75 6.72749 18.6677 6.53159 18.5212 6.38715C18.3747 6.24271 18.176 6.16156 17.9688 6.16156H7.03125ZM7.03125 10.0125C6.82405 10.0125 6.62534 10.0937 6.47882 10.2381C6.33231 10.3826 6.25 10.5785 6.25 10.7827C6.25 10.987 6.33231 11.1829 6.47882 11.3273C6.62534 11.4718 6.82405 11.5529 7.03125 11.5529H17.9688C18.176 11.5529 18.3747 11.4718 18.5212 11.3273C18.6677 11.1829 18.75 10.987 18.75 10.7827C18.75 10.5785 18.6677 10.3826 18.5212 10.2381C18.3747 10.0937 18.176 10.0125 17.9688 10.0125H7.03125ZM7.03125 13.8635C6.82405 13.8635 6.62534 13.9447 6.47882 14.0891C6.33231 14.2335 6.25 14.4294 6.25 14.6337C6.25 14.838 6.33231 15.0339 6.47882 15.1783C6.62534 15.3228 6.82405 15.4039 7.03125 15.4039H13.2812C13.4885 15.4039 13.6872 15.3228 13.8337 15.1783C13.9802 15.0339 14.0625 14.838 14.0625 14.6337C14.0625 14.4294 13.9802 14.2335 13.8337 14.0891C13.6872 13.9447 13.4885 13.8635 13.2812 13.8635H7.03125Z" fill="white"/>
        </svg>
      </div>
      <div className={`header-page-icon-container ${activePage === 'calendar' ? 'active' : 'inactive'}`} onClick={() => handleClick('calendar')}>
        {/* <svg className='header-page-icon' width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.25 0.78125C6.25 0.57405 6.16769 0.375336 6.02118 0.228823C5.87466 0.0823101 5.67595 0 5.46875 0C5.26155 0 5.06284 0.0823101 4.91632 0.228823C4.76981 0.375336 4.6875 0.57405 4.6875 0.78125V1.5625H3.125C2.2962 1.5625 1.50134 1.89174 0.915291 2.47779C0.32924 3.06384 0 3.8587 0 4.6875L0 6.25H25V4.6875C25 3.8587 24.6708 3.06384 24.0847 2.47779C23.4987 1.89174 22.7038 1.5625 21.875 1.5625H20.3125V0.78125C20.3125 0.57405 20.2302 0.375336 20.0837 0.228823C19.9372 0.0823101 19.7385 0 19.5312 0C19.324 0 19.1253 0.0823101 18.9788 0.228823C18.8323 0.375336 18.75 0.57405 18.75 0.78125V1.5625H6.25V0.78125ZM25 21.875V7.8125H0V21.875C0 22.7038 0.32924 23.4987 0.915291 24.0847C1.50134 24.6708 2.2962 25 3.125 25H21.875C22.7038 25 23.4987 24.6708 24.0847 24.0847C24.6708 23.4987 25 22.7038 25 21.875ZM14.8438 10.9375H16.4062C16.6135 10.9375 16.8122 11.0198 16.9587 11.1663C17.1052 11.3128 17.1875 11.5115 17.1875 11.7188V13.2812C17.1875 13.4885 17.1052 13.6872 16.9587 13.8337C16.8122 13.9802 16.6135 14.0625 16.4062 14.0625H14.8438C14.6365 14.0625 14.4378 13.9802 14.2913 13.8337C14.1448 13.6872 14.0625 13.4885 14.0625 13.2812V11.7188C14.0625 11.5115 14.1448 11.3128 14.2913 11.1663C14.4378 11.0198 14.6365 10.9375 14.8438 10.9375ZM19.5312 10.9375H21.0938C21.301 10.9375 21.4997 11.0198 21.6462 11.1663C21.7927 11.3128 21.875 11.5115 21.875 11.7188V13.2812C21.875 13.4885 21.7927 13.6872 21.6462 13.8337C21.4997 13.9802 21.301 14.0625 21.0938 14.0625H19.5312C19.324 14.0625 19.1253 13.9802 18.9788 13.8337C18.8323 13.6872 18.75 13.4885 18.75 13.2812V11.7188C18.75 11.5115 18.8323 11.3128 18.9788 11.1663C19.1253 11.0198 19.324 10.9375 19.5312 10.9375ZM3.125 16.4062C3.125 16.199 3.20731 16.0003 3.35382 15.8538C3.50034 15.7073 3.69905 15.625 3.90625 15.625H5.46875C5.67595 15.625 5.87466 15.7073 6.02118 15.8538C6.16769 16.0003 6.25 16.199 6.25 16.4062V17.9688C6.25 18.176 6.16769 18.3747 6.02118 18.5212C5.87466 18.6677 5.67595 18.75 5.46875 18.75H3.90625C3.69905 18.75 3.50034 18.6677 3.35382 18.5212C3.20731 18.3747 3.125 18.176 3.125 17.9688V16.4062ZM8.59375 15.625H10.1562C10.3635 15.625 10.5622 15.7073 10.7087 15.8538C10.8552 16.0003 10.9375 16.199 10.9375 16.4062V17.9688C10.9375 18.176 10.8552 18.3747 10.7087 18.5212C10.5622 18.6677 10.3635 18.75 10.1562 18.75H8.59375C8.38655 18.75 8.18784 18.6677 8.04132 18.5212C7.89481 18.3747 7.8125 18.176 7.8125 17.9688V16.4062C7.8125 16.199 7.89481 16.0003 8.04132 15.8538C8.18784 15.7073 8.38655 15.625 8.59375 15.625Z" fill="white"/>
        </svg> */}
        <img src={Calendar} alt="Logo" width={27} height={27} style={{ marginTop: '9px' }} />
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
      <div className={`header-page-settings-container ${activePage === 'teamsettings' ? 'active' : 'inactive'}`} onClick={() => handleClick('teamsettings')}>
        <svg className='header-page-icon' xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" viewBox="0 0 16 16">
          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
        </svg>
      </div>

      <div className='header-user-container'>
        <div className='header-notification-button'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='header-notification-icon' viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
          </svg>
        </div>

        <div className='header-user-profile-button' onClick={handleDropdownClick} ref={dropdownRef}>
          <img className='header-user-profile-container' src={getSessionItem("profile").filepath} alt={''} onError={ErrorImageHandler}></img>
        </div>
      </div>

      {languageOptionsVisible && (
        <div className='header-dropdown-list'>
          <div>
            <div onClick={() => {
              setLanguageOptionsVisible(false);
              setDropdownVisible(true);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
              </svg>
            </div>
          </div>
          <div onClick={() => changeLanguage('ko')}>한국어</div>
          <div onClick={() => changeLanguage('en')}>English</div>
          <div onClick={() => changeLanguage('es')}>Español</div>
          <div onClick={() => changeLanguage('fr')}>Français</div>
          <div onClick={() => changeLanguage('ja')}>日本語</div>
          <div onClick={() => changeLanguage('zh')}>中文</div>
          <div onClick={() => changeLanguage('de')}>Deutsch</div>
        </div>
      )}

        <div className={`header-dropdown-list ${dropdownVisible ? 'open' : 'close'}`}>
          <div>
            {t('darkmode')}
            <ToggleButton
              isChecked={isDarkMode}
              onToggle={handleDarkModeToggle}
            />
          </div>
          <div onClick={handleLanguageClick}>
            {t('language')}
          </div>
          <div onClick={() => handleClick('profile')}>{t('profile')}</div>
          <div onClick={() => handleClick('settings')}>{t('settings')}</div>
          <div onClick={() => handleClick('logout')}>{t('logout')}</div>
        </div>
      
    </header>
  );
};

export default Header;
