import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './FileUpload';
import DriveFolder from './DriveFolder';

const DriveFileList = ({ driveCode, driveName, onViewFolder }) => {
    const [items, setItems] = useState([]);
    const [editFileCode, setEditFileCode] = useState(null);
    const [newFileName, setNewFileName] = useState('');

    useEffect(() => {
        fetchItems();
    }, [driveCode]);

    const fetchItems = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/drive/${driveCode}/files`);
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
            await axios.delete(url);
            fetchItems(); // 파일 목록 갱신
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
            });
            setEditFileCode(null);
            setNewFileName('');
            fetchItems(); // 파일 목록 갱신
        } catch (error) {
            console.error('Failed to update item name', error);
        }
    };

    const handleEdit = (itemCode, currentName) => {
        setEditFileCode(itemCode);
        setNewFileName(currentName);
    };

    const handleDownload = async (itemCode, itemName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/drive/${driveCode}/files/${itemCode}/download`, {
                responseType: 'blob',
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
            <DriveFolder driveCode={driveCode} fetchFiles={fetchItems} />
            <FileUpload driveCode={driveCode} fetchFiles={fetchItems} />
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
                        ) : (
                            <>
                                {item.folder ? (
                                    <strong>{item.fileName} (Folder)</strong>
                                ) : (
                                    <>{item.fileName} ({item.filePath})</>
                                )}
                                {item.folder ? (
                                    <button onClick={() => onViewFolder(item.fileCode, item.fileName)}>View</button>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(item.fileCode, item.fileName)}>Rename</button>
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
