import React, { useState } from 'react';
import DriveSidebar from '../components/drive/DriveSidebar';
import '../styles/pages/Page.css';
import '../styles/pages/Drive.css';
import DriveContent from '../components/drive/DriveContent/DriveContent';
import { useParams } from "react-router-dom";

const Drive = () => {
    const { teamno } = useParams();
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [selectedDriveName, setSelectedDriveName] = useState('');
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFolderName, setSelectedFolderName] = useState('');
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const handleViewDrive = (driveCode, driveName) => {
        setSelectedDrive(driveCode);
        setSelectedDriveName(driveName);
        setSelectedFolder(null);
        setSelectedFolderName('');
        setBreadcrumbs([{ name: driveName, path: driveCode }]);
    };

    const handleViewFolder = (folderPath, folderName) => {
        setSelectedFolder(folderPath);
        setSelectedFolderName(folderName);
        setBreadcrumbs(prev => [...prev, { name: folderName, path: folderPath }]);
    };

    const handleBack = () => {
        setBreadcrumbs(prev => prev.slice(0, -1));
        const newBreadcrumbs = breadcrumbs.slice(0, -1);
        if (newBreadcrumbs.length === 1) {
            setSelectedFolder(null);
            setSelectedFolderName('');
        } else {
            const lastBreadcrumb = newBreadcrumbs[newBreadcrumbs.length - 1];
            setSelectedFolder(lastBreadcrumb.path);
            setSelectedFolderName(lastBreadcrumb.name);
        }
    };

    const handleDriveCreated = () => { 
        setRefresh(!refresh);
    };

    const handleDriveDeleted = (driveCode) => {
        setRefresh(!refresh);
        if (selectedDrive === driveCode) {
            setSelectedDrive(null);
            setSelectedDriveName('');
            setBreadcrumbs([]);
        }
    };

    return (
        <>
            <DriveSidebar 
                onView={handleViewDrive} 
                refresh={refresh} 
                teamno={teamno} 
                onDriveCreated={handleDriveCreated}
            />
            <div className='content-container'>
                {selectedDrive && (
                    <DriveContent
                        driveCode={selectedDrive}
                        parentPath={selectedFolder ? selectedFolder : selectedDrive}
                        driveName={selectedFolder ? selectedFolderName : selectedDriveName}
                        onViewFolder={handleViewFolder}
                        onBack={handleBack}
                        breadcrumbs={breadcrumbs}
                        onDeleteDrive={handleDriveDeleted}
                    />
                )}
            </div>
        </>
    );
};

export default Drive;
