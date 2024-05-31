import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

const FileList = forwardRef((props, ref) => {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/files/list');
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files: ', error);
            setMessage('Failed to fetch files');
        }
    };

    useImperativeHandle(ref, () => ({
        fetchFiles
    }));

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleDownload = async (filePath) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/files/download/${filePath}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filePath); // 파일명 설정
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading file: ', error);
            setMessage(`File download failed for ${filePath}`);
        }
    };

    const handleDelete = async (filePath) => {
        try {
            await axios.delete('http://localhost:8080/api/files/delete-multiple', {
                params: { keys: [filePath] },
            });
            setMessage(`File deleted: ${filePath}`);
            setFiles(files.filter(file => file.filePath !== filePath));
        } catch (error) {
            console.error('Error deleting file: ', error);
            setMessage('File deletion failed');
        }
    };

    return (
        <div>
            <h2>File List</h2>
            <p>{message}</p>
            <ul>
                {files.map((file) => (
                    <li key={file.fileCode}>
                        <div>
                            <span>{file.fileName}</span>
                            <span>{file.uploadTime}</span>
                        </div>
                        <div>
                            <button onClick={() => handleDownload(file.filePath)}>Download</button>
                            <button onClick={() => handleDelete(file.filePath)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default FileList;
