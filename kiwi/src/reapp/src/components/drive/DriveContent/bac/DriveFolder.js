import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const DriveFolder = ({ driveCode, fetchFiles, parentPath }) => {
    const { t } = useTranslation();
    const [folderName, setFolderName] = useState('');

    const handleFolderNameChange = (e) => {
        setFolderName(e.target.value);
    };

    const handleCreateFolder = async (e) => {
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
            fetchFiles();
        } catch (error) {
            console.error('Failed to create folder', error);
        }
    };

    return (
        <form onSubmit={handleCreateFolder}>
            <input
                type="text"
                value={folderName}
                onChange={handleFolderNameChange}
                placeholder={t('new-folder-name')}
            />
            <button type="submit">{t('create-folder')}</button>
        </form>
    );
};

export default DriveFolder;
