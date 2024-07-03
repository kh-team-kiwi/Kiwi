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
    }, [chatNum]);

    return (
        <div className="chat-users-container">
            <h3>Users in Chat</h3>
            <ul className="chat-users-list">
                {users.map((user) => (
                    <li key={user.memberId} className="chat-user-item">
                        <img className='chat-user-profile-pic' src={''} alt={''} onError={ErrorImageHandler}></img>

                        {/* <img src={user.profilePic} alt={`${user.memberNickname}'s profile`} className="chat-user-profile-pic" /> */}
                        <div className="chat-users-name">{user.memberNickname} </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatUsers;
