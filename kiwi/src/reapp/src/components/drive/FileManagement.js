import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Filelist from "./Filelist";
import MultiUpload from "./MultiUpload";


const FileManagement = () => {
    const fileListRef = useRef();

    const handleUploadSuccess = () => {
        if (fileListRef.current) {
            fileListRef.current.fetchFiles(); // 파일 목록을 갱신
        }
    };
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [downloadKey, setDownloadKey] = useState('');
    const [deleteKey, setDeleteKey] = useState('');
    const [oldKey, setOldKey] = useState('');
    const [newKey, setNewKey] = useState('');
    const [folderDeleteName, setFolderDeleteName] = useState('');
    const [folderCreateName, setFolderCreateName] = useState('');

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

        try {
            await axios.post('http://localhost:8080/api/files/multi-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Upload successful!');
        } catch (error) {
            console.error('Error uploading files: ', error);
            setMessage('Upload failed!');
        }
    };

    const handleDeleteFolder = async () => {
        try {
            await axios.delete('http://localhost:8080/api/files/delete-folder', {
                params: {
                    folderName: folderDeleteName
                }
            });
            setMessage('Folder deleted successfully!');
        } catch (error) {
            console.error('Error deleting folder: ', error);
            setMessage('Folder deletion failed!');
        }
    };
    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data);
        } catch (error) {
            setMessage('File upload failed.');
        }
    };

    const onFileDownload = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/files/download/${downloadKey}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', downloadKey); // 파일명 설정
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            setMessage('File download failed.');
        }
    };

    const onFileDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/files/delete/${deleteKey}`);
            setMessage(response.data);
        } catch (error) {
            setMessage('File deletion failed.');
        }
    };

    const onFileRename = async () => {
        try {
            const response = await axios.put('http://localhost:8080/api/files/rename', null, {
                params: {
                    oldKey: oldKey,
                    newKey: newKey
                }
            });
            setMessage(response.data);
        } catch (error) {
            setMessage('File rename failed.');
        }
    };

    const onCreateFolder = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/files/create-folder', null, {
                params: {
                    folderName: folderCreateName
                }
            });
            setMessage(response.data);
        } catch (error) {
            setMessage('Folder creation failed.');
        }
    };

    return (

        <div>
            <h3>filelist</h3>
            <Filelist ref={fileListRef}/>
            <h3>fileupload</h3>
            <MultiUpload onUploadSuccess={handleUploadSuccess}/>
            <h3>------------</h3>
        </div>
    );
};

export default FileManagement;