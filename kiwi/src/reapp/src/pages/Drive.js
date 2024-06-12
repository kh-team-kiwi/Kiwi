import React, { useState } from 'react';
import DriveSidebar from '../components/drive/DriveSidebar';
import '../styles/pages/Page.css';
import '../styles/pages/Drive.css';
import DriveFileList from '../components/drive/DriveContent/DriveFileList';

const Drive = () => {
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [selectedDriveName, setSelectedDriveName] = useState('');
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFolderName, setSelectedFolderName] = useState('');

    const handleViewDrive = (driveCode, driveName) => {
        setSelectedDrive(driveCode);
        setSelectedDriveName(driveName);
        setSelectedFolder(null);
        setSelectedFolderName('');
    };

    const handleViewFolder = (folderCode, folderName) => {
        setSelectedFolder(folderCode);
        setSelectedFolderName(folderName);
    };

    const getBreadcrumb = () => {
        if (selectedFolder) {
            return `${selectedDriveName} > ${selectedFolderName}`;
        }
        return selectedDriveName;
    };

    return (
        <>
            <DriveSidebar onView={handleViewDrive} />
            <div className='content-container'>
                {selectedDrive && (
                    <div>
                        <h2>{getBreadcrumb()}</h2>
                        <DriveFileList
                            driveCode={selectedFolder || selectedDrive}
                            driveName={selectedFolder ? selectedFolderName : selectedDriveName}
                            onViewFolder={handleViewFolder}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default Drive;
