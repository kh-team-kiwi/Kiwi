import React, { useState } from 'react';
import DriveList from './DriveList';


const DriveSidebar = ({ onView }) => {


    const handleViewFiles = (driveCode, driveName) => {
        onView(driveCode, driveName); // 선택된 드라이브 정보를 부모 컴포넌트로 전달
    };

    return (
        <div className='sidebar'>
            <h2>Create Drive</h2>
            <DriveList  onView={handleViewFiles} />
        </div>
    );
};

export default DriveSidebar;
