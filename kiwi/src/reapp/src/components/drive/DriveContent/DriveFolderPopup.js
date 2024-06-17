import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/components/drive/DrivePopup.css';

const DrivePopup = ({ onClose, driveCode, fetchFiles, parentPath }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const adjustedParentPath = parentPath && !parentPath.endsWith('/') ? `${parentPath}/` : parentPath;
            await axios.post(`http://localhost:8080/api/drive/${driveCode}/folders/create`, {
                folderName,
                parentPath: adjustedParentPath || driveCode + '/'
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setFolderName('');
            fetchFiles(); // 폴더 생성 후 파일 목록 갱신
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
    };

    const closePopup = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    return (
        <>
            <button className="schedule-button" onClick={openPopup}>
                {/* Button Icon */}
                Folder Create
            </button>
            {isOpen && (
                <div className="popup-container">
                    <div className="popup-content" ref={popupRef}>
                        <div className="close-button" onClick={closePopup}>
                            {/* Close Button Icon */}
                        </div>
                        <div className='popup-title'>Create Event</div>
                        <form className="event-form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="folderName"
                                placeholder="Folder Name"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                            />
                            <button type="submit" className="create-button">Create</button>
                            <button type="button" className="cancel-button" onClick={closePopup}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default DrivePopup;
