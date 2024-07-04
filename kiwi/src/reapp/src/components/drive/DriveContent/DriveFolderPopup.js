import React, { useState, useRef, useEffect } from 'react';
import '../../../styles/components/drive/DriveFolderPopup.css';
import { useParams } from "react-router-dom";
import CreateFolderIcon from '../../../images/svg/buttons/CreateFolderIcon';
import axiosHandler from "../../../jwt/axiosHandler";

const DriveFolderPopup = ({ onClose, onCloseDropdown, driveCode, fetchFiles, parentPath }) => {
    const { teamno } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const adjustedParentPath = parentPath && !parentPath.endsWith('/') ? `${parentPath}/` : parentPath;
            await axiosHandler.post(`http://localhost:8080/api/drive/${driveCode}/folders/create`, {
                folderName,
                parentPath: adjustedParentPath || "",
                teamNumber: teamno
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setFolderName('');
            fetchFiles();
            closePopup();
        } catch (error) {
            console.error('Failed to create folder', error);
            closePopup();
        }
    };

    const popupRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closePopup();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const openPopup = () => {
        setIsOpen(true);
        if (onCloseDropdown) onCloseDropdown(); // Close the dropdown when opening the popup
    };

    const closePopup = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    return (
        <>
            <div className='drive-content-new-dropdown-item' onClick={openPopup}>
                <CreateFolderIcon className='drive-content-create-folder-icon'/>
                Create Folder
            </div>
            {isOpen && (
                <div className="drive-folder-popup-container">
                    <div className="drive-folder-popup-content" ref={popupRef}>
                        <div className="drive-folder-popup-close-button" onClick={closePopup}>
                        </div>
                        <div className='drive-folder-popup-title'>Create Folder</div>
                        <form className="drive-folder-popup-event-form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="folderName"
                                placeholder="Folder Name"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                            />
                            <div className='drive-folder-popup-bottom'>
                                <button type="button" className="drive-folder-popup-cancel-button" onClick={closePopup}>Cancel</button>
                                <button type="submit" className="drive-folder-popup-create-button">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default DriveFolderPopup;
