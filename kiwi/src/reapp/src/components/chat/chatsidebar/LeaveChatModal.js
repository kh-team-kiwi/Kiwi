import React from 'react';
import '../../../styles/components/chat/chatsidebar/LeaveChatModal.css';

const LeaveChatModal = ({ chatNum, onClose, onLeaveChat }) => {
    const handleLeave = () => {
        onLeaveChat(chatNum);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>채팅방 나가기</h2>
                <p>정말로 이 채팅방을 나가시겠습니까?</p>
                <div className="modalActions">
                    <button className="leave-button" onClick={handleLeave}>확인</button>
                    <button className="cancel-button" onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default LeaveChatModal;
