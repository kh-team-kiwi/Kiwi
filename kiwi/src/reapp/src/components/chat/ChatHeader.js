import React, { useState } from 'react';
import ChatSearchBar from './ChatSearchBar';
import InviteUserModal from './chatsidebar/InviteUserModal';
import LeaveChatModal from './chatsidebar/LeaveChatModal';
import '../../styles/components/chat/ChatHeader.css';

const ChatHeader = ({ chatName, team, chatNum, onInvite, onLeaveChat }) => {
    const [showInviteUserModal, setShowInviteUserModal] = useState(false);
    const [showLeaveChatModal, setShowLeaveChatModal] = useState(false);

    const handleInviteClick = () => {
        setShowInviteUserModal(true);
    };

    const handleCloseInviteModal = () => {
        setShowInviteUserModal(false);
    };

    const handleLeaveClick = () => {
        setShowLeaveChatModal(true);
    };

    const handleCloseLeaveModal = () => {
        setShowLeaveChatModal(false);
    };

    return (
        <div className='chat-header'>
            <div className='chat-header-left'>
                <div className='groupchat-name'>
                    {chatName || 'Chat name header'}
                </div>
            </div>
            <div className='chat-header-middle'>
                <div className='leave-chat' onClick={handleLeaveClick}>
                    채팅방 나가기
                </div>
            </div>
            <div className='chat-header-right'>
                <div className='member-invite' onClick={handleInviteClick}>
                    <svg className='icon-color' width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.5312 25C20.9817 25 22.3727 24.4238 23.3982 23.3982C24.4238 22.3727 25 20.9817 25 19.5312C25 18.0808 24.4238 16.6898 23.3982 15.6643C22.3727 14.6387 20.9817 14.0625 19.5312 14.0625C18.0808 14.0625 16.6898 14.6387 15.6643 15.6643C14.6387 16.6898 14.0625 18.0808 14.0625 19.5312C14.0625 20.9817 14.6387 22.3727 15.6643 23.3982C16.6898 24.4238 18.0808 25 19.5312 25ZM20.3125 17.1875V18.75H21.875C22.0822 18.75 22.2809 18.8323 22.4274 18.9788C22.5739 19.1253 22.6562 19.324 22.6562 19.5312C22.6562 19.7385 22.5739 19.9372 22.4274 20.0837C22.2809 20.2302 22.0822 20.3125 21.875 20.3125H20.3125V21.875C20.3125 22.0822 20.2302 22.2809 20.0837 22.4274C19.9372 22.5739 19.7385 22.6562 19.5312 22.6562C19.324 22.6562 19.1253 22.5739 18.9788 22.4274C18.8323 22.2809 18.75 22.0822 18.75 21.875V20.3125H17.1875C16.9803 20.3125 16.7816 20.2302 16.6351 20.0837C16.4886 19.9372 16.4062 19.7385 16.4062 19.5312C16.4062 19.324 16.4886 19.1253 16.6351 18.9788C16.7816 18.8323 16.9803 18.75 17.1875 18.75H18.75V17.1875C18.75 16.9803 18.8323 16.7816 18.9788 16.6351C19.1253 16.4886 19.324 16.4062 19.5312 16.4062C19.7385 16.4062 19.9372 16.4886 20.0837 16.6351C20.2302 16.7816 20.3125 16.9803 20.3125 17.1875ZM17.1875 7.8125C17.1875 9.0557 16.6936 10.248 15.8146 11.1271C14.9355 12.0061 13.7432 12.5 12.5 12.5C11.2568 12.5 10.0645 12.0061 9.18544 11.1271C8.30636 10.248 7.8125 9.0557 7.8125 7.8125C7.8125 6.5693 8.30636 5.37701 9.18544 4.49794C10.0645 3.61886 11.2568 3.125 12.5 3.125C13.7432 3.125 14.9355 3.61886 15.8146 4.49794C16.6936 5.37701 17.1875 6.5693 17.1875 7.8125Z"/>
                        <path d="M3.125 20.3125C3.125 21.875 4.6875 21.875 4.6875 21.875H12.9C12.6346 21.1221 12.4993 20.3295 12.5 19.5312C12.5 18.5265 12.7153 17.5334 13.1315 16.6189C13.5476 15.7044 14.1549 14.8897 14.9125 14.2297C14.1833 14.1203 13.3792 14.0646 12.5 14.0625C4.6875 14.0625 3.125 18.75 3.125 20.3125Z"/>
                    </svg>
                </div>

                <div className='member-count'>
                    <svg className='icon-color' width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.9375 21.875C10.9375 21.875 9.375 21.875 9.375 20.3125C9.375 18.75 10.9375 14.0625 17.1875 14.0625C23.4375 14.0625 25 18.75 25 20.3125C25 21.875 23.4375 21.875 23.4375 21.875H10.9375ZM17.1875 12.5C18.4307 12.5 19.623 12.0061 20.5021 11.1271C21.3811 10.248 21.875 9.0557 21.875 7.8125C21.875 6.5693 21.3811 5.37701 20.5021 4.49794C19.623 3.61886 18.4307 3.125 17.1875 3.125C15.9443 3.125 14.752 3.61886 13.8729 4.49794C12.9939 5.37701 12.5 6.5693 12.5 7.8125C12.5 9.0557 12.9939 10.248 13.8729 11.1271C14.752 12.0061 15.9443 12.5 17.1875 12.5ZM8.15 21.875C7.91848 21.3872 7.80296 20.8524 7.8125 20.3125C7.8125 18.1953 8.875 16.0156 10.8375 14.5C9.8581 14.1976 8.83746 14.0499 7.8125 14.0625C1.5625 14.0625 0 18.75 0 20.3125C0 21.875 1.5625 21.875 1.5625 21.875H8.15ZM7.03125 12.5C8.06725 12.5 9.06082 12.0884 9.79339 11.3559C10.5259 10.6233 10.9375 9.62975 10.9375 8.59375C10.9375 7.55775 10.5259 6.56418 9.79339 5.83161C9.06082 5.09905 8.06725 4.6875 7.03125 4.6875C5.99525 4.6875 5.00168 5.09905 4.26911 5.83161C3.53655 6.56418 3.125 7.55775 3.125 8.59375C3.125 9.62975 3.53655 10.6233 4.26911 11.3559C5.00168 12.0884 5.99525 12.5 7.03125 12.5Z" />
                    </svg>

                    <span>
                        5
                    </span>
                </div>

                <ChatSearchBar />
            </div>

            {showInviteUserModal && (
                <InviteUserModal
                    team={team}
                    chatNum={chatNum}
                    showInviteUserModal={showInviteUserModal}
                    onClose={handleCloseInviteModal}
                    onInvite={onInvite}
                />
            )}
            {showLeaveChatModal && (
                <LeaveChatModal
                    chatNum={chatNum}
                    onClose={handleCloseLeaveModal}
                    onLeaveChat={onLeaveChat}
                />
            )}
        </div>
    );
};

export default ChatHeader;