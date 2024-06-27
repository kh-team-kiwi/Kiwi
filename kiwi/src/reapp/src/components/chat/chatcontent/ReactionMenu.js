import React from 'react';
import '../../../styles/components/chat/chatcontent/reactionMenu.css';

const ReactionMenu = ({ onClickReaction, isOwnMessage }) => {
    const reactions = [
        { emoji: '❌️', key: 'cross', show: isOwnMessage },  // X 표시 추가, 자신이 작성한 메시지일 때만 보이게 설정
        { emoji: '💬️', key: 'comment', show: true } // 댓글 표시 추가
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
