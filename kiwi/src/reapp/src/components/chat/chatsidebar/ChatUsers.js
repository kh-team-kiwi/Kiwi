import React, { useState, useEffect } from 'react';
import '../../../styles/components/chat/chatsidebar/ChatUsers.css';
import ErrorImageHandler from "../../common/ErrorImageHandler";
import axiosHandler from "../../../jwt/axiosHandler";
import SharedIcon from '../../../images/svg/buttons/SharedIcon';
import { useTranslation } from 'react-i18next';


const ChatUsers = ({ chatNum }) => {
    const [users, setUsers] = useState([]);
    const [memberCount, setMemberCount] = useState(0);
    const { t } = useTranslation();


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosHandler.get(`/api/chat/user/${chatNum}`);
                setUsers(response.data);
                setMemberCount(response.data.length);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (chatNum) {
            fetchUsers();
        }

        const handleChatMemberUpdate = (event) => {
            setUsers(event.detail);
            setMemberCount(event.detail.length);
        };

        window.addEventListener('chatMemberUpdate', handleChatMemberUpdate);

        return () => {
            window.removeEventListener('chatMemberUpdate', handleChatMemberUpdate);
        };
    }, [chatNum]);

    return (
        <div className="chat-users-container">
            <div className='chat-users-header'>
                <SharedIcon className='chat-users-icon'/>
                <div>{t('members')} - {memberCount}</div>
            </div>
            <ul className="chat-users-list">
                {users.map((user) => (
                    <li key={user.memberId} className="chat-user-item">
                        <img className='chat-user-profile-pic' src={user.memberFilepath} alt={''} onError={ErrorImageHandler}></img>
                        <div className="chat-users-name">{user.memberNickname}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatUsers;
