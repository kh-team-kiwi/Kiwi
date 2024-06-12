import React, { useState } from 'react';
import DrivePopup from './DrivePopup';
import DriveList from './DriveList';

const DriveSidebar = ({ onView }) => {
    const [refresh, setRefresh] = useState(false);

    const handleDriveCreated = () => {
        setRefresh(!refresh);
    };

    const handleViewFiles = (driveCode, driveName) => {
        onView(driveCode, driveName); // 선택된 드라이브 정보를 부모 컴포넌트로 전달
    };

    return (
        <div>
            <h2>Create Drive</h2>
            <DrivePopup onDriveCreated={handleDriveCreated} />
            <DriveList refresh={refresh} onView={handleViewFiles} />
        </div>
    );
};

export default DriveSidebar;
