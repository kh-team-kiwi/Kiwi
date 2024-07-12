import React from 'react';
import '../../styles/components/chat/ChatMemberList.css';
import ChatUsers from './chatsidebar/ChatUsers';
import { useTranslation } from 'react-i18next'; 

const ChatMemberList = ({ chatNum }) => {
    const { t } = useTranslation(); 

    return (
        <div className="chat-member-list-container">
            {chatNum ? <ChatUsers chatNum={chatNum} /> : <p>{t('select-chat-room')}</p>}
        </div>
    );
};

export default ChatMemberList;
