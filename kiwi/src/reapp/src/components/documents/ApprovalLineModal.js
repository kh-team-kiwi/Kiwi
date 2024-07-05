import React, { useState, useEffect } from "react";
import '../../styles/components/documents/ApprovalLineModal.css';
import axiosHandler from "../../jwt/axiosHandler";
import { useParams } from 'react-router-dom';

const ApprovalLineModal = ({ onSave, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [approvers, setApprovers] = useState([]);
    const [references, setReferences] = useState([]);
    const { teamno } = useParams();

    useEffect(() => {
        if (teamno) {
            fetchMembers();
        }
    }, [teamno]);

    const fetchMembers = async () => {
        try {
            const response = await axiosHandler.get(`/api/members/details/team/${teamno}`);
            const fetchedMembers = response.data.map(member => ({
                id: member.memberId, // 유니크한 식별자 사용
                employeeNo: member.employeeNo, // 사원번호
                name: member.name,
                team: member.deptName, // 부서 이름을 팀으로 사용
                role: member.position // 직책을 역할로 사용
            }));
            setMembers(fetchedMembers);
        } catch (error) {
            console.error("멤버 목록을 가져오는데 실패했습니다.", error);
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
        onSave({
            approvers: approvers.map(approver => ({
                memberId: approver.id,
                employeeNo: approver.employeeNo,
                name: approver.name,
                position: approver.role
            })),
            references: references.map(reference => ({
                memberId: reference.id,
                employeeNo: reference.employeeNo,
                name: reference.name,
                position: reference.role
            }))
        });
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
            </div>
        </div>
    );
};

export default ApprovalLineModal;
