import React from 'react';
import '../../../styles/components/chat/chatcontent/MessageDeletePopup.css';
import { useTranslation } from 'react-i18next'; 

const MessageDeletePopup = ({ messageContent, onDeleteConfirm, onCancel }) => {
    const { t } = useTranslation(); 

    return (
        <div className="popup-container">
            <div className="popup-content">
                <div className="message-delete-popup-title">{t('delete-message')}</div>
                <div className="popup-message">
                    <div className='message-delete-content'>
                        {messageContent}
                    </div>
                </div>
                <div className="popup-actions">
                    <button className="cancel-button" onClick={onCancel}>{t('cancel')}</button>
                    <button className="confirm-button" onClick={onDeleteConfirm}>{t('delete')}</button>
                </div>
            </div>
        </div>
    );
};

export default MessageDeletePopup;
