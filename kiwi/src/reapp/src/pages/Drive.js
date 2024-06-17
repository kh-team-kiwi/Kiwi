import React, { useState } from 'react';
import DriveSidebar from '../components/drive/DriveSidebar';
import '../styles/pages/Page.css';
import '../styles/pages/Drive.css';
import DriveFileList from '../components/drive/DriveContent/DriveFileList';
import DrivePopup from "../components/drive/DriveContent/DrivePopup";

const Drive = () => {
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

    const getBreadcrumb = () => {
        return breadcrumbs.map(b => b.name).join(' > ');
    };

    return (
        <>
            <DriveSidebar onView={handleViewDrive} refresh={refresh} />
            <div className='content-container'>
                <DrivePopup onDriveCreated={handleDriveCreated} />
                {selectedDrive && (
                    <div>
                        <h2>{getBreadcrumb()}</h2>
                        <DriveFileList
                            driveCode={selectedDrive}
                            parentPath={selectedFolder ? selectedFolder : selectedDrive}
                            driveName={selectedFolder ? selectedFolderName : selectedDriveName}
                            onViewFolder={handleViewFolder}
                            onBack={handleBack}
                            breadcrumbs={breadcrumbs}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default Drive;
