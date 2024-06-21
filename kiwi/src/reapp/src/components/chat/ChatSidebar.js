import React from 'react';
import '../../styles/components/chat/ChatSidebar.css';
import ChatList from "./chatsidebar/ChatList";

const ChatSidebar = ({ onChatSelect, team }) => {
    return (
        <div className="sidebar">
            <ChatList onChatSelect={onChatSelect} team={team} />
        </div>
    );
};

export default ChatSidebar;
