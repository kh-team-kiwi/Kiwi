import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../styles/components/drive/DriveDeletePopup.css';

const DriveDeletePopup = ({ itemName, onDeleteConfirm, onCancel }) => {
    const { t } = useTranslation();

    return (
        <div className="popup-container">
            <div className="popup-content">
                <div className="drive-delete-popup-message">
                    <div className='drive-delete-bold'>
                        {itemName} {t('will-be-deleted')}.
                    </div>
                    <div>
                        {t('cannot-be-undone')}.
                    </div>
                </div>
                <div className="popup-actions">
                    <button className="cancel-button" onClick={onCancel}>{t('cancel')}</button>
                    <button className="confirm-button" onClick={onDeleteConfirm}>{t('confirm')}</button>
                </div>
            </div>
        </div>
    );
};

export default DriveDeletePopup;
