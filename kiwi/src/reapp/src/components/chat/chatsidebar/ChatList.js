import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatList = ({ team, onChatSelect }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (team) {
            axios.get(`http://localhost:8080/api/chat?team=${team}`)
                .then(response => {
                    setChats(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the chat rooms!', error);
                });
        }
    }, [team]);

    return (
        <div>
            <h2>Chat Rooms</h2>
            <ul>
                {chats.map(chat => (
                    <li key={chat.chatNum} onClick={() => onChatSelect(chat.chatNum)}>
                        {chat.chatName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
