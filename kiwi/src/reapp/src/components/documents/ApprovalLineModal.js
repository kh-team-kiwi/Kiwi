import React, { useState, useEffect } from "react";
import axios from "axios";
// import '../../styles/components/documents/ApprovalLineModal.css';

const ApprovalLineModal = ({ onSave, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [approvers, setApprovers] = useState([]);
    const [references, setReferences] = useState([]);
    const [approvalLines, setApprovalLines] = useState([]);

    useEffect(() => {
        fetchMembers();
        fetchAllApprovalLines();
    }, []);

    const fetchMembers = async () => {
        try {
            // 백엔드 API 호출을 통해 멤버 목록을 가져옵니다.
            const response = await axios.get('/api/members/details');
            const fetchedMembers = response.data.map(member => ({
                id: member.employeeNo, // 유니크한 식별자 사용
                name: member.name,
                team: member.deptName, // 부서 이름을 팀으로 사용
                role: member.position // 직책을 역할로 사용
            }));
            setMembers(fetchedMembers);
        } catch (error) {
            console.error("멤버 목록을 가져오는데 실패했습니다.", error);
        }
    };

    const fetchAllApprovalLines = async () => {
        try {
            const response = await axios.get('/documents/all-approval-lines');
            setApprovalLines(response.data);
        } catch (error) {
            console.error("결재선 정보를 가져오는데 실패했습니다.", error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleMemberClick = (member) => {
        setSelectedMember(member);
    };

    const handleAddApprover = () => {
        if (selectedMember && !approvers.some(approver => approver.id === selectedMember.id)) {
            setApprovers([...approvers, selectedMember]);
        }
    };

    const handleAddReference = () => {
        if (selectedMember && !references.some(reference => reference.id === selectedMember.id)) {
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
                        placeholder="이름 또는 부서 검색"
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
                        <button onClick={handleAddApprover}>→ 결재자 추가</button>
                        <button onClick={handleAddReference}>→ 참조자 추가</button>
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
                    <button className={"document-button"} onClick={handleSave}>저장</button>
                    <button className={"document-button"} onClick={onClose}>취소</button>
                </div>

                {/* 모든 결재선 정보 표시 */}
                <div className="approvalLineList">
                    <h2>모든 결재선 정보</h2>
                    <ul>
                        {approvalLines.map(line => (
                            <li key={line.id}>
                                결재자: {line.approver} - 참조자: {line.reference}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ApprovalLineModal;
