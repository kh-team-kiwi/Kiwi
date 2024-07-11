import React, { useState, useEffect } from "react";
import '../../../styles/components/chat/chatsidebar/InviteUserModal.css';
import { getSessionItem } from "../../../jwt/storage";
import axiosHandler from "../../../jwt/axiosHandler";
import ErrorImageHandler from "../../common/ErrorImageHandler";

import { toast } from 'react-toastify';


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
            // Fetch all team members
            const allMembersResponse = await axiosHandler.get(`/api/chat/user/members?team=${team}`);
            const allMembers = allMembersResponse.data;

            // Fetch current chat members
            const chatMembersResponse = await axiosHandler.get(`/api/chat/user/${chatNum}`);
            const chatMembers = chatMembersResponse.data;

            // Exclude members who are already in the chat
            const chatMemberIds = chatMembers.map(member => member.memberId);
            const filteredMembers = allMembers.filter(member => !chatMemberIds.includes(member.memberId) && member.memberId !== profile.username)
                .map(member => ({
                    id: member.memberId,
                    name: member.memberNickname,
                    email: member.memberId,
                    role: member.memberRole,
                    profilePic: member.memberFilepath // Assuming memberFilepath is the profile picture URL
                }));
            
            setMembers(filteredMembers);
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
        } else {
            toast.error('Please select a user to invite')
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
                <div className="invite-user-modal-title">Invite Users</div>
                <div className="invite-user-searchBox">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search name or email"
                    />
                </div>
                <div className="invite-user-container">
                    {members.length === 0 ? (
                        <div className="invite-user-no-members">No users to invite</div>
                    ) : (
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
                                        <img
                                            className='invite-user-profile-pic'
                                            src={member.profilePic || 'default_profile_image_url.jpg'}
                                            alt={member.name}
                                            onError={ErrorImageHandler}
                                        />
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
                    )}
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
