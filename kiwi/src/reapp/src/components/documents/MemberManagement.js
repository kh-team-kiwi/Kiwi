
import React, { useState, useEffect } from 'react';
import MemberForm from './MemberForm';
import '../../styles/pages/Documents.css';

const MemberManagement = () => {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        // Fetch initial member data
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        // Fetch members from the API
        const response = await fetch('/api/members');
        const data = await response.json();
        setMembers(data);
    };

    const handleSave = async (member) => {
        if (selectedMember) {
            // Update member
            await fetch(`/api/members/${member.employeeNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(member)
            });
        } else {
            // Create new member
            await fetch('/api/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(member)
            });
        }
        fetchMembers();
        setSelectedMember(null);
    };

    const handleDelete = async (employeeNo) => {
        await fetch(`/api/members/${employeeNo}`, {
            method: 'DELETE'
        });
        fetchMembers();
        setSelectedMember(null);
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
            <MemberForm initialData={selectedMember} onSave={handleSave} onDelete={handleDelete} />
        </div>
    );
};

export default MemberManagement;