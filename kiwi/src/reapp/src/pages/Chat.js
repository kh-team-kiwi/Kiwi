import React from 'react';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMemberList from '../components/chat/ChatMemberList';
import ChatHeader from '../components/chat/ChatHeader';
import ChatTextBar from '../components/chat/ChatTextBar';
import '../styles/pages/Page.css';
import '../styles/pages/Chat.css';

const Chat = () => {
  return (
    <>
    <ChatSidebar />
    <div className='content-container-chat'>
      <ChatHeader />
      <ChatTextBar />
    </div>
    <ChatMemberList />

    </>
  );
};

export default Chat;