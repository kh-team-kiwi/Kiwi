import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriveFileList = ({ driveCode, driveName }) => {
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, [driveCode]);

    useEffect(() => {
        // driveCode나 driveName이 변경되면 파일 목록을 다시 가져옴
        fetchFiles();
    }, [driveCode, driveName]);

    const fetchFiles = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/drive/${driveCode}/files`);
            setFiles(response.data);
        } catch (error) {
            console.error('Failed to fetch files', error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            alert('Please select files to upload.');
            return;
        }
        const formData = new FormData();
        Array.from(selectedFiles).forEach((file) => {
            formData.append('files', file);
        });
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
            <h3>Files in {driveName}</h3>
            <ul>
                {files.map((file) => (
                    <li key={file.fileCode}>
                        {file.fileName} ({file.filePath})
                    </li>
                ))}
            </ul>
            <form onSubmit={handleUpload}>
                <input type="file" multiple onChange={handleFileChange} />
                <button type="submit">Upload Files</button>
            </form>
        </div>
    );
};

export default DriveFileList;
