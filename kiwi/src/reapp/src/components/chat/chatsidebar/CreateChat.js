import React, { useState } from 'react';
import axios from 'axios';

const CreateChat = ({ selectedTeam }) => {
    const [chatName, setChatName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 관리자 멤버 정보
        const adminMember = { memberId: 'admin', memberNickname: 'Admin' };

        // 관리자 멤버가 존재하는지 확인하고, 존재하지 않으면 새로 생성
        try {
            await axios.get(`/api/member/${adminMember.memberId}`);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                await axios.post('/api/member', adminMember);
            } else {
                console.error('Error checking admin member:', error);
                return;
            }
        }

        // 새로운 채팅방 생성
        const newChat = { chatName, chatOpen: true, chatAdminMember: adminMember, team: selectedTeam };

        axios.post('/api/chat', newChat)
            .then(response => {
                console.log('Chat created successfully:', response.data);
                setChatName('');
            })
            .catch(error => {
                console.error('There was an error creating the chat!', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Chat Room</h2>
            <input
                type="text"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder="Chat Room Name"
                required
            />
            <button type="submit">Create</button>
        </form>
    );
};

export default CreateChat;
