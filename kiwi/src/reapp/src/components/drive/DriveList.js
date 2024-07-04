import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionItem } from "../../jwt/storage";
import "../../styles/components/drive/DriveList.css";
import DriveDeletePopup from './DriveContent/DriveDeletePopup';

import OptionsIcon from '../../images/svg/buttons/OptionsIcon';
import EditIcon from '../../images/svg/buttons/EditIcon';
import DeleteIcon from '../../images/svg/buttons/DeleteIcon';
import ExitIcon from '../../images/svg/buttons/ExitIcon';
import CheckIcon from '../../images/svg/buttons/CheckIcon';
import SharedIcon from '../../images/svg/buttons/SharedIcon';
import DriveIcon from '../../images/svg/buttons/DriveIcon';
import axiosHandler from "../../jwt/axiosHandler";

const DriveList = ({ onView, refresh }) => {
    const { teamno } = useParams();
    const [drives, setDrives] = useState([]);
    const [editDriveCode, setEditDriveCode] = useState(null);
    const [newName, setNewName] = useState('');
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState('');
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [driveToDelete, setDriveToDelete] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedDrive, setSelectedDrive] = useState(null);

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        setProfile(storedProfile);
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
        try {
            const response = await axiosHandler.get(`http://localhost:8080/api/drive/list/${teamno}/${username}`);
            setDrives(response.data);
        } catch (error) {
            console.error('Failed to fetch drives', error);
        }
    };

    const handleUpdate = async (driveCode, newName) => {
        try {
            await axiosHandler.put(`http://localhost:8080/api/drive/${driveCode}`, { driveName: newName });
            fetchDrives();
        } catch (error) {
            console.error('Failed to update drive', error);
        }
    };

    const handleEdit = (e, driveCode, currentName) => {
        e.stopPropagation();
        setEditDriveCode(driveCode);
        setNewName(currentName);
        setOpenDropdown(null);
    };

    const handleEditSubmit = (e, driveCode) => {
        e.preventDefault();
        handleUpdate(driveCode, newName);
        setEditDriveCode(null);
        setNewName('');
    };

    const handleDeleteDrive = (e, drive) => {
        e.stopPropagation();
        setDriveToDelete(drive);
        setShowDeletePopup(true);
        setOpenDropdown(null);
    };

    const confirmDeleteDrive = async () => {
        if (driveToDelete) {
            try {
                await axiosHandler.delete(`http://localhost:8080/api/drive/${driveToDelete.driveCode}`);
                setShowDeletePopup(false);
                setDriveToDelete(null);
                fetchDrives();
            } catch (error) {
                console.error('Failed to delete drive', error);
            }
        }
    };

    const cancelDeleteDrive = () => {
        setShowDeletePopup(false);
        setDriveToDelete(null);
    };

    const toggleDropdown = (e, driveCode) => {
        e.stopPropagation();
        setOpenDropdown(openDropdown === driveCode ? null : driveCode);
    };

    const handleViewDrive = (driveCode, driveName) => {
        setSelectedDrive(driveCode);
        onView(driveCode, driveName);
    };

    return (
        <div>
            <div className='drive-list-shared-header'>
                <SharedIcon className='drive-list-shared-icon' />
                <div>
                    Shared Drive - {drives.length}
                </div>
            </div>
            <ul>
                {drives.map((drive) => (
                    <li
                        key={drive.driveCode}
                        onClick={() => handleViewDrive(drive.driveCode, drive.driveName)}
                    >
                        {editDriveCode === drive.driveCode ? (
                            <form className={`drive-list-item ${selectedDrive === drive.driveCode ? 'selected-drive' : ''}`} onSubmit={(e) => handleEditSubmit(e, drive.driveCode)}>
                                <div className='drive-list-edit-container'>
                                    <input className='drive-list-edit-input'
                                           type="text"
                                           value={newName}
                                           onChange={(e) => setNewName(e.target.value)}
                                    />
                                    <button className='drive-list-save-button' type="submit">
                                        <CheckIcon className='drive-list-check-icon' />
                                    </button>
                                </div>
                                <div className='drive-list-exit-button' onClick={(e) => { e.stopPropagation(); setEditDriveCode(null); }}>
                                    <ExitIcon />
                                </div>
                            </form>
                        ) : (
                            <div className={`drive-list-item ${selectedDrive === drive.driveCode ? 'selected-drive' : ''}`}>
                                <div className='drive-list-item-name'>
                                    <DriveIcon className='drive-list-drive-icon'/>
                                    {drive.driveName}
                                </div>
                                <div className='drive-list-options-container' onClick={(e) => toggleDropdown(e, drive.driveCode)}>
                                    <OptionsIcon className='drive-list-options-icon'/>
                                </div>
                                {openDropdown === drive.driveCode && (
                                    <div className="drive-list-options">
                                        <button onClick={(e) => handleEdit(e, drive.driveCode, drive.driveName)}>
                                            <EditIcon className='drive-list-edit-icon' />
                                            <div className='drive-list-edit'>Edit</div>
                                        </button>
                                        <button onClick={(e) => handleDeleteDrive(e, drive)}>
                                            <DeleteIcon className='drive-list-delete-icon' />
                                            <div className='drive-list-delete-text'>Delete</div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {showDeletePopup && (
                <DriveDeletePopup
                    itemName={driveToDelete.driveName}
                    onDeleteConfirm={confirmDeleteDrive}
                    onCancel={cancelDeleteDrive}
                />
            )}
        </div>
    );
};

export default DriveList;
