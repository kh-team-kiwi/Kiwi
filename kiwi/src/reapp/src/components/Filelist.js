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

    const handleDownload = async (fileCode,fileName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/files/download/${fileCode}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // 파일명 설정
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading file: ', error);
            setMessage(`File download failed for ${fileCode}`);
        }
    };

    const handleDelete = async (fileCode) => {
        try {
            await axios.delete(`http://localhost:8080/api/files/delete/${fileCode}`);
            setMessage('File deletion successful.');

            // 파일 삭제 후 해당 파일을 제외한 새로운 파일 리스트 생성
            const updatedFiles = files.filter(file => file.fileCode !== fileCode);
            setFiles(updatedFiles);
        } catch (error) {
            setMessage('File deletion failed.');
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
                            <button onClick={() => handleDownload(file.fileCode,file.fileName)}>Download</button>
                            <button onClick={() => handleDelete(file.fileCode)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default FileList;
