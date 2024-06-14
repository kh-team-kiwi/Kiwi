import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MemberForm from './MemberForm';
import '../../styles/pages/Documents.css';

const MemberManagement = () => {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get('/api/members/details');
            setMembers(response.data);
        } catch (error) {
            console.error("회원 정보를 불러오는데 실패하였습니다.", error);
        }
    };

    const handleSave = async (member) => {
        try {
            if (selectedMember) {
                await axios.put(`/api/members/details/${selectedMember.employeeNo}`, member);
            } else {
                await axios.post('/api/members/details', member);
            }
            fetchMembers();
            setSelectedMember(null);
        } catch (error) {
            console.error("회원 정보를 저장하는데 실패하였습니다.", error);
        }
    };

    const handleDelete = async (employeeNo) => {
        try {
            await axios.delete(`/api/members/details/${employeeNo}`);
            fetchMembers();
            setSelectedMember(null);
        } catch (error) {
            console.error("회원 정보를 삭제하는데 실패하였습니다.", error);
        }
    };

    const handleEdit = (member) => {
        setSelectedMember(member);
    };

    return (
        <div className="member-management">
            <div className="member-list">
                {members.map((member) => (
                    <div key={member.employeeNo} className="member-item">
                        <span>{member.name}</span>
                        <button onClick={() => handleEdit(member)}>수정</button>
                    </div>
                ))}
            </div>
            <MemberForm memberId={selectedMember ? selectedMember.employeeNo : null} />
        </div>
    );
};

export default MemberManagement;
