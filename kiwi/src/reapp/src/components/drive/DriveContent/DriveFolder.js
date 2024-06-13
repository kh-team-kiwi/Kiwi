import React, { useState } from 'react';
import axios from 'axios';

const DriveFolder = ({ driveCode, fetchFiles }) => {
    const [folderName, setFolderName] = useState('');

    const handleFolderNameChange = (e) => {
        setFolderName(e.target.value);
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/api/drive/${driveCode}/folders/create`, JSON.stringify({ folderName }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setFolderName('');
            fetchFiles(); // 폴더 생성 후 파일 목록 갱신
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
                placeholder="New Folder Name"
            />
            <button type="submit">Create Folder</button>
        </form>
    );
};

export default DriveFolder;
