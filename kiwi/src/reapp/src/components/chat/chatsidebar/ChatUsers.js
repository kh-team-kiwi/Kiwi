import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/components/chat/chatsidebar/ChatUsers.css';

import ErrorImageHandler from "../../common/ErrorImageHandler";

const ChatUsers = ({ chatNum }) => {
    const [owners, setOwners] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chat/user/${chatNum}`);
                groupUsersByRole(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (chatNum) {
            fetchUsers();
        }
    }, [chatNum]);

    const groupUsersByRole = (users) => {
        const owners = [];
        const admins = [];
        const members = [];

        users.forEach(user => {
            if (user.memberRole === 'OWNER') {
                owners.push(user);
            } else if (user.memberRole === 'ADMIN') {
                admins.push(user);
            } else {
                members.push(user);
            }
        });

        setOwners(owners);
        setAdmins(admins);
        setMembers(members);
    };

    return (
        <div className="chat-users-container">
            {owners.length > 0 && (
                <div className="chat-users-role">
                    <h4>Owners</h4>
                    <ul className="chat-users-list">
                        {owners.map((user) => (
                            <li key={user.memberId} className="chat-user-item">
                                <img className='chat-user-profile-pic' src={''} alt={''} onError={ErrorImageHandler}></img>
                                <div className="chat-users-name">{user.memberNickname}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {admins.length > 0 && (
                <div className="chat-users-role">
                    <h4>Admins</h4>
                    <ul className="chat-users-list">
                        {admins.map((user) => (
                            <li key={user.memberId} className="chat-user-item">
                                <img className='chat-user-profile-pic' src={''} alt={''} onError={ErrorImageHandler}></img>
                                <div className="chat-users-name">{user.memberNickname}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {members.length > 0 && (
                <div className="chat-users-role">
                    <h4>Members</h4>
                    <ul className="chat-users-list">
                        {members.map((user) => (
                            <li key={user.memberId} className="chat-user-item">
                                <img className='chat-user-profile-pic' src={''} alt={''} onError={ErrorImageHandler}></img>
                                <div className="chat-users-name">{user.memberNickname}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ChatUsers;
