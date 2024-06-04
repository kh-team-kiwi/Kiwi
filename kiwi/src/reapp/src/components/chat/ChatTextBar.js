import React from 'react';
import TextEditor from '../common/TextEditor';
import '../../styles/components/chat/ChatTextBar.css';

const ChatTextBar = () => {
  return (
    <div className='chat-text-bar'>
        <TextEditor/>

    </div>
  );
};

export default ChatTextBar;