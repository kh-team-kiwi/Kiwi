import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/components/drive/DriveSidebar.css';
import DrivePopup from './Drivepopup';
import DriveList from "./DriveList";

const Sidebar = ({ onDriveCreated }) => {
    const [driveName, setDriveName] = useState('');
    const [team, setTeam] = useState('');
    const [message, setMessage] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [selectedDriveName, setSelectedDriveName] = useState('');

    const handleDriveCreated = () => {
        setRefresh(!refresh);
    };
    const handleViewFiles = (driveCode, driveName) => {
        setSelectedDrive(driveCode);
        setSelectedDriveName(driveName);
        // 여기에 선택된 드라이브의 파일을 보여주는 로직을 추가할 수 있습니다.
    };
    const onDriveSelected = (drive) => {
        // 여기에서 선택된 드라이브 정보를 부모 컴포넌트에서 사용할 수 있도록 처리
        console.log('Selected drive:', drive);
    };




    return (
        <div>
            <h2>Create Drive</h2>
            <br/><br/>
            {message && <p>{message}</p>}
            <DrivePopup onDriveCreated={handleDriveCreated}/>
            <DriveList refresh={refresh} onView={handleViewFiles}/>
        </div>
    );
};

export default Sidebar;