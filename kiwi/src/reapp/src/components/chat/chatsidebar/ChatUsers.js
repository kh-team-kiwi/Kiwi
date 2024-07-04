import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/components/chat/chatsidebar/ChatUsers.css';

import ErrorImageHandler from "../../common/ErrorImageHandler";

const ChatUsers = ({ chatNum }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chat/user/${chatNum}`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (chatNum) {
            fetchUsers();
        }

        const handleChatMemberUpdate = (event) => {
            setUsers(event.detail);
        };

        // 이벤트 리스너 추가
        window.addEventListener('chatMemberUpdate', handleChatMemberUpdate);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('chatMemberUpdate', handleChatMemberUpdate);
        };
    }, [chatNum]);

    return (
        <div className="chat-users-container">
            <h3>Users in Chat</h3>
            <ul className="chat-users-list">
                {users.map((user) => (
                    <li key={user.memberId} className="chat-user-item">
                        <img className='chat-user-profile-pic' src={''} alt={''} onError={ErrorImageHandler}></img>
                        <div className="chat-users-name">{user.memberNickname}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatUsers;
