import React from 'react';
import DriveList from './DriveList';

const DriveSidebar = ({ onView, refresh }) => {
    const handleViewFiles = (driveCode, driveName) => {
        onView(driveCode, driveName); // 선택된 드라이브 정보를 부모 컴포넌트로 전달
    };

    return (
        <div className='sidebar'>
            <DriveList onView={handleViewFiles} refresh={refresh} />
        </div>
    );
};

export default DriveSidebar;
