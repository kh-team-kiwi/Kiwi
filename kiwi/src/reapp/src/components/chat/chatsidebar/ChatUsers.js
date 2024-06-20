import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatUsers = ({ chatNum }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chat/users/${chatNum}`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [chatNum]);

    return (
        <div className="chat-users">
            <h3>Users in Chat</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.memberId}>{user.memberNickname}</li>
                ))}
            </ul>
        </div>
    );
};

export default ChatUsers;
