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
    const [employeeNo, setEmployeeNo] = useState('');

    useEffect(() => {
        const profile = JSON.parse(sessionStorage.getItem('profile'));
        if (profile && profile.username) {
            const username = profile.username;

            axios.get(`/api/members/details/${username}`)
                .then(response => {
                    if (response.data) {
                        setEmployeeNo(response.data.employeeNo);
                    } else {
                        console.error('사용자의 인사 정보를 찾을 수 없습니다.');
                    }
                })
                .catch(error => {
                    console.error('사용자의 인사 정보를 가져오는 중 오류가 발생했습니다.', error);
                });
        } else {
            console.error('로그인 정보가 없습니다.');
        }
    }, []);

    useEffect(() => {
        if (employeeNo) {
            const fetchCounts = async () => {
                try {
                    const response = await axios.get('/documents/all-documents');
                    const documents = response.data;

                    const authorizedDocs = documents.filter(doc =>
                        doc.approvalLines.some(line => line.employeeNo === employeeNo) ||
                        doc.references.some(ref => ref.employeeNo === employeeNo)
                    );

                    const countByStatus = {
                        전체: authorizedDocs.length,
                        진행중: authorizedDocs.filter(doc => doc.docStatus === '진행중').length,
                        완료: authorizedDocs.filter(doc => doc.docStatus === '완료').length,
                        반려: authorizedDocs.filter(doc => doc.docStatus === '반려').length
                    };

                    setCounts(countByStatus);
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
        }
    }, [employeeNo]);

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
