import React, { useState } from 'react';
import '../../styles/components/chat/ChatSidebar.css';
import TeamSelector from "./chatsidebar/TeamSelector";
import CreateChat from "./chatsidebar/CreateChat";
import ChatList from "./chatsidebar/ChatList";

const ChatSidebar = ({ onChatSelect }) => {
    const [selectedTeam, setSelectedTeam] = useState('');

    const handleTeamSelect = (team) => {
        setSelectedTeam(team);
    };

    return (
        <div className="sidebar">
            <TeamSelector onTeamSelect={handleTeamSelect} />
            {selectedTeam ? (
                <>
                    <CreateChat selectedTeam={selectedTeam} />
                    <ChatList selectedTeam={selectedTeam} onChatSelect={onChatSelect} />
                </>
            ) : (
                <p>Please select a team to view or create chat rooms.</p>
            )}
        </div>
    );
};

export default ChatSidebar;
