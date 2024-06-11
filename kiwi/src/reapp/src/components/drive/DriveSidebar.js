import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/components/drive/DriveSidebar.css';
import DrivePopup from './Drivepopup';
import DriveList from "./DriveList";

const Sidebar = ({ onDriveCreated }) => {
    const [refresh, setRefresh] = useState(false);

    const handleDriveCreated = () => {
        setRefresh(!refresh);
    };
    const [driveName, setDriveName] = useState('');
    const [team, setTeam] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/drive/create', { driveName, team });
            setMessage(JSON.stringify(response.data)); // 객체를 문자열로 변환
            if (onDriveCreated) {
                onDriveCreated(); // 새로운 드라이브가 생성되면 리스트를 갱신
            }
        } catch (error) {
            setMessage('Failed to create drive');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Create Drive</h2>
            <br/><br/>
            {message && <p>{message}</p>}
            <DrivePopup onDriveCreated={onDriveCreated}/>
            <DriveList refresh={refresh} />
        </div>
    );
};

export default Sidebar;