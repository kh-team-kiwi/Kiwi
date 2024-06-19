import React, { useState } from 'react';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMemberList from '../components/chat/ChatMemberList';
import ChatHeader from '../components/chat/ChatHeader';
import ChatTextBar from '../components/chat/ChatTextBar';
import ChatRoom from '../components/chat/chatcontent/ChatRoom';
import '../styles/pages/Page.css';
import '../styles/pages/Chat.css';
import "../components/chat/chatcontent/ChatRoom";

const Chat = () => {
    const [selectedChatNum, setSelectedChatNum] = useState(null);

    const handleChatSelect = (chatNum) => {
        setSelectedChatNum(chatNum);
    };

    return (
        <>
            <ChatSidebar onChatSelect={handleChatSelect} />
            <div className='content-container-chat'>
                <ChatHeader />
                {selectedChatNum ? (
                    <ChatRoom chatNum={selectedChatNum} />
                ) : (
                    <ChatTextBar />
                )}
            </div>
            <ChatMemberList />
        </>
    );
};

export default Chat;
