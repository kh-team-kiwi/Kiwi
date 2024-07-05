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
import SearchIcon from '../../images/svg/buttons/SearchIcon';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // 경고 메시지 상태 추가

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
            if (response.data.length > 0) {
                handleViewDrive(response.data[0].driveCode, response.data[0].driveName);
            }
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
        if (newName.trim() === '') {
            setErrorMessage('드라이브 이름은 공백일 수 없습니다.'); // 경고 메시지 설정
            return;
        }
        setErrorMessage(''); // 경고 메시지 초기화
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

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const highlightText = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <span key={index} className='chat-list-highlight'>{part}</span> : part
        );
    };

    const filteredDrives = drives.filter(drive =>
        drive.driveName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="chat-list-search-container">
                <SearchIcon className="drive-list-search-icon" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search Drive"
                    className="chat-list-search-input"
                />
                {searchQuery && (
                    <button className="chat-list-clear-search-button" onClick={clearSearch}>
                        <ExitIcon />
                    </button>
                )}
            </div>
            <div className='drive-list-shared-header'>
                <SharedIcon className='drive-list-shared-icon' />
                <div>
                    Shared Drive - {filteredDrives.length}
                </div>
            </div>
            <ul>
                {filteredDrives.map((drive) => (
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
                                {errorMessage && <div className="error-message">{errorMessage}</div>} {/* 경고 메시지 표시 */}
                            </form>
                        ) : (
                            <div className={`drive-list-item ${selectedDrive === drive.driveCode ? 'selected-drive' : ''}`}>
                                <div className='drive-list-item-name'>
                                    <DriveIcon className='drive-list-drive-icon'/>
                                    <div>
                                        {highlightText(drive.driveName, searchQuery)}


                                    </div>
                                </div>
                                <div className='drive-list-options-container' onClick={(e) => toggleDropdown(e, drive.driveCode)}>
                                    ⋮
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
