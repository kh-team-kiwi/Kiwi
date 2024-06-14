import React, { useState, useEffect } from 'react';

const ApprovalLineModal = ({ onSave, onClose }) => {
    const [members, setMembers] = useState([]);
    const [selectedApprovers, setSelectedApprovers] = useState([]);
    const [selectedReferences, setSelectedReferences] = useState([]);

    useEffect(() => {
        // Fetch the member list from the server or a static source
        const fetchMembers = async () => {
            const response = await fetch('/api/members');
            const data = await response.json();
            setMembers(data);
        };
        fetchMembers();
    }, []);

    const handleApproverSelect = (member) => {
        if (!selectedApprovers.includes(member)) {
            setSelectedApprovers([...selectedApprovers, member]);
        }
    };

    const handleReferenceSelect = (member) => {
        if (!selectedReferences.includes(member)) {
            setSelectedReferences([...selectedReferences, member]);
        }
    };

    const handleSave = () => {
        onSave({ approvers: selectedApprovers, references: selectedReferences });
    };

    return (
        <div className="approvalLineModal">
            <h2>결재선 설정</h2>
            <div className="modalSection">
                <h3>결재자 선택</h3>
                <div className="memberList">
                    {members.map((member) => (
                        <div key={member.id} onClick={() => handleApproverSelect(member)}>
                            {member.name}
                        </div>
                    ))}
                </div>
                <h3>참조자 선택</h3>
                <div className="memberList">
                    {members.map((member) => (
                        <div key={member.id} onClick={() => handleReferenceSelect(member)}>
                            {member.name}
                        </div>
                    ))}
                </div>
            </div>
            <div className="modalActions">
                <button onClick={handleSave}>저장</button>
                <button onClick={onClose}>취소</button>
            </div>
        </div>
    );
};

export default ApprovalLineModal;