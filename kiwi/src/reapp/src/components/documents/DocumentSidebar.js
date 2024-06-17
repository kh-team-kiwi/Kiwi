import React from 'react';

const DocumentSidebar = ({ handleMenuClick }) => {
    return (
        <div className="sidebar">
            <button type='button' className="newDoc" onClick={() => handleMenuClick('newDocument')}>작성하기</button>
            <ul className="menu">
                <li onClick={() => handleMenuClick('documentList')}>전체</li>
                <li onClick={() => handleMenuClick('inProgress')}>진행</li>
                <li onClick={() => handleMenuClick('completed')}>완료</li>
                <li onClick={() => handleMenuClick('rejected')}>거절</li>
                <li onClick={() => handleMenuClick('memberManagement')}>인사정보 관리</li>
            </ul>
        </div>
    );
}

export default DocumentSidebar;