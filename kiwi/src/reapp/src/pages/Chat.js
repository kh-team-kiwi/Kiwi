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
import { getSessionItem } from "../jwt/storage";
import axiosHandler from "../jwt/axiosHandler";

const Chat = () => {
    const { teamno } = useParams();
    const [selectedChatNum, setSelectedChatNum] = useState(null);
    const [selectedChatName, setSelectedChatName] = useState("");
    const [showCreateChatModal, setShowCreateChatModal] = useState(false);
    const [refreshChatList, setRefreshChatList] = useState(false);
    const [memberCount, setMemberCount] = useState(0);
    const [profile, setProfile] = useState(null);
    const [messages, setMessages] = useState([]); // 상태 추가

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        setProfile(storedProfile);
    }, []);

    const handleApprovalLineSave = (line) => {
        setShowCreateChatModal(false);
    };

    const handleChatSelect = async (chatNum, chatName) => {
        setSelectedChatNum(chatNum);
        setSelectedChatName(chatName);

        // Fetch member count
        try {
            const response = await axiosHandler.get(`http://localhost:8080/api/chat/user/${chatNum}`);
            setMemberCount(response.data.length);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
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
            const response = await axiosHandler.post('/api/chat/createWithUsers', newChat);
            console.log('새 채팅방이 생성되었습니다:', response.data);
            setShowCreateChatModal(false);
            setRefreshChatList(prev => !prev); // Refresh chat list
        } catch (error) {
            console.error('채팅방 생성 중 오류 발생:', error);
        }
    };

    const handleInvite = async (member) => {
        try {
            const response = await axiosHandler.post(`/api/chat/user/${selectedChatNum}/invite`, { memberId: member.id });
            console.log('사용자 초대 성공:', response.data);

            // 새 멤버 정보 가져오기
            const newMemberResponse = await axiosHandler.get(`http://localhost:8080/api/chat/user/${selectedChatNum}`);

            // 멤버 카운트 및 멤버 리스트 업데이트
            setMemberCount(newMemberResponse.data.length);
            setMessages(prevMessages => prevMessages.map(msg => ({
                ...msg,
                unreadCount: msg.unreadCount + 1
            })));

            // 채팅 멤버 리스트를 업데이트하도록 이벤트 발생
            window.dispatchEvent(new CustomEvent('chatMemberUpdate', { detail: newMemberResponse.data }));
        } catch (error) {
            console.error('사용자 초대 중 오류 발생:', error);
        }
    };


    const handleLeaveChat = async (chatNum) => {
        const memberId = profile?.username; // 프로필에서 로그인된 사용자의 ID를 가져옵니다.
        if (!memberId) {
            console.error('로그인된 사용자의 ID를 찾을 수 없습니다.');
            return;
        }
        try {
            const response = await axiosHandler.post(`/api/chat/user/${chatNum}/leave`, { memberId });
            console.log('채팅방 나가기 성공:', response.data);
            setSelectedChatNum(null); // 선택된 채팅방 초기화
            setSelectedChatName(""); // 선택된 채팅방 이름 초기화
            setRefreshChatList(prev => !prev); // 채팅방 목록 새로고침
        } catch (error) {
            console.error('채팅방 나가기 중 오류 발생:', error);
        }
    };

    return (
        <>
            <ChatSidebar onChatSelect={handleChatSelect} team={teamno} refreshChatList={refreshChatList} onCreateChat={handleCreateChat} />
            <div className='content-container-chat'>

                {selectedChatNum && (
                    <ChatHeader
                        chatName={selectedChatName}
                        team={teamno}
                        chatNum={selectedChatNum}
                        onInvite={handleInvite}
                        onLeaveChat={handleLeaveChat}
                        memberCount={memberCount}
                        setMemberCount={setMemberCount} // 상태 추가
                    />
                )}
                {!selectedChatNum && (
                    <button type="button" className="document-button" onClick={handleCreateChat}>채팅방 생성</button>
                )}
                {selectedChatNum ? (
                    <ChatRoom chatNum={selectedChatNum} messages={messages} setMessages={setMessages} /> // 상태 전달
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
