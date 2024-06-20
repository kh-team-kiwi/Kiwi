import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../../styles/components/chat/chatsidebar/CreateChatModal.css';

const CreateChatModal = ({ onSave, onClose, team }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [chatName, setChatName] = useState("");
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        fetchMembers();
    }, [team]);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`/api/chat/users/members?team=${team}`);
            const fetchedMembers = response.data.map(member => ({
                id: member.memberId,
                name: member.memberNickname,
                team: member.team,
                role: member.memberRole
            }));
            setMembers(fetchedMembers);
        } catch (error) {
            console.error("멤버 목록을 가져오는데 실패했습니다.", error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleChatNameChange = (event) => {
        setChatName(event.target.value);
    };

    const handleMemberClick = (member) => {
        setSelectedMember(member);
    };

    const handleAddAdmin = () => {
        if (selectedMember && !admins.some(admin => admin.id === selectedMember.id)) {
            setAdmins([...admins, selectedMember]);
        }
    };

    const handleAddParticipant = () => {
        if (selectedMember && !participants.some(participant => participant.id === selectedMember.id)) {
            setParticipants([...participants, selectedMember]);
        }
    };

    const handleSave = async () => {
        const chatData = {
            chatName,
            chatAdminMemberId: admins.length > 0 ? admins[0].id : null,
            admins: admins.map(admin => admin.id),
            participants: participants.map(participant => participant.id),
            team,
            chatOpen: true
        };

        try {
            await axios.post('/api/chat/createWithUsers', chatData);
            onSave(chatData);
            onClose();
        } catch (error) {
            console.error("채팅방 생성에 실패했습니다.", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>채팅방 생성</h2>
                <div className="formGroup">
                    <label>채팅방 이름</label>
                    <input
                        type="text"
                        value={chatName}
                        onChange={handleChatNameChange}
                        placeholder="채팅방 이름을 입력하세요"
                    />
                </div>
                <div className="searchBox">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="닉네임 검색"
                    />
                </div>
                <div className="container">
                    <div className="memberList">
                        {members
                            .filter(
                                (member) =>
                                    member.name.includes(searchTerm) ||
                                    member.team.includes(searchTerm)
                            )
                            .map((member) => (
                                <div
                                    key={member.id}
                                    className={`memberItem ${
                                        selectedMember === member ? "selected" : ""
                                    }`}
                                    onClick={() => handleMemberClick(member)}
                                >
                                    {member.name} ({member.team}:{member.role})
                                </div>
                            ))}
                    </div>
                    <div className="arrows">
                        <button onClick={handleAddAdmin}>→ 관리자 추가</button>
                        <button onClick={handleAddParticipant}>→ 참여자 추가</button>
                    </div>
                    <div className="selectedLists">
                        <div className="adminsList">
                            <h3>관리자</h3>
                            {admins.map((admin) => (
                                <div key={admin.id}>
                                    {admin.name} ({admin.team}:{admin.role})
                                </div>
                            ))}
                        </div>
                        <div className="participantsList">
                            <h3>참여자</h3>
                            {participants.map((participant) => (
                                <div key={participant.id}>
                                    {participant.name} ({participant.team}:{participant.role})
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="modalActions">
                    <button className="create-chat-button" onClick={handleSave}>저장</button>
                    <button className="create-chat-button" onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default CreateChatModal;
