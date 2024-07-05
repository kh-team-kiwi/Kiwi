import React, { useState } from 'react';
import '../../../styles/components/chat/chatcontent/reactionMenu.css';

const ReactionMenu = ({ onClickReaction, isOwnMessage }) => {
    const reactions = [
        { emoji: '❌️', key: 'cross', show: isOwnMessage },  
        { emoji: '💬️', key: 'comment', show: true } 
    ];

    return (
        <div className="reaction-menu">
            <div className="reaction-menu-container">
                {reactions.map((reaction, index) => (
                    reaction.show && (
                        <button
                            key={index}
                            className="reaction-button"
                            onClick={() => onClickReaction(reaction.key)}
                        >
                            <span className="reaction-icon">{reaction.emoji}</span>
                        </button>
                    )
                ))}
            </div>
        </div>
    );
};

export default ReactionMenu;
