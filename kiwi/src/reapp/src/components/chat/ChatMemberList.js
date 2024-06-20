import React from 'react';
import '../../styles/components/chat/ChatMemberList.css';
import ChatUsers from './chatsidebar/ChatUsers';

const ChatMemberList = ({ chatNum }) => {
    return (
        <div className="chat-member-list-container">
            {chatNum ? <ChatUsers chatNum={chatNum} /> : <p>Select a chat room to see the members.</p>}
        </div>
    );
};

export default ChatMemberList;
