import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMemberList from '../components/chat/ChatMemberList';
import ChatHeader from '../components/chat/ChatHeader';
import ChatTextBar from '../components/chat/ChatTextBar';
import ChatRoom from '../components/chat/chatsidebar/ChatRoom';
import '../styles/pages/Page.css';
import '../styles/pages/Chat.css';

const Chat = () => {
    return (
        <>
            <ChatSidebar />
            <div className='content-container-chat'>
                <ChatHeader />
                <Routes>
                    <Route path="/" element={<ChatTextBar />} />
                    <Route path="/:chatNum" element={<ChatRoom />} />
                </Routes>
            </div>
            <ChatMemberList />
        </>
    );
};

export default Chat;