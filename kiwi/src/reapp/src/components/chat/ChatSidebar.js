import React from 'react';
import '../../styles/components/chat/ChatSidebar.css';
import ChatList from "./chatsidebar/ChatList";

import PlusIcon from '../../images/svg/shapes/PlusIcon';
import { useTranslation } from 'react-i18next';



const ChatSidebar = ({ onChatSelect, team, refreshChatList, onCreateChat }) => {
    const { t } = useTranslation();

    return (
        <div className="sidebar">
            <ChatList onChatSelect={onChatSelect} team={team} refreshChatList={refreshChatList} />
            <button type="button" className="create-chat-button" onClick={onCreateChat}> <PlusIcon className='chat-create-plus-icon'/>{t('create-chat')}</button>
        </div>
    );
};

export default ChatSidebar;
