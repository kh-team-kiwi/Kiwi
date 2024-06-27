import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getSessionItem } from "../../../jwt/storage";

const ChatList = ({ onChatSelect, team, refreshChatList }) => {
    const [chats, setChats] = useState([]);
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        console.log(`useEffect: storedProfile=${JSON.stringify(storedProfile)}`);
        setProfile(storedProfile);
        if (storedProfile && storedProfile.username) {
            setUsername(storedProfile.username); // Set username from profile
            console.log(`useEffect: username set to ${storedProfile.username}`);
        }
    }, []);

    useEffect(() => {
        if (team && username) {
            console.log(`Fetching chat rooms for team: ${team} and member: ${username}`);
            axios.get(`http://localhost:8080/api/chat?team=${team}&memberId=${username}`)
                .then(response => {
                    console.log('Fetched chat rooms:', response.data); // Log fetched chat rooms
                    setChats(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the chat rooms!', error);
                });
        }
    }, [team, refreshChatList, username]);

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
