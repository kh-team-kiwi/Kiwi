import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../../styles/components/chat/chatsidebar/InviteUserModal.css';
import { getSessionItem } from "../../../jwt/storage";

import ErrorImageHandler from "../../common/ErrorImageHandler";


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
                    role: member.memberRole,
                    profilePic: member.profilePic // Assuming profilePic is a part of the response
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

    const highlightText = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <span key={index} className="highlight">{part}</span> : part
        );
    };

    return (
        <div className="invite-user-modal-overlay">
            <div className="invite-user-modal-content">
                <h2>Invite Users</h2>
                <div className="invite-user-searchBox">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="닉네임 검색"
                    />
                </div>
                <div className="invite-user-container">
                    <div className="invite-user-member-list">
                        {members
                            .filter(
                                (member) =>
                                    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    member.email.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((member) => (
                                <div
                                    key={member.id}
                                    className={`invite-user-member-item ${selectedMember === member ? "selected" : ""}`}
                                    onClick={() => handleMemberClick(member)}
                                >
                                    <img className='invite-user-profile-pic' src={member.profilePic || ''} alt={member.name} onError={ErrorImageHandler} />
                                    <div className="invite-user-profile-info">
                                        <div className="invite-user-profile-name">
                                            {highlightText(member.name, searchTerm)}
                                        </div>
                                        <div className="invite-user-profile-email">
                                            {highlightText(member.email, searchTerm)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="invite-user-modal-actions">
                        <button className="invite-user-cancel-button" onClick={onClose}>Cancel</button>
                        <button className="invite-user-invite-button" onClick={handleInvite}>Invite</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteUserModal;
