import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatList = ({ onChatSelect, team, refreshChatList }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (team) {
            console.log(`Fetching chat rooms for team: ${team}`);
            axios.get(`http://localhost:8080/api/chat?team=${team}`)
                .then(response => {
                    setChats(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the chat rooms!', error);
                });
        }
    }, [team, refreshChatList]);

    return (
        <div>
            <h2>Chat Rooms</h2>
            <ul>
                {chats.map(chat => (
                    <li key={chat.chatNum} onClick={() => onChatSelect(chat.chatNum, chat.chatName)}>
                        {chat.chatName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
