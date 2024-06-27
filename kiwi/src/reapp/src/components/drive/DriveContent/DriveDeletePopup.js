import React from 'react';
import '../../../styles/components/drive/DriveDeletePopup.css';

const DriveDeletePopup = ({ itemName, onDeleteConfirm, onCancel }) => {
    return (
        <div className="popup-container">
            <div className="popup-content">
                <div className="popup-title">Delete Item</div>
                <div className="popup-message">
                    {itemName}삭제합니까?<br/>
                    이선택은 되돌릴수 없습니다.
                </div>
                <div className="popup-actions">
                    <button className="confirm-button" onClick={onDeleteConfirm}>Confirm</button>
                    <button className="cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DriveDeletePopup;
