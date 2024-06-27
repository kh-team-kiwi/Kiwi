import React from 'react';
import '../../../styles/components/chat/chatcontent/MessageDeletePopup.css';

const MessageDeletePopup = ({ messageContent, onDeleteConfirm, onCancel }) => {
    return (
        <div className="popup-container">
            <div className="popup-content">
                <div className="popup-title">메시지 삭제</div>
                <div className="popup-message">
                    {messageContent} 메시지를 삭제하시겠습니까?<br/>

                </div>
                <div className="popup-actions">
                    <button className="confirm-button" onClick={onDeleteConfirm}>확인</button>
                    <button className="cancel-button" onClick={onCancel}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default MessageDeletePopup;
