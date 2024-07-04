import React from 'react';
import '../../../styles/components/chat/chatsidebar/LeaveChatModal.css';

const LeaveChatModal = ({ chatNum, onClose, onLeaveChat }) => {
    const handleLeave = () => {
        onLeaveChat(chatNum);
        onClose();
    };

    return (
        <div className="leave-chat-modal-overlay">
            <div className="leave-chat-modal-content">
                <h2>채팅방 나가기</h2>
                <p>정말로 이 채팅방을 나가시겠습니까?</p>
                <div className="leave-chat-modal-actions">
                    <button className="leave-chat-leave-button" onClick={handleLeave}>확인</button>
                    <button className="leave-chat-cancel-button" onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default LeaveChatModal;
