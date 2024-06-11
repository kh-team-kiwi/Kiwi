import React, { useState } from 'react';
import axios from 'axios';

function MultiUpload({ onUploadSuccess }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [team, setTeam] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setSelectedFiles([...selectedFiles, ...event.target.files]);
    };

    const handleRemoveFile = (index) => {
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles.splice(index, 1);
        setSelectedFiles(newSelectedFiles);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }
        formData.append('team', team);

        try {
            await axios.post('http://localhost:8080/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Upload successful!');
            if (typeof onUploadSuccess === 'function') {
                onUploadSuccess(); // 업로드 성공 시 파일 목록을 갱신하는 함수를 호출
            }
        } catch (error) {
            console.error('Error uploading files: ', error);
            setMessage('Upload failed!');
        }
    };

    return (
        <div>
            <input type="file" multiple onChange={handleFileChange} />
            <input type="text" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Team" />
            <div>
                <p>Files selected: {selectedFiles.length}</p>
                <ul>
                    {selectedFiles && Array.from(selectedFiles).map((file, index) => (
                        <li key={index}>{file.name}<button onClick={() => handleRemoveFile(index)}>Remove</button></li>
                    ))}
                </ul>
            </div>
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
        </div>
    );
}

export default MultiUpload;
