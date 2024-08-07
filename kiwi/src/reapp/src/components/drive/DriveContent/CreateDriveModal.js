import React, { useState, useEffect } from 'react';
import '../../../styles/components/drive/CreateDriveModal.css';
import { getSessionItem } from "../../../jwt/storage";
import ErrorImageHandler from "../../common/ErrorImageHandler";
import ExitIcon from '../../../images/svg/buttons/ExitIcon';
import axiosHandler from "../../../jwt/axiosHandler";
import { useTranslation } from 'react-i18next';

import { toast } from 'react-toastify';

const CreateDriveModal = ({ onSave, onClose, team, showCreateDriveModal }) => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState(null);
    const [driveName, setDriveName] = useState('');
    const [members, setMembers] = useState([]);
    const [joinedMembers, setJoinedMembers] = useState([]);
    const [nameError, setNameError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('invite');

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        setProfile(storedProfile);
        if (storedProfile) {
            setJoinedMembers([{ id: storedProfile.username, name: storedProfile.name, email: storedProfile.username, role: storedProfile.role }]);
        }
    }, []);

    useEffect(() => {
        if (profile && showCreateDriveModal && team) {
            fetchMembers();
        }
    }, [profile, showCreateDriveModal, team]);

    const fetchMembers = async () => {
        try {
            const response = await axiosHandler.get(`/api/chat/user/members?team=${team}`);
            const fetchedMembers = response.data
                .filter(member => member.memberId !== profile.username)
                .map(member => ({
                    id: member.memberId,
                    name: member.memberNickname,
                    email: member.memberId,
                    role: member.memberRole
                }));
            setMembers(fetchedMembers);
        } catch (error) {
            console.error('Failed to fetch members:', error);
        }
    };

    const handleDriveNameChange = (event) => {
        const name = event.target.value;
        setDriveName(name);
        setNameError(!name.trim());
    };

    const handleMemberClick = (member) => {
        if (joinedMembers.some(joinedMember => joinedMember.id === member.id)) {
            setJoinedMembers(joinedMembers.filter(joinedMember => joinedMember.id !== member.id));
        } else {
            setJoinedMembers([...joinedMembers, member]);
        }
    };

    const handleRemoveJoinedMember = (joinedMember) => {
        if (joinedMember.id === profile.username) {
            return;
        }
        setJoinedMembers(joinedMembers.filter(a => a.id !== joinedMember.id));
    };

    const handleSave = async () => {
        if (!profile || !driveName.trim()) {
            toast.error(t('drive-name-error'));
            return;
        }

        const driveData = {
            fileDriveDTO: {
                driveName,
                team
            },
            userIds: joinedMembers.map(joinedMember => joinedMember.id)
        };

        try {
            const response = await axiosHandler.post('/api/drive/create', driveData);
            onSave(response.data);
            toast.success(t('drive-created-successfully'));

            onClose();
        } catch (error) {
            console.error('Failed to create drive', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMembers = members.filter(member =>
        member.email.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    return (
        <div className="create-drive-modal-overlay">
            <div className="create-drive-modal-content">
                <div className='create-drive-header'>{t('create-shared-drive')}</div>
                <div className="create-drive-form-group">
                    <div className='create-drive-drive-name-container'>
                        <input
                            type="text"
                            value={driveName}
                            onChange={handleDriveNameChange}
                            placeholder={t('drive-name')}
                            className='create-drive-drive-name'
                        />
                    </div>
                </div>
                <div className="create-drive-tab-container">
                    <div
                        className={`create-drive-tab ${activeTab === 'invite' ? 'active' : ''}`}
                        onClick={() => setActiveTab('invite')}
                    >
                        {t('invite-members')}
                    </div>
                    <div
                        className={`create-drive-tab ${activeTab === 'joined' ? 'active' : ''}`}
                        onClick={() => setActiveTab('joined')}
                    >
                        {t('joined-members')}
                    </div>
                </div>
                <div className="create-drive-container">
                    {activeTab === 'invite' && (
                        <div className='create-drive-member-list-container'>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder={t('search-members-by-email')}
                                className="create-drive-search-input"
                            />
                            <div className="create-drive-member-list">
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            className={`create-drive-member-item ${joinedMembers.some(joinedMember => joinedMember.id === member.id) ? 'create-drive-selected' : ''}`}
                                            onClick={() => handleMemberClick(member)}
                                        >
                                            <img className='create-drive-profile-image' src='' alt={''} onError={ErrorImageHandler}></img>
                                            <div className='create-drive-profile-info'>
                                                <div className='create-drive-profile-name'>
                                                    {member.name} {joinedMembers.some(joinedMember => joinedMember.id === member.id) && <span className="create-drive-joined-tag">{t('joined')}</span>}
                                                </div>
                                                <div className='create-drive-profile-email'>
                                                    {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-members-message">{t('no-members-to-invite')}</div>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'joined' && (
                        <div className="create-drive-selected-list">
                            <div className="create-drive-admins-list">
                                {joinedMembers.map((joinedMember) => (
                                    <div key={joinedMember.id} className="create-drive-admin-item">
                                        <img className='create-drive-profile-image' src='' alt={''} onError={ErrorImageHandler}></img>
                                        <div className='create-drive-profile-info'>
                                            <div className='create-drive-profile-name'>
                                                {joinedMember.name} {joinedMember.id === profile.username && <span className="create-drive-you-tag">{t('you')}</span>}
                                            </div>
                                            <div className='create-drive-profile-email'>
                                                {joinedMember.email}
                                            </div>
                                        </div>
                                        {joinedMember.id !== profile.username && (
                                            <div className='create-drive-remove-button' onClick={() => handleRemoveJoinedMember(joinedMember)}>
                                                <ExitIcon />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="create-drive-modal-bottom">
                    <button className="create-drive-cancel-button" onClick={onClose}>{t('cancel')}</button>
                    <button className="create-drive-create-button" onClick={handleSave}>{t('create')}</button>
                </div>
            </div>
        </div>
    );
};

export default CreateDriveModal;
