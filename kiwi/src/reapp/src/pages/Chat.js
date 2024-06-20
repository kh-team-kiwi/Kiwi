import React, { useState } from 'react';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMemberList from '../components/chat/ChatMemberList';
import ChatHeader from '../components/chat/ChatHeader';
import ChatRoom from '../components/chat/chatcontent/ChatRoom';
import '../styles/pages/Page.css';
import '../styles/pages/Chat.css';
import {useParams} from "react-router-dom";

const Chat = () => {
    const { team } = useParams();

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
                    <div className='chat-placeholder'>
                        <p>Select a chat room to start messaging.</p>
                    </div>
                )}
            </div>
            <ChatMemberList />
        </>
    );
};

export default Chat;
