import React, { useState, useEffect } from 'react';
import MemberForm from './MemberForm';
import '../../styles/components/documents/MemberManagement.css';
import axiosHandler from "../../jwt/axiosHandler";
import { useParams } from 'react-router-dom';

const MemberManagement = () => {
    const { teamno } = useParams();
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [message, setMessage] = useState(''); // 메시지를 관리할 상태 추가

    useEffect(() => {
        if (teamno) {
            fetchMembers();
        }
    }, [teamno]);

    const fetchMembers = async () => {
        try {
            const response = await axiosHandler.get(`/api/members/details/team/${teamno}`);
            setMembers(response.data);
            console.log("teamno : " +teamno);
        } catch (error) {
            console.error("회원 정보를 불러오는데 실패하였습니다.", error);
        }
    };

    const handleSave = async (member) => {
        try {
            if (selectedMember) {
                await axiosHandler.put(`/api/members/details/${member.employeeNo}`, member);
                setMessage('수정되었습니다.'); // 수정 메시지 설정
            } else {
                await axiosHandler.post('/api/members/details', member);
                setMessage('생성되었습니다.'); // 생성 메시지 설정
            }
            fetchMembers();
            setSelectedMember(null);
            setTimeout(() => setMessage(''), 3000); // 3초 후에 메시지 지우기
        } catch (error) {
            console.error("회원 정보를 저장하는데 실패하였습니다.", error);
        }
    };

    const handleDelete = async (employeeNo) => {
        try {
            await axiosHandler.delete(`/api/members/details/${employeeNo}`);
            fetchMembers();
            setSelectedMember(null);
            setMessage('삭제되었습니다.');
            setTimeout(() => setMessage(''), 3000); // 3초 후에 메시지 지우기
        } catch (error) {
            console.error("회원 정보를 삭제하는데 실패하였습니다.", error);
        }
    };

    const handleEdit = (member) => {
        setSelectedMember(member);
    };

    const filteredMembers = members.filter((member) =>
        member.name.includes(searchTerm) || member.deptName.includes(searchTerm)
    );

    return (
        <div className="member-management">
            <div className="member-list">
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="검색 (이름/부서)"
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {filteredMembers.map((member) => (
                    <div key={member.employeeNo} className="member-item">
                        <span>{member.name} {member.title} <small className="dept-name">({member.deptName})</small></span>
                        <button className="document-button" onClick={() => handleEdit(member)}>수정</button>
                    </div>
                ))}
            </div>
            <MemberForm
                selectedMember={selectedMember}
                onSave={handleSave}
                onDelete={handleDelete}
                teamno={teamno} // teamno 값을 MemberForm 컴포넌트로 전달
            />
            {message && <div className="message">{message}</div>} {/* 메시지를 화면에 표시 */}
        </div>
    );
};

export default MemberManagement;
