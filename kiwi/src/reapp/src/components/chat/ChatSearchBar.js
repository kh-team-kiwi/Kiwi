import React, {useEffect, useState} from 'react';
import '../../styles/components/chat/ChatSearchBar.css';
import SearchIcon from '../../images/svg/buttons/SearchIcon';
import ExitIcon from '../../images/svg/buttons/ExitIcon';
import axios from "axios";

const ChatSearchBar = ({ chatNum, onMessageClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (searchTerm) {
            fetchMessages();
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    }, [searchTerm]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/api/chat/message/messages/${chatNum}`);
            const filteredMessages = response.data.filter(msg =>
                msg.chatContent.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filteredMessages);
            setShowResults(true);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const highlightText = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <span key={index} className="chat-searchbar-highlight">{part}</span> : part
        );
    };

    const formatTime = (time) => {
        const date = new Date(time);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
    };

    const handleResultClick = (messageNum) => {
        if (onMessageClick) {
            onMessageClick(messageNum);
        }
        setShowResults(false);
    };

    return (
        <div className="chat-searchbar-container">
            <div className="chat-searchbar-input-container">
                <SearchIcon className="chat-searchbar-search-icon" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="메시지 검색"
                    className="chat-searchbar-input"
                />
                {searchTerm && (
                    <button className="chat-searchbar-clear-button" onClick={clearSearch}>
                        <ExitIcon />
                    </button>
                )}
            </div>
            {showResults && (
                <div className="chat-searchbar-results">
                    <div className="chat-searchbar-results-count">
                        {searchResults.length}개의 결과가 검색되었습니다.
                    </div>
                    {searchResults.map((msg, index) => (
                        <div key={index} className="chat-searchbar-result" onClick={() => handleResultClick(msg.messageNum)}>
                            <div className="chat-searchbar-result-name">{msg.memberNickname}: </div>
                            <div className="chat-searchbar-result-content">
                                {highlightText(msg.chatContent, searchTerm)}
                            </div>
                            <div className="chat-searchbar-result-time">{formatTime(msg.chatTime)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatSearchBar;
