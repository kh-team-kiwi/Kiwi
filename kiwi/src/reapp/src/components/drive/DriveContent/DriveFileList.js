import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FileUploadWithDropzone from './FileUploadWithDropzone';
import DriveFolderPopup from "./DriveFolderPopup";

const DriveFileList = ({ driveCode, parentPath, driveName, onViewFolder, onBack, breadcrumbs = [] }) => {
    const [items, setItems] = useState([]);
    const [editFileCode, setEditFileCode] = useState(null);
    const [editFolderCode, setEditFolderCode] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [newFolderName, setNewFolderName] = useState('');
    const fileInputRef = useRef(null); // useRef 훅을 사용하여 참조 생성

    useEffect(() => {
        fetchItems(parentPath);
    }, [driveCode, parentPath, breadcrumbs]);

    const fetchItems = async (path) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/drive/${driveCode}/files`, {
                params: { parentPath: path }
            });
            setItems(response.data);
        } catch (error) {
            console.error('Failed to fetch items', error);
        }
    };

    const handleDelete = async (itemCode, isFolder) => {
        try {
            const url = isFolder
                ? `http://localhost:8080/api/drive/${driveCode}/folders/${itemCode}`
                : `http://localhost:8080/api/drive/${driveCode}/files/${itemCode}`;
            await axios.delete(url, { params: { parentPath } });
            fetchItems(parentPath); // 파일 목록 갱신
        } catch (error) {
            console.error('Failed to delete item', error);
        }
    };

    const handleUpdateFileName = async (itemCode) => {
        try {
            await axios.put(`http://localhost:8080/api/drive/${driveCode}/files/${itemCode}`, JSON.stringify(newFileName), {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: { parentPath }
            });
            setEditFileCode(null);
            setNewFileName('');
            fetchItems(parentPath); // 파일 목록 갱신
        } catch (error) {
            console.error('Failed to update item name', error);
        }
    };

    const handleUpdateFolderName = async (itemCode) => {
        try {
            await axios.put(`http://localhost:8080/api/drive/${driveCode}/folders/${itemCode}`, JSON.stringify(newFolderName), {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: { parentPath }
            });
            setEditFolderCode(null);
            setNewFolderName('');
            fetchItems(parentPath); // 파일 목록 갱신
        } catch (error) {
            console.error('Failed to update folder name', error);
        }
    };

    const handleEdit = (itemCode, currentName, isFolder) => {
        if (isFolder) {
            setEditFolderCode(itemCode);
            setNewFolderName(currentName);
        } else {
            setEditFileCode(itemCode);
            setNewFileName(currentName);
        }
    };

    const handleDownload = async (itemCode, itemName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/drive/${driveCode}/files/${itemCode}/download`, {
                responseType: 'blob',
                params: { parentPath }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', itemName); // 파일 이름으로 다운로드
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download item', error);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('files', file);
        formData.append('parentPath', parentPath);

        try {
            await axios.post(`http://localhost:8080/api/drive/${driveCode}/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            fetchItems(parentPath); // 파일 목록 갱신
        } catch (error) {
            console.error('Failed to upload file', error);
        }
    };

    return (
        <div>
            <DriveFolderPopup driveCode={driveCode} fetchFiles={() => fetchItems(parentPath)} parentPath={parentPath}/>
            <FileUploadWithDropzone driveCode={driveCode} fetchFiles={() => fetchItems(parentPath)} parentPath={parentPath} />
            <input
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                ref={fileInputRef} // useRef 훅을 통해 생성된 참조 사용
            />
            <button onClick={() => fileInputRef.current.click()}>Upload File</button>
            <h1>{breadcrumbs.map(b => b.name).join(' > ')}</h1>
            {breadcrumbs.length > 1 && (
                <button onClick={onBack}>Back</button>
            )}
            <ul>
                {items.map((item) => (
                    <li key={item.fileCode}>
                        {editFileCode === item.fileCode ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateFileName(item.fileCode); }}>
                                <input
                                    type="text"
                                    value={newFileName}
                                    onChange={(e) => setNewFileName(e.target.value)}
                                />
                                <button type="submit">Save</button>
                                <button onClick={() => setEditFileCode(null)}>Cancel</button>
                            </form>
                        ) : editFolderCode === item.fileCode ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateFolderName(item.fileCode); }}>
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                />
                                <button type="submit">Save</button>
                                <button onClick={() => setEditFolderCode(null)}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                {item.folder ? (
                                    <strong>{item.fileName} (Folder)</strong>
                                ) : (
                                    <>{item.fileName} ({item.filePath})</>
                                )}
                                {item.folder ? (
                                    <>
                                        <button onClick={() => onViewFolder(item.filePath, item.fileName)}>View</button>
                                        <button onClick={() => handleEdit(item.fileCode, item.fileName, true)}>Rename</button>
                                        <button onClick={() => handleDelete(item.fileCode, item.folder)}>Delete</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(item.fileCode, item.fileName, false)}>Rename</button>
                                        <button onClick={() => handleDownload(item.fileCode, item.fileName)}>Download</button>
                                        <button onClick={() => handleDelete(item.fileCode, item.folder)}>Delete</button>
                                    </>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DriveFileList;
