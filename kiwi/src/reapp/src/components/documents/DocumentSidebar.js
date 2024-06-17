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

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await axios.get('/documents/count-by-status');
                setCounts(response.data);
            } catch (error) {
                console.error("문서 개수를 불러오는데 실패했습니다.", error);
            }
        };

        fetchCounts();
    }, []);
    return (
        <div className="sidebar">
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
