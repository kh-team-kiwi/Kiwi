import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMemberList from '../components/chat/ChatMemberList';
import ChatHeader from '../components/chat/ChatHeader';
import ChatRoom from '../components/chat/chatcontent/ChatRoom';
import CreateChatModal from '../components/chat/chatsidebar/CreateChatModal';
import '../styles/pages/Page.css';
import '../styles/pages/Chat.css';
import { useParams } from "react-router-dom";

const Chat = () => {
        const { teamno } = useParams();
    const [selectedChatNum, setSelectedChatNum] = useState(null);
    const [selectedChatName, setSelectedChatName] = useState("");
    const [showCreateChatModal, setShowCreateChatModal] = useState(false);
    const [refreshChatList, setRefreshChatList] = useState(false);

    const handleApprovalLineSave = (line) => {
        setShowCreateChatModal(false);
    };

    const handleChatSelect = (chatNum, chatName) => {
        setSelectedChatNum(chatNum);
        setSelectedChatName(chatName);
    };

    const handleCreateChat = () => {
        setShowCreateChatModal(true);
    };

    const handleCloseModal = () => {
        setShowCreateChatModal(false);
    };

    const handleSaveModal = async (data) => {
        console.log("Saved Data: ", data);
        const newChat = {
            chatName: data.chatName,
            chatAdminMemberId: data.approvers[0].id,
            team: teamno,
            chatOpen: true,
            admins: data.admins,
            participants: data.participants
        };

        try {
            const response = await axios.post('/api/chat/createWithUsers', newChat);
            console.log('새 채팅방이 생성되었습니다:', response.data);
            setShowCreateChatModal(false);
            setRefreshChatList(prev => !prev); // Refresh chat list
        } catch (error) {
            console.error('채팅방 생성 중 오류 발생:', error);
        }
    };

    return (
        <>
            <ChatSidebar onChatSelect={handleChatSelect} team={teamno} refreshChatList={refreshChatList} />
            <div className='content-container-chat'>
                <ChatHeader chatName={selectedChatName} />
                <button type="button" className="document-button" onClick={handleCreateChat}>채팅방 생성</button>
                {selectedChatNum ? (
                    <ChatRoom chatNum={selectedChatNum} />
                ) : (
                    <div className='chat-placeholder'>
                        <p>Select a chat room to start messaging.</p>
                    </div>
                )}
            </div>
            <ChatMemberList chatNum={selectedChatNum} />
            {showCreateChatModal && (
                <CreateChatModal onSave={handleSaveModal} onClose={handleCloseModal} team={teamno} showCreateChatModal={showCreateChatModal} />
            )}
        </>
    );
};

export default Chat;
