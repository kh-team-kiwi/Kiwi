import React, { useState, useEffect } from 'react';
import '../../../styles/components/chat/chatsidebar/CreateChatModal.css';
import { getSessionItem } from "../../../jwt/storage";
import ErrorImageHandler from "../../common/ErrorImageHandler";
import ExitIcon from '../../../images/svg/buttons/ExitIcon';
import axiosHandler from "../../../jwt/axiosHandler";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; 

const CreateChatModal = ({ onSave, onClose, team, showCreateChatModal }) => {
    const { t } = useTranslation(); 
    const [profile, setProfile] = useState(null);
    const [chatName, setChatName] = useState('');
    const [members, setMembers] = useState([]);
    const [joinedMembers, setJoinedMembers] = useState([]);
    const [nameError, setNameError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('invite');

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        if (storedProfile) {
            setProfile(storedProfile);
            setJoinedMembers([{ id: storedProfile.username, name: storedProfile.name, email: storedProfile.username, role: storedProfile.role }]);
        } else {
            console.error("Profile not found in session storage.");
        }
    }, []);

    useEffect(() => {
        if (profile && showCreateChatModal && team) {
            fetchMembers();
        }
    }, [profile, showCreateChatModal, team]);

    const fetchMembers = async () => {
        try {
            const response = await axiosHandler.get(`/api/chat/user/members?team=${team}`);
            const fetchedMembers = response.data
                .filter(member => member.memberId !== profile.username)
                .map(member => ({
                    id: member.memberId,
                    name: member.memberNickname,
                    email: member.memberId,
                    role: member.memberRole,
                    filepath: member.memberFilepath
                }));
            setMembers(fetchedMembers);
        } catch (error) {
            console.error('Failed to fetch members:', error);
        }
    };

    const handleChatNameChange = (event) => {
        const name = event.target.value;
        setChatName(name);
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
        if (joinedMember.id === profile?.username) {
            return;
        }
        setJoinedMembers(joinedMembers.filter(a => a.id !== joinedMember.id));
    };

    const handleSave = async () => {
        if (!profile || !chatName.trim()) {
            toast.error(t('chat-name-error'));
            console.error('Invalid profile or chat name');
            return;
        }

        const chatData = {
            chatName,
            approvers: joinedMembers,
            admins: joinedMembers.map(member => member.id),
            participants: joinedMembers.map(member => member.id),
            team,
            chatOpen: true
        };

        onSave(chatData);
        toast.success(t('chat-created-success')); 

        onClose();
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMembers = members.filter(member =>
        member.email.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    return (
        <div className="create-chat-modal-overlay">
            <div className="create-chat-modal-content">
                <div className='create-chat-header'>{t('create-chat-room')}</div>
                <div className="create-chat-form-group">
                    <div className='create-chat-chat-name-container'>
                        <input
                            type="text"
                            value={chatName}
                            onChange={handleChatNameChange}
                            placeholder={t('chat-room-name')}
                            className='create-chat-chat-name'
                        />
                    </div>
                </div>
                <div className="create-chat-tab-container">
                    <div
                        className={`create-chat-tab ${activeTab === 'invite' ? 'active' : ''}`}
                        onClick={() => setActiveTab('invite')}
                    >
                        {t('invite-members')}
                    </div>
                    <div
                        className={`create-chat-tab ${activeTab === 'joined' ? 'active' : ''}`}
                        onClick={() => setActiveTab('joined')}
                    >
                        {t('joined-members')}
                    </div>
                </div>
                <div className="create-chat-container">
                    {activeTab === 'invite' && (
                        <div className='create-chat-member-list-container'>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder={t('search-members-by-email')}
                                className="create-chat-search-input"
                            />
                            <div className="create-chat-member-list">
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            className={`create-chat-member-item ${joinedMembers.some(joinedMember => joinedMember.id === member.id) ? 'create-chat-selected' : ''}`}
                                            onClick={() => handleMemberClick(member)}
                                        >
                                            <img className='create-chat-profile-image' src={member.filepath} alt={''} onError={ErrorImageHandler}></img>
                                            <div className='create-chat-profile-info'>
                                                <div className='create-chat-profile-name'>
                                                    {member.name} {joinedMembers.some(joinedMember => joinedMember.id === member.id) && <span className="create-chat-joined-tag">{t('joined')}</span>}
                                                </div>
                                                <div className='create-chat-profile-email'>
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
                        <div className="create-chat-selected-list">
                            <div className="create-chat-admins-list">
                                {joinedMembers.map((joinedMember) => (
                                    <div key={joinedMember.id} className="create-chat-admin-item">
                                        <img className='create-chat-profile-image' src={joinedMember.id === profile?.username ? profile.filepath : joinedMember.filepath} alt={''} onError={ErrorImageHandler} />
                                        <div className='create-chat-profile-info'>
                                            <div className='create-chat-profile-name'>
                                                {joinedMember.name} {joinedMember.id === profile?.username && <span className="create-chat-you-tag">{t('you')}</span>}
                                            </div>
                                            <div className='create-chat-profile-email'>
                                                {joinedMember.email} 
                                            </div>
                                        </div>
                                        {joinedMember.id !== profile?.username && (
                                            <div className='create-chat-remove-button' onClick={() => handleRemoveJoinedMember(joinedMember)}>
                                                <ExitIcon />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="create-chat-modal-bottom">
                    <button className="create-chat-cancel-button" onClick={onClose}>{t('cancel')}</button>
                    <button className="create-chat-create-button" onClick={handleSave}>{t('create')}</button>
                </div>
            </div>
        </div>
    );
};

export default CreateChatModal;
