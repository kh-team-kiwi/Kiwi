import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../../styles/components/chat/chatsidebar/InviteUserModal.css';
import { getSessionItem } from "../../../jwt/storage";

const InviteUserModal = ({ onClose, team, chatNum, showInviteUserModal, onInvite }) => {
    const [profile, setProfile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        setProfile(storedProfile);
    }, []);

    useEffect(() => {
        if (profile && showInviteUserModal && team) {
            fetchMembers();
        }
    }, [profile, showInviteUserModal, team]);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/chat/user/members?team=${team}`);
            const fetchedMembers = response.data
                .filter(member => member.memberId !== profile.username)
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

    const handleMemberClick = (member) => {
        setSelectedMember(member);
    };

    const handleInvite = () => {
        if (selectedMember) {
            onInvite(selectedMember);
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>유저 초대</h2>
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
                    <div className="modalActions">
                        <button className="invite-button" onClick={handleInvite}>초대</button>
                        <button className="cancel-button" onClick={onClose}>취소</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteUserModal;
