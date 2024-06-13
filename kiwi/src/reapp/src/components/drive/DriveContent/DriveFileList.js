import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './FileUpload';
import DriveFolder from './DriveFolder';

const DriveFileList = ({ driveCode, parentPath, driveName, onViewFolder }) => {
    const [items, setItems] = useState([]);
    const [editCode, setEditCode] = useState(null);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        fetchItems();
    }, [driveCode, parentPath]);

    const fetchItems = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/drive/${driveCode}/files`, {
                params: { parentPath }
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
            fetchItems(); // 파일 목록 갱신
        } catch (error) {
            console.error('Failed to delete item', error);
        }
    };

    const handleUpdateName = async (itemCode, isFolder) => {
        try {
            const url = isFolder
                ? `http://localhost:8080/api/drive/${driveCode}/folders/${itemCode}`
                : `http://localhost:8080/api/drive/${driveCode}/files/${itemCode}`;
            await axios.put(url, JSON.stringify({ newName }), {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: { parentPath }
            });
            setEditCode(null);
            setNewName('');
            fetchItems(); // 파일 목록 갱신
        } catch (error) {
            console.error('Failed to update item name', error);
        }
    };

    const handleEdit = (itemCode, currentName) => {
        setEditCode(itemCode);
        setNewName(currentName);
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

    return (
        <div>
            <h3>{driveName}</h3>
            <DriveFolder driveCode={driveCode} fetchFiles={fetchItems} parentPath={parentPath} />
            <FileUpload driveCode={driveCode} fetchFiles={fetchItems} parentPath={parentPath} />
            <ul>
                {items.map((item) => (
                    <li key={item.fileCode}>
                        {editCode === item.fileCode ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateName(item.fileCode, item.folder); }}>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                                <button type="submit">Save</button>
                                <button onClick={() => setEditCode(null)}>Cancel</button>
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
                                        <button onClick={() => onViewFolder(item.fileCode, item.fileName)}>View</button>
                                        <button onClick={() => handleEdit(item.fileCode, item.fileName)}>Rename</button>
                                        <button onClick={() => handleDelete(item.fileCode, item.isFolder)}>Delete</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(item.fileCode, item.fileName)}>Rename</button>
                                        <button onClick={() => handleDownload(item.fileCode, item.fileName)}>Download</button>
                                        <button onClick={() => handleDelete(item.fileCode, item.isFolder)}>Delete</button>
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
