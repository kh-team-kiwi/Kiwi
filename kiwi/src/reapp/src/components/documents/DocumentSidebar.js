import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/components/documents/DocumentSidebar.css';

const DocumentSidebar = ({ handleMenuClick }) => {
    const [counts, setCounts] = useState({
        전체: 0,
        진행중: 0,
        완료: 0,
        반려: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await axios.get('/documents/count-by-status');
                setCounts(response.data);
            } catch (error) {
                console.error("문서 개수를 불러오는데 실패했습니다.", error);
            }
        };

        const fetchMembers = async () => {
            try {
                const response = await axios.get('/api/members/details');
                setMembers(response.data);
                setFilteredMembers(response.data);
            } catch (error) {
                console.error("회원 정보를 불러오는데 실패하였습니다.", error);
            }
        };

        fetchCounts();
        fetchMembers();
    }, []);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term) {
            const filtered = members.filter(member =>
                member.name.includes(term) || member.deptName.includes(term)
            );
            setFilteredMembers(filtered);
        } else {
            setFilteredMembers(members);
        }
    };

    return (
        <div className="sidebar documents-sidebar">
            <button type='button' className="newDoc document-btn" onClick={() => handleMenuClick('newDocument')}>작성하기</button>
            <ul className="menu">
                <li onClick={() => handleMenuClick('documentList')}>전체 <span className="count">{counts.전체}</span></li>
                <li onClick={() => handleMenuClick('documentInProgress')}>진행 <span className="count">{counts.진행중}</span></li>
                <li onClick={() => handleMenuClick('documentCompleted')}>완료 <span className="count">{counts.완료}</span></li>
                <li onClick={() => handleMenuClick('documentRejected')}>거절 <span className="count">{counts.반려}</span></li>
                <li onClick={() => handleMenuClick('memberManagement')}>인사정보 관리</li>
            </ul>
        </div>
    );
}

export default DocumentSidebar;
