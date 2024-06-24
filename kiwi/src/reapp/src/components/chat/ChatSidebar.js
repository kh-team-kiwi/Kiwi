import React from 'react';
import '../../styles/components/chat/ChatSidebar.css';
import ChatList from "./chatsidebar/ChatList";

const ChatSidebar = ({ onChatSelect, team, refreshChatList }) => {
    return (
        <div className="sidebar">
            <ChatList onChatSelect={onChatSelect} team={team} refreshChatList={refreshChatList} />
        </div>
    );
};

export default ChatSidebar;
