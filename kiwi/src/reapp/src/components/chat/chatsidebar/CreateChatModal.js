import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../../styles/components/chat/chatsidebar/CreateChatModal.css';
import { getSessionItem } from "../../../jwt/storage";

const CreateChatModal = ({ onSave, onClose, team, showCreateChatModal }) => {
    const [profile, setProfile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [chatName, setChatName] = useState("");
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [chatNameError, setChatNameError] = useState("");

    useEffect(() => {
        console.log("Profile loading");
        const storedProfile = getSessionItem("profile");
        setProfile(storedProfile);
        if (storedProfile) {
            console.log("Profile loaded", storedProfile);
            setAdmins([{ id: storedProfile.username, name: storedProfile.name, email: storedProfile.username, role: storedProfile.role }]);
        }
    }, []);

    useEffect(() => {
        if (profile && showCreateChatModal && team) {
            console.log("Modal opened. Fetching members for team:", team);
            fetchMembers();
        }
    }, [profile, showCreateChatModal, team]);

    const fetchMembers = async () => {
        try {
            console.log(`Requesting members from: http://localhost:8080/api/chat/user/members?team=${team}`);
            const response = await axios.get(`http://localhost:8080/api/chat/user/members?team=${team}`);
            console.log("Fetched members:", response.data);
            const fetchedMembers = response.data
                .filter(member => member.memberId !== profile.username) // 현재 사용자 제외
                .map(member => ({
                    id: member.memberId,
                    name: member.memberNickname,
                    email: member.memberId,
                    role: member.memberRole
                }));
            setMembers(fetchedMembers);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleChatNameChange = (event) => {
        setChatName(event.target.value);
        if (event.target.value.trim()) {
            setChatNameError(""); // 입력값이 있을 경우 오류 메시지 제거
        }
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

    const handleSave = () => {
        if (!profile) {
            console.error("No profile available");
            return;
        }

        // 채팅방 이름이 공백이거나 띄어쓰기만 있는지 확인
        if (!chatName.trim()) {
            setChatNameError("채팅방 이름을 입력하세요.");
            return;
        }

        const chatData = {
            chatName,
            approvers: admins,
            admins: admins.map(admin => admin.id),
            participants: participants.map(participant => participant.id),
            team,
            chatOpen: true
        };

        onSave(chatData);
        onClose();
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
                    {chatNameError && <div className="error-message">{chatNameError}</div>}
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
                                    member.email.includes(searchTerm)
                            )
                            .map((member) => (
                                <div
                                    key={member.id}
                                    className={`memberItem ${selectedMember === member ? "selected" : ""}`}
                                    onClick={() => handleMemberClick(member)}
                                >
                                    {member.name} ({member.email}:{member.role})
                                </div>
                            ))}
                    </div>
                    <div className="arrows">
                        <button onClick={handleAddAdmin}>→초대</button>
                    </div>
                    <div className="selectedLists">
                        <div className="adminsList">
                            <h3>초대 인원</h3>
                            {admins.map((admin) => (
                                <div key={admin.id}>
                                    {admin.name} ({admin.email}:{admin.role})
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
