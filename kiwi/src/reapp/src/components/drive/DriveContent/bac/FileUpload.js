import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ driveCode, fetchFiles, parentPath }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFiles([...selectedFiles, ...event.target.files]);
    };

    const handleRemoveFile = (index) => {
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles.splice(index, 1);
        setSelectedFiles(newSelectedFiles);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            alert('Please select files to upload.');
            return;
        }
        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }
        formData.append('parentPath', parentPath || driveCode);

        try {
            await axios.post(`http://localhost:8080/api/drive/${driveCode}/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSelectedFiles([]);
            fetchFiles(); // 파일 목록 갱신
        } catch (error) {
            console.error('Failed to upload files', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleUpload}>
                <input type="file" multiple onChange={handleFileChange}/>
                <div>
                    <p>Files selected: {selectedFiles.length}</p>
                    <ul>
                        {selectedFiles && Array.from(selectedFiles).map((file, index) => (
                            <li key={index}>
                                {file.name}
                                <button type="button" onClick={() => handleRemoveFile(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit">Upload Files</button>
            </form>
        </div>
    );
};

export default FileUpload;
