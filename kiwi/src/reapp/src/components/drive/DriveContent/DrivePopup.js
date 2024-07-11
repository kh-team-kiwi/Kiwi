import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/components/drive/DrivePopup.css';

const DrivePopup = ({ onClose, onDriveCreated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [driveName, setDriveName] = useState('');
    const [team, setTeam] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/drive/create', { driveName, team });
            setMessage(JSON.stringify(response.data)); // 객체를 문자열로 변환
            if (onDriveCreated) {
                onDriveCreated(); // 드라이브 생성 후 갱신
            }
            closePopup();
        } catch (error) {
            setMessage('Failed to create drive');
            console.error(error);
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
                Drive Create
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
                                name="driveName"
                                placeholder="Drive Name"
                                value={driveName}
                                onChange={(e) => setDriveName(e.target.value)}
                            />
                            <input
                                type="text"
                                name="team"
                                placeholder="Team Name"
                                value={team}
                                onChange={(e) => setTeam(e.target.value)}
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
