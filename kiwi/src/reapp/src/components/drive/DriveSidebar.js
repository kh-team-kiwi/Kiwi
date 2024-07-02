import React, { useState } from 'react';
import DriveList from './DriveList';
import CreateDriveModal from "./DriveContent/CreateDriveModal";

import PlusIcon from '../../images/svg/shapes/PlusIcon';


import '../../styles/components/drive/DriveSidebar.css'


const DriveSidebar = ({ onView, refresh, teamno, onDriveCreated }) => {
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
            <button className="drive-sidebar-create-button" onClick={handleOpenCreateDriveModal}>
                <PlusIcon className='drive-sidebar-plus-icon'/>
                Create Drive
            </button>
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
        </div>
    );
};

export default DriveSidebar;
