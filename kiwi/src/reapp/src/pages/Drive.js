import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionItem } from "../jwt/storage";
import { useTranslation } from 'react-i18next';

import DriveSidebar from '../components/drive/DriveSidebar';
import '../styles/pages/Page.css';
import '../styles/pages/Drive.css';
import DriveContent from '../components/drive/DriveContent/DriveContent';
import EmptyDriveIcon from '../images/emptydrive.png';
import axiosHandler from "../jwt/axiosHandler";
import PlusIcon from '../images/svg/shapes/PlusIcon';
import CreateDriveModal from "../components/drive/DriveContent/CreateDriveModal";

import { toast } from 'react-toastify';

import ToastNotification from '../components/common/ToastNotification';

const Drive = () => {
    const { teamno } = useParams();
    const { t } = useTranslation();
    const [drives, setDrives] = useState([]);
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [selectedDriveName, setSelectedDriveName] = useState('');
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFolderName, setSelectedFolderName] = useState('');
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [username, setUsername] = useState('');
    const [showCreateDriveModal, setShowCreateDriveModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        if (storedProfile && storedProfile.username) {
            setUsername(storedProfile.username);
        }
    }, []);

    useEffect(() => {
        if (teamno && username) {
            fetchDrives();
        }
    }, [refresh, teamno, username]);

    const fetchDrives = async () => {
        setLoading(true);
        try {
            const response = await axiosHandler.get(`/api/drive/list/${teamno}/${username}`);
            setDrives(response.data);
            if (response.data.length > 0) {
                handleViewDrive(response.data[0].driveCode, response.data[0].driveName);
            } else {
                setSelectedDrive(null);
                setSelectedDriveName('');
            }
        } catch (error) {
            console.error('Failed to fetch drives', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleOpenCreateDriveModal = () => {
        setShowCreateDriveModal(true);
    };

    const handleCloseCreateDriveModal = () => {
        setShowCreateDriveModal(false);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner">{t('loading')}</div>
            </div>
        );
    }

    return (
        <>
            {!loading && (
                <div className='drive-page'>
                    {drives.length > 0 && (
                        <DriveSidebar 
                            onView={handleViewDrive} 
                            refresh={refresh} 
                            teamno={teamno} 
                            onDriveCreated={handleDriveCreated}
                        />
                    )}
                    <div className={`content-container ${drives.length > 0 ? '' : 'full-width'}`}>
                        {drives.length > 0 ? (
                            <DriveContent
                                driveCode={selectedDrive}
                                parentPath={selectedFolder ? selectedFolder : selectedDrive}
                                driveName={selectedFolder ? selectedFolderName : selectedDriveName}
                                onViewFolder={handleViewFolder}
                                onBack={handleBack}
                                breadcrumbs={breadcrumbs}
                                onDeleteDrive={handleDriveDeleted}
                            />
                        ) : (
                            <div className="drive-empty-message">
                                <div className='drive-no-files-container'>
                                    <img src={EmptyDriveIcon} className='img-enable-darkmode drive-empty-icon'/>
                                    <div className="drive-empty-title">
                                        {t('no-drives')}
                                    </div>
                                    <div className="drive-empty-description">
                                        {t('no-drives-description')}
                                    </div>
                                    <button 
                                        className="drive-empty-create-button" 
                                        onClick={handleOpenCreateDriveModal}
                                    >
                                        <PlusIcon className='drive-empty-plus-icon'/>
                                        <div>{t('create-drive')}</div>
                                    </button>
                                </div>
                                {showCreateDriveModal && (
                                    <CreateDriveModal
                                        team={teamno}
                                        showCreateDriveModal={showCreateDriveModal}
                                        onSave={() => {
                                            handleDriveCreated();
                                            handleCloseCreateDriveModal();
                                        }}
                                        onClose={handleCloseCreateDriveModal}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Drive;
