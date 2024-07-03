import React from 'react';
import '../../styles/components/chat/ChatSidebar.css';
import ChatList from "./chatsidebar/ChatList";

const ChatSidebar = ({ onChatSelect, team, refreshChatList, onCreateChat }) => {
    return (
        <div className="sidebar">
            <ChatList onChatSelect={onChatSelect} team={team} refreshChatList={refreshChatList} />
            <button type="button" className="create-chat-button" onClick={onCreateChat}>채팅방 생성</button>
        </div>
    );
};

export default ChatSidebar;
