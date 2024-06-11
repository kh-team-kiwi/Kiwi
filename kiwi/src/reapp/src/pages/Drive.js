import React, { useState } from 'react';
import DriveSidebar from '../components/drive/DriveSidebar';
import '../styles/pages/Page.css';
import '../styles/pages/Drive.css';
import DriveFileList from "../components/drive/DriveContent/DriveFileList";
import DriveList from "../components/drive/DriveList";

const Drive = () => {
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [selectedDriveName, setSelectedDriveName] = useState('');

    const handleViewDrive  = (driveCode, driveName) => {
        setSelectedDrive(driveCode);
        setSelectedDriveName(driveName);
    };


    return (
        <>
            <div className='content-container'>
                <h1>Drive Page</h1>
                <DriveSidebar onView={handleViewDrive }/>
                <DriveFileList driveCode={selectedDrive} driveName={selectedDriveName}/>
            </div>
        </>
    );
};

export default Drive;
