import React, { useState, useEffect } from "react";

const ApprovalLineModal = ({ onSave, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [approvers, setApprovers] = useState([]);
    const [references, setReferences] = useState([]);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        const fetchedMembers = [
            { id: 1, name: "김성식", team: "로그인팀", role: "팀원" },
            { id: 2, name: "정청원", team: "전자결재", role: "팀원" },
            { id: 3, name: "이기풍", team: "드라이브", role: "팀원" },
            { id: 4, name: "구경모", team: "채팅", role: "팀원" },
        ];
        setMembers(fetchedMembers);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleMemberClick = (member) => {
        setSelectedMember(member);
    };

    const handleAddApprover = () => {
        if (selectedMember && !approvers.includes(selectedMember)) {
            setApprovers([...approvers, selectedMember]);
        }
    };

    const handleAddReference = () => {
        if (selectedMember && !references.includes(selectedMember)) {
            setReferences([...references, selectedMember]);
        }
    };

    const handleSave = () => {
        onSave({ approvers, references });
        onClose();
    };

    return (
        <div className="modal">
            <div className="modalContent">
                <h2>결재선 설정</h2>
                <div className="searchBox">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="이름, 아이디 또는 조직 검색"
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
                        <button onClick={handleAddApprover}>→</button>
                        <button onClick={handleAddReference}>→</button>
                    </div>
                    <div className="selectedLists">
                        <div className="approversList">
                            <h3>결재자</h3>
                            {approvers.map((approver) => (
                                <div key={approver.id}>
                                    {approver.name} ({approver.team}:{approver.role})
                                </div>
                            ))}
                        </div>
                        <div className="referencesList">
                            <h3>참조자</h3>
                            {references.map((reference) => (
                                <div key={reference.id}>
                                    {reference.name} ({reference.team}:{reference.role})
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="modalActions">
                    <button onClick={handleSave}>저장</button>
                    <button onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalLineModal;
