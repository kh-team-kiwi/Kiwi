import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/components/drive/CreateDriveModal.css';
import { getSessionItem } from "../../../jwt/storage";

const CreateDriveModal = ({ onSave, onClose, team, showCreateDriveModal }) => {
    const [profile, setProfile] = useState(null);
    const [driveName, setDriveName] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [nameError, setNameError] = useState(false);

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        setProfile(storedProfile);
        if (storedProfile) {
            setAdmins([{ id: storedProfile.username, name: storedProfile.name, email: storedProfile.username, role: storedProfile.role }]);
        }
    }, []);

    useEffect(() => {
        if (profile && showCreateDriveModal && team) {
            fetchMembers();
        }
    }, [profile, showCreateDriveModal, team]);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/chat/user/members?team=${team}`);
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
            console.error('Failed to fetch members:', error);
        }
    };

    const handleDriveNameChange = (event) => {
        const name = event.target.value;
        setDriveName(name);
        setNameError(!name.trim()); // 드라이브 이름이 공백이거나 띄어쓰기만 있을 때 에러 표시
    };

    const handleMemberClick = (member) => {
        setSelectedMember(member);
    };

    const handleAddAdmin = () => {
        if (selectedMember && !admins.some(admin => admin.id === selectedMember.id)) {
            setAdmins([...admins, selectedMember]);
            setMembers(members.filter(member => member.id !== selectedMember.id));
            setSelectedMember(null);
        }
    };

    const handleRemoveAdmin = (admin) => {
        if (admin.id === profile.username) {
            // 자기 자신은 제거하지 않음
            return;
        }
        setAdmins(admins.filter(a => a.id !== admin.id));
        setMembers([...members, admin]);
    };

    const handleSave = async () => {
        if (!profile || !driveName.trim()) {
            console.error('Invalid profile or drive name');
            return;
        }

        const driveData = {
            fileDriveDTO: {
                driveName,
                team
            },
            userIds: admins.map(admin => admin.id)
        };

        try {
            const response = await axios.post('http://localhost:8080/api/drive/create', driveData);
            onSave(response.data);
            onClose();
        } catch (error) {
            console.error('Failed to create drive', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>드라이브 생성</h2>
                <div className="formGroup">
                    <label>드라이브 이름</label>
                    <input
                        type="text"
                        value={driveName}
                        onChange={handleDriveNameChange}
                        placeholder="드라이브 이름을 입력하세요"
                    />
                    {nameError && <p className="error-text">드라이브 이름을 올바르게 입력하세요.</p>}
                </div>
                <div className="container">
                    <div className="memberList">
                        <h3>참여 가능한 멤버</h3>
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className={`memberItem ${selectedMember === member ? 'selected' : ''}`}
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
                            <h3>초대된 인원</h3>
                            {admins.map((admin) => (
                                <div
                                    key={admin.id}
                                    className="adminItem"
                                    onClick={() => handleRemoveAdmin(admin)}
                                >
                                    {admin.name} ({admin.email}:{admin.role}){admin.id === profile.username && " (자신)"}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="modalActions">
                    <button className="create-drive-button" onClick={handleSave} disabled={!driveName.trim()}>저장</button>
                    <button className="create-drive-button" onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default CreateDriveModal;
