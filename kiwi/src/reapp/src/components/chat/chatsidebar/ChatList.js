import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getSessionItem } from "../../../jwt/storage";
import '../../../styles/components/chat/chatsidebar/ChatList.css';

import ExitIcon from '../../../images/svg/buttons/ExitIcon';
import SearchIcon from '../../../images/svg/buttons/SearchIcon';
import axiosHandler from "../../../jwt/axiosHandler";

import ChatIcon from '../../../images/svg/buttons/ChatIcon';

const ChatList = ({ onChatSelect, team, refreshChatList }) => {
    const [chats, setChats] = useState([]);
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        console.log(`useEffect: storedProfile=${JSON.stringify(storedProfile)}`);
        setProfile(storedProfile);
        if (storedProfile && storedProfile.username) {
            setUsername(storedProfile.username); 
            console.log(`useEffect: username set to ${storedProfile.username}`);
        }
    }, []);

    useEffect(() => {
        if (team && username) {
            console.log(`Fetching chat rooms for team: ${team} and member: ${username}`);
            axiosHandler.get(`http://localhost:8080/api/chat?team=${team}&memberId=${username}`)
                .then(response => {
                    console.log('Fetched chat rooms:', response.data); 
                    setChats(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the chat rooms!', error);
                });
        }
    }, [team, refreshChatList, username]);

    useEffect(() => {
        if (chats.length > 0 && !selectedChat) {
            const firstChat = chats[0];
            handleChatSelect(firstChat.chatNum, firstChat.chatName);
        }
    }, [chats, selectedChat]);

    const handleChatSelect = (chatNum, chatName) => {
        setSelectedChat(chatNum);
        onChatSelect(chatNum, chatName);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const highlightText = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <span key={index} className='chat-list-highlight'>{part}</span> : part
        );
    };

    const filteredChats = chats.filter(chat =>
        chat.chatName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="chat-list-container">
            <div className="chat-list-search-container">
                <SearchIcon className="chat-list-search-icon" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search Chat"
                    className="chat-list-search-input"
                />
                {searchQuery && (
                    <button className="chat-list-clear-search-button" onClick={clearSearch}>
                        <ExitIcon />
                    </button>
                )}
            </div>
            <div className='chat-list-header'>
                <ChatIcon className='chat-list-chat-icon'/>
                <div>
                    Group Chats - {filteredChats.length}
                </div>
            </div>
            <ul className="chat-list-ul">
                {filteredChats.map(chat => (
                    <li 
                        key={chat.chatNum} 
                        onClick={() => handleChatSelect(chat.chatNum, chat.chatName)}
                        className={`chat-list-item ${selectedChat === chat.chatNum ? 'chat-list-selected' : ''}`}
                    >
                        <div className="chat-list-item-name">{highlightText(chat.chatName, searchQuery)}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
