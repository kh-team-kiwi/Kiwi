import React, { useState, useEffect } from 'react';
import '../../../styles/components/chat/chatsidebar/ChatUsers.css';
import ErrorImageHandler from "../../common/ErrorImageHandler";
import axiosHandler from "../../../jwt/axiosHandler";
import SharedIcon from '../../../images/svg/buttons/SharedIcon';


const ChatUsers = ({ chatNum }) => {
    const [users, setUsers] = useState([]);
    const [memberCount, setMemberCount] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosHandler.get(`http://localhost:8080/api/chat/user/${chatNum}`);
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
                <div>Members - {memberCount}</div>
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
