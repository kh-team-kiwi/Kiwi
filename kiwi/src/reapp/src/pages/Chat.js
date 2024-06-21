import React, { useState } from 'react';
import axios from 'axios';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMemberList from '../components/chat/ChatMemberList';
import ChatHeader from '../components/chat/ChatHeader';
import ChatRoom from '../components/chat/chatcontent/ChatRoom';
import CreateChatModal from '../components/chat/chatsidebar/CreateChatModal';
import '../styles/pages/Page.css';
import '../styles/pages/Chat.css';
import {useParams} from "react-router-dom";

const Chat = () => {
    khkhkh
    const [selectedChatNum, setSelectedChatNum] = useState(null);
    const [showCreateChatModal, setShowCreateChatModal] = useState(false);
    const [team, setTeam] = useState("your-team-id"); // 팀 ID를 설정
    머지 오류 테스트4
    const handleApprovalLineSave = (line) => {
        setShowCreateChatModal(false);
    };

    const handleChatSelect = (chatNum) => {
        setSelectedChatNum(chatNum);
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
            chatName: "새로운 채팅방", // 필요에 따라 입력받도록 수정
            chatAdminMemberId: data.approvers[0].id,
            team: team, // 실제 팀 ID를 설정
            chatOpen: true
        };

        try {
            const response = await axios.post('/api/chat', newChat);
            console.log('새 채팅방이 생성되었습니다:', response.data);
            setShowCreateChatModal(false);
            // 새로 생성된 채팅방으로 이동하거나 추가적인 작업 수행
        } catch (error) {
            console.error('채팅방 생성 중 오류 발생:', error);
        }
    };

    return (
        <>
            <ChatSidebar onChatSelect={handleChatSelect} />
            <div className='content-container-chat'>
                <ChatHeader />
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
                <CreateChatModal onSave={handleSaveModal} onClose={handleCloseModal} team={team} />
            )}
        </>
    );
};

export default Chat;
