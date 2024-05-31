import React, { useState } from 'react';
import axios from 'axios';
import Filelist from "./Filelist";

const FileManagement = () => {
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
            <Filelist/>
            <h2>File Management</h2>
            <div>
                <h3>Multi upload</h3>
                <input type="file" multiple onChange={handleFileChange}/>
                <div>
                    <p>Files selected: {selectedFiles.length}</p>
                    <ul>
                        {selectedFiles && Array.from(selectedFiles).map((file, index) => (
                            <li key={index}>{file.name}
                                <button onClick={() => handleRemoveFile(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button onClick={handleUpload}>Upload</button>
                <div>
                    <h3>Delete Forder</h3>
                    <input
                        type="text"
                        placeholder="Folder name to delete"
                        value={folderDeleteName}
                        onChange={(e) => setFolderDeleteName(e.target.value)}
                    />
                    <button onClick={handleDeleteFolder}>Delete Folder</button>
                </div>
                <p>{message}</p>
            </div>
            <div>
            <h3>Upload File</h3>
                <input type="file" onChange={onFileChange}/>
                <button onClick={onFileUpload}>Upload</button>
            </div>
            <div>
                <h3>Download File</h3>
                <input
                    type="text"
                    placeholder="File key to download"
                    value={downloadKey}
                    onChange={(e) => setDownloadKey(e.target.value)}
                />
                <button onClick={onFileDownload}>Download</button>
            </div>
            <div>
                <h3>Delete File</h3>
                <input
                    type="text"
                    placeholder="File key to delete"
                    value={deleteKey}
                    onChange={(e) => setDeleteKey(e.target.value)}
                />
                <button onClick={onFileDelete}>Delete</button>
            </div>
            <div>
                <h3>Rename File</h3>
                <input
                    type="text"
                    placeholder="Old file key"
                    value={oldKey}
                    onChange={(e) => setOldKey(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="New file key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                />
                <button onClick={onFileRename}>Rename</button>
            </div>
            <div>
                <h3>Create Folder</h3>
                <input
                    type="text"
                    placeholder="Folder name"
                    value={folderCreateName}
                    onChange={(e) => setFolderCreateName(e.target.value)}
                />
                <button onClick={onCreateFolder}>Create Folder</button>
            </div>
            <p>{message}</p>
        </div>
    );
};

export default FileManagement;