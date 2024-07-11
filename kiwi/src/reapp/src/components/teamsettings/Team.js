import React, { useState, useEffect, useContext } from 'react';
import '../../styles/components/teamsettings/Team.css';
import axiosHandler from "../../jwt/axiosHandler";
import PlusIcon from "../../images/svg/shapes/PlusIcon";
import { TeamContext } from "../../context/TeamContext";
import { getSessionItem } from "../../jwt/storage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorImageHandler from "../common/ErrorImageHandler";
import { toast } from 'react-toastify';
import ErrorImage from '../../images/default-image.png';
import ClearIcon from "../../images/svg/buttons/ExitIcon";
import { useTranslation } from 'react-i18next';

const Loading = () => {
    return <div></div>;
};

const Team = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [name, setName] = useState('');
    const [profile, setProfile] = useState();
    const [file, setFile] = useState();
    const [deletePassword, setDeletePassword] = useState('');
    const [changeOwnerPassword, setChangeOwnerPassword] = useState('');
    const navigate = useNavigate();
    const { teamno } = useParams();
    const { role, setRole, teamProfile } = useContext(TeamContext);
    const [ownerInput, setOwnerInput] = useState('');
    const [searchList, setSearchList] = useState([]);
    const [searchSelect, setSearchSelect] = useState('');
    const [isOwnerBtn, setIsOwnerBtn] = useState(true);
    const [loading, setLoading] = useState(true);

    const currentUserId = getSessionItem('profile').username;

    const handleProfilePictureChange = async (e) => {
        const newProfile = URL.createObjectURL(e.target.files[0]);
        setProfile(newProfile);
        setFile(e.target.files[0]);
        await handleTeamProfile(newProfile, e.target.files[0]);
    };

    const handleProfileCancel = () => {
        setProfile(undefined);
    };

    const handleTeamName = async () => {
        if (name.length === 0) return toast.error(t('title-empty-error'));
        try {
            const res = await axiosHandler.put('/api/team/'+teamno+'/teamname/'+name);
            if(res.data.result){
                window.location.reload();
            }else {
                toast.error(res.data.message);
            }
        } catch (e) {
            toast.error(t('error-occurred'));
        }
    };

    const handleTeamDelete = async () => {
        try {
            const memberId = getSessionItem('profile').username;
            const res = await axiosHandler.post('/api/team/'+teamno+'/member/'+memberId+'/deleteTeam',{password:deletePassword});
            if(res.data.result){
                navigate('/home',{replace:true});
            }else {
                toast.error(res.data.message);
            }
        } catch (e) {
            toast.error(t('error-occurred'));
        }
    };

    const handleTeamProfile = async (newProfile, newFile) => {
        if (newProfile === undefined) return toast.error(t('no-image-error'));
        const formData = new FormData();
        formData.append('profile', newFile);
        formData.append('team', teamno);
        formData.append('memberId', currentUserId);

        try {
            const res = await axiosHandler.post('/api/team/upload/profile', formData,
                { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res.data.result) {
                toast.success(t('profile-updated'));
            } else {
                toast.error(res.data.message);
            }
        } catch (e) {
            toast.error(t('error-occurred'));
        }
    };

    const handleRole = async () => {
        try {
            const res = await axiosHandler.put('/api/team/change/owner', { teamno: teamno, newOwner: searchSelect.memberId, oldOwner: currentUserId, password: changeOwnerPassword });
            if (res.data.result) {
                setRole('ADMIN');

                navigate(`/team/${teamno}/settings/user`);

            } else {
                toast.error(t('error-occurred'));
            }
        } catch (e) {
            toast.error(t('error-occurred'));
        }
    };

    useEffect(() => {
        if (role !== null) {
            setLoading(false);
        }
    }, [role]);

    useEffect(() => {
        if (loading === false && role !== 'OWNER') {
            toast.error(t('no-permission-error'));
            navigate('/team/' + teamno + '/settings');
        }
    }, [loading, role]);

    useEffect(() => {
        if (searchSelect === '') {
            setIsOwnerBtn(true);
        } else {
            setIsOwnerBtn(false);
        }
    }, [searchSelect]);

    useEffect(() => {
        searchMember();
    }, [ownerInput]);

    const searchMember = async () => {
        if (ownerInput === '') return setSearchList([]);
        try {
            const res = await axiosHandler.get('/api/team/'+teamno+'/searchkey/'+ownerInput);
            if(res.data.result){
                const filteredResults = res.data.data.filter(member => member.memberId !== currentUserId);
                setSearchList(filteredResults);
            } else {
                toast.error(res.data.message);
            }
        } catch (e) {
            toast.error(t('error-occurred'));
        }
    };

    const handleOwnerInput = async (e) => {
        setOwnerInput(e.target.value);
    };

    const handleClearSearch = () => {
        setOwnerInput('');
        setSearchList([]);
    };

    const searchSelectHandle = (item) => {
        setSearchSelect(item);
        setOwnerInput('');  
        setSearchList([]);
    };

    const handleRemoveSelectedUser = () => {
        setSearchSelect('');
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="team-settings-container">
            <div className="team-settings-profile-container">
                <div className="team-settings-profile-picture-container">
                    {profile || teamProfile ? (
                        <>
                            <img src={profile || teamProfile} alt="Team Profile" className="team-settings-placeholder" onError={ErrorImageHandler} />
                        </>
                    ) : (
                        <img src={ErrorImage} className="team-settings-placeholder" />
                    )}
                    <div className="team-settings-upload-button" onClick={() => document.getElementById('fileInput').click()}>
                        <PlusIcon className="team-settings-plus-icon" />
                    </div>
                    <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleProfilePictureChange} />
                </div>
            </div>

            <div className="team-settings-options">
                <div className="team-settings-change-name-container">
                    <div className="team-settings-change-name">
                        {t('change-team-name')}
                    </div>
                    <div>
                        <input type="text" placeholder={t('new-team-name')} value={name} onChange={(e) => setName(e.target.value)} className="team-settings-input" />

                        <div className='team-settings-button-wrapper'>
                        <button onClick={() => handleTeamName()} className="team-settings-change-name-button">{t('change-name')}</button>

                        </div>
                    </div>
                </div>

                <div className="team-settings-change-owner-container">
                    <div className="team-settings-change-owner">
                        {t('change-team-ownership')}
                    </div>
                    <div className='team-settings-change-owner-warning'>
                        {t('change-team-ownership-description')}
                    </div>
                    <div className="team-settings-input-container">
                        <input type="text" value={ownerInput} onChange={handleOwnerInput} className="team-settings-input" placeholder={t('search-users-by-email')} />
                        {ownerInput && (
                            <button onClick={handleClearSearch} className="team-settings-clear-button">
                                <ClearIcon />
                            </button>
                        )}
                    </div>
                    {ownerInput && searchList.length > 0 && (
                        <ul className="team-settings-dropdown">
                            {searchList.map((item, idx) => (
                                <li className={`team-settings-search-item ${item.memberId === searchSelect.memberId ? 'select' : ''}`} key={idx} onClick={() => searchSelectHandle(item)}>
                                    <img className="team-settings-search-profile" src={item.memberFilepath} alt="" onError={ErrorImageHandler} />
                                    <div className="team-settings-search-name">
                                        <span className='team-settings-selected-name'>{item.memberNickname}</span>
                                        <span>{item.memberId}</span>
                                    </div>
                                    <span className="team-settings-search-role">{item.role}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {searchSelect && (
                        <div className="team-settings-select-item">
                            <img className="team-settings-search-profile" src={searchSelect.memberFilepath} alt="" onError={ErrorImageHandler} />
                            <div className="team-settings-search-name">
                                <div className='team-settings-selected-name-container'>
                                    <span className='team-settings-selected-name'>{searchSelect.memberNickname}</span>                                 
                                    <span className="team-settings-selected-tag">{t('selected')}</span>
                                </div>

                                <span>{searchSelect.memberId}</span>
                            </div>

                            <div className='team-settings-selected-right'>
                            <div className="team-settings-search-role">{searchSelect.role}</div>
                            <button onClick={handleRemoveSelectedUser} className="team-settings-remove-selected">
                                <ClearIcon />
                            </button>
                            </div>

                        </div>
                    )}

                    <div className='team-settings-bottom'>
                    <input
                            type="password"
                            placeholder={t('enter-your-password')}
                            value={changeOwnerPassword}
                            onChange={(e) => setChangeOwnerPassword(e.target.value)}
                            className="team-settings-password-input"
                        />
                        <button type="button" onClick={handleRole} className="team-settings-change-owner-button" disabled={isOwnerBtn}>{t('change-ownership')}</button>
                    </div>
                </div>

                <div className="team-settings-delete-container">
                    <div className="team-settings-delete">
                        {t('delete-team')}
                    </div>
                    <div className='team-settings-delete-warning'>
                        {t('delete-team-warning')}
                    </div>

                    <div className='team-settings-bottom'>
                            <input
                                type="password"
                                placeholder={t('enter-your-password')}
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="team-settings-password-input"
                            />
                        <button onClick={handleTeamDelete} className="team-settings-delete-button">{t('delete-team')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
