import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionItem } from "../jwt/storage";
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMemberList from '../components/chat/ChatMemberList';
import ChatHeader from '../components/chat/ChatHeader';
import ChatRoom from '../components/chat/chatcontent/ChatRoom';
import CreateChatModal from '../components/chat/chatsidebar/CreateChatModal';
import '../styles/pages/Page.css';
import '../styles/pages/Chat.css';
import EmptyChatIcon from '../images/emptychat.png';
import axiosHandler from "../jwt/axiosHandler";
import PlusIcon from '../images/svg/shapes/PlusIcon';

const Chat = () => {
    const { teamno } = useParams();
    const [selectedChatNum, setSelectedChatNum] = useState(null);
    const [selectedChatName, setSelectedChatName] = useState("");
    const [showCreateChatModal, setShowCreateChatModal] = useState(false);
    const [refreshChatList, setRefreshChatList] = useState(false);
    const [memberCount, setMemberCount] = useState(0);
    const [profile, setProfile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        setProfile(storedProfile);
    }, []);

    useEffect(() => {
        if (teamno && profile) {
            fetchChats();
        }
    }, [refreshChatList, teamno, profile]);

    const fetchChats = async () => {
        setLoading(true);
        try {
            const response = await axiosHandler.get(`/api/chat?team=${teamno}&memberId=${profile.username}`);
            setChats(response.data);
            if (response.data.length > 0) {
                handleChatSelect(response.data[0].chatNum, response.data[0].chatName);
            } else {
                setSelectedChatNum(null);
                setSelectedChatName('');
            }
        } catch (error) {
            console.error('Failed to fetch chats', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChatSelect = async (chatNum, chatName) => {
        setSelectedChatNum(chatNum);
        setSelectedChatName(chatName);
        try {
            const response = await axiosHandler.get(`/api/chat/user/${chatNum}`);
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
            setShowCreateChatModal(false);
            setRefreshChatList(prev => !prev);
        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    };

    const handleInvite = async (member) => {
        try {
            await axiosHandler.post(`/api/chat/user/${selectedChatNum}/invite`, { memberId: member.id });
            const newMemberResponse = await axiosHandler.get(`/api/chat/user/${selectedChatNum}`);
            setMemberCount(newMemberResponse.data.length);
            setMessages(prevMessages => prevMessages.map(msg => ({
                ...msg,
                unreadCount: msg.unreadCount + 1
            })));
            window.dispatchEvent(new CustomEvent('chatMemberUpdate', { detail: newMemberResponse.data }));
        } catch (error) {
            console.error('Error inviting user:', error);
        }
    };

    const handleLeaveChat = async (chatNum) => {
        const memberId = profile?.username;
        if (!memberId) {
            console.error('Unable to find logged-in user ID.');
            return;
        }
        try {
            await axiosHandler.post(`/api/chat/user/${chatNum}/leave`, { memberId });
            setSelectedChatNum(null);
            setSelectedChatName('');
            setRefreshChatList(prev => !prev);
        } catch (error) {
            console.error('Error leaving chat room:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    return (
        <>
            {chats.length > 0 && (
                <ChatSidebar onChatSelect={handleChatSelect} team={teamno} refreshChatList={refreshChatList} onCreateChat={handleCreateChat} />
            )}
            <div className={`content-container-chat ${chats.length > 0 ? '' : 'full-width'}`}>
                {chats.length > 0 ? (
                    <>
                        {selectedChatNum && (
                            <ChatHeader
                                chatName={selectedChatName}
                                team={teamno}
                                chatNum={selectedChatNum}
                                onInvite={handleInvite}
                                onLeaveChat={handleLeaveChat}
                                memberCount={memberCount}
                                setMemberCount={setMemberCount}
                            />
                        )}
                        {!selectedChatNum && (
                            <button type="button" className="document-button" onClick={handleCreateChat}>Create Chat Room</button>
                        )}

                            <ChatRoom chatNum={selectedChatNum} messages={messages} setMessages={setMessages} />

                    </>
                ) : (
                    <div className="chat-empty-message">
                        <div className='chat-no-chats-container'>
                            <img src={EmptyChatIcon} className='img-enable-darkmode chat-empty-icon'/>
                            <div className="chat-empty-title">
                                No Chats to show
                            </div>
                            <div className="chat-empty-description">
                                Click on the button below to create a new chat room
                            </div>
                            <button 
                                className="chat-empty-create-button" 
                                onClick={handleCreateChat}
                            >
                                <PlusIcon className='chat-empty-plus-icon'/>
                                <div>Create Chat</div>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {chats.length > 0 && (
            <ChatMemberList chatNum={selectedChatNum} />
        )}
            {showCreateChatModal && (
                <CreateChatModal onSave={handleSaveModal} onClose={handleCloseModal} team={teamno} showCreateChatModal={showCreateChatModal} />
            )}
        </>
    );
};

export default Chat;
