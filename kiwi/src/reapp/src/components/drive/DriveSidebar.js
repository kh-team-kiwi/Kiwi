import React, { useState } from 'react';
import DriveList from './DriveList';
import CreateDriveModal from "./DriveContent/CreateDriveModal";
import PlusIcon from '../../images/svg/shapes/PlusIcon';
import { useTranslation } from 'react-i18next';

import '../../styles/components/drive/DriveSidebar.css';

const DriveSidebar = ({ onView, refresh, teamno, onDriveCreated }) => {
    const { t } = useTranslation();
    const [showCreateDriveModal, setShowCreateDriveModal] = useState(false);

    const handleViewFiles = (driveCode, driveName) => {
        onView(driveCode, driveName);
    };

    const handleOpenCreateDriveModal = () => {
        setShowCreateDriveModal(true);
    };

    const handleCloseCreateDriveModal = () => { 
        setShowCreateDriveModal(false);
    };

    return (
        <div className='sidebar'>
            {showCreateDriveModal && (
                <CreateDriveModal
                    team={teamno}
                    showCreateDriveModal={showCreateDriveModal}
                    onSave={() => {
                        onDriveCreated();
                        handleCloseCreateDriveModal();
                    }}
                    onClose={handleCloseCreateDriveModal}
                />
            )}
            <DriveList onView={handleViewFiles} refresh={refresh} />
            <button className="drive-sidebar-create-button" onClick={handleOpenCreateDriveModal}>
                <PlusIcon className='drive-sidebar-plus-icon'/>
                {t('create-drive')}
            </button>
        </div>
    );
};

export default DriveSidebar;
