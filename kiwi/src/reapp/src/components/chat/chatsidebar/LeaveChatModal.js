import React from 'react';
import '../../../styles/components/chat/chatsidebar/LeaveChatModal.css';
import { useTranslation } from 'react-i18next'; 

const LeaveChatModal = ({ chatNum, onClose, onLeaveChat }) => {
    const { t } = useTranslation(); 

    const handleLeave = () => {
        onLeaveChat(chatNum);
        onClose();
    };

    return (
        <div className="leave-chat-modal-overlay">
            <div className="leave-chat-modal-content">
                <div className='leave-chat-modal-warning'>{t('leave-chat-warning')}</div>
                <div className="leave-chat-modal-actions">
                    <button className="leave-chat-cancel-button" onClick={onClose}>{t('cancel')}</button>
                    <button className="leave-chat-leave-button" onClick={handleLeave}>{t('leave')}</button>
                </div>
            </div>
        </div>
    );
};

export default LeaveChatModal;
