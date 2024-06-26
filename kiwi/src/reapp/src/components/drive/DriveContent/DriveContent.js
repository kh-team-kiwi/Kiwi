import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FileUploadWithDropzone from './FileUploadWithDropzone';
import DriveFolderPopup from "./DriveFolderPopup";
import DriveDeletePopup from './DriveDeletePopup';
import { useParams } from "react-router-dom";

import '../../../styles/components/drive/DriveContent.css'

import ListIcon from '../../../images/svg/buttons/ListIcon'
import GridIcon from '../../../images/svg/buttons/GridIcon'

const DriveContent = ({ driveCode, driveName, parentPath, onViewFolder, onBack, breadcrumbs = [], onDeleteDrive }) => {
    const { teamno } = useParams();
    const [items, setItems] = useState([]);
    const [editFileCode, setEditFileCode] = useState(null);
    const [editFolderCode, setEditFolderCode] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [newFolderName, setNewFolderName] = useState('');
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const fileInputRef = useRef(null);
    const [viewMode, setViewMode] = useState('list'); // Default to list view
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchItems(parentPath);
    }, [teamno, driveCode, parentPath, breadcrumbs]);

    const fetchItems = async (path) => {
        const fullPath = path ? `${teamno}/drive/${path}` : `${teamno}/drive/${driveCode}`;
        console.log(`Fetching items for path: ${fullPath}`);
        try {
            const response = await axios.get(`http://localhost:8080/api/drive/${teamno}/${driveCode}/files`, {
                params: { parentPath: path }
            });
            console.log('Fetched items:', response.data);
            setItems(response.data);
        } catch (error) {
            console.error('Failed to fetch items', error);
        }
    };

    const handleDelete = async (itemCode, isFolder) => {
        const fullPath = parentPath || `${teamno}/drive/${driveCode}`;
        console.log(`Deleting item at path: ${fullPath}`);
        try {
            const url = isFolder
                ? `http://localhost:8080/api/drive/${teamno}/${driveCode}/folders/${itemCode}`
                : `http://localhost:8080/api/drive/${teamno}/${driveCode}/files/${itemCode}`;
            await axios.delete(url, { params: { parentPath: fullPath } });
            fetchItems(parentPath);
        } catch (error) {
            console.error('Failed to delete item', error);
        }
    };

    const handleUpdateFileName = async (itemCode) => {
        const fullPath = parentPath || `${teamno}/drive/${driveCode}`;
        console.log(`Updating file name at path: ${fullPath}`);
        try {
            await axios.put(`http://localhost:8080/api/drive/${teamno}/${driveCode}/files/${itemCode}`, JSON.stringify(newFileName), {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: { parentPath: fullPath }
            });
            setEditFileCode(null);
            setNewFileName('');
            fetchItems(parentPath);
        } catch (error) {
            console.error('Failed to update item name', error);
        }
    };

    const handleUpdateFolderName = async (itemCode) => {
        const fullPath = parentPath || `${teamno}/drive/${driveCode}`;
        console.log(`Updating folder name at path: ${fullPath}`);
        try {
            await axios.put(`http://localhost:8080/api/drive/${teamno}/${driveCode}/folders/${itemCode}`, JSON.stringify(newFolderName), {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: { parentPath: fullPath }
            });
            setEditFolderCode(null);
            setNewFolderName('');
            fetchItems(parentPath);
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
        const fullPath = parentPath || `${teamno}/drive/${driveCode}`;
        console.log(`Downloading file from path: ${fullPath}`);
        try {
            const response = await axios.get(`http://localhost:8080/api/drive/${teamno}/${driveCode}/files/${itemCode}/download`, {
                responseType: 'blob',
                params: { parentPath: fullPath }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', itemName);
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

        const fullPath = parentPath || `${teamno}/drive/${driveCode}`;
        console.log(`Uploading file to path: ${fullPath}`);

        const formData = new FormData();
        formData.append('files', file);
        formData.append('parentPath', fullPath);
        formData.append('teamNumber', teamno);

        try {
            await axios.post(`http://localhost:8080/api/drive/${driveCode}/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            fetchItems(parentPath);
        } catch (error) {
            console.error('Failed to upload file', error);
        }
    };

    const handleDeleteDrive = () => {
        setShowDeletePopup(true);
    };

    const confirmDeleteDrive = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/drive/${driveCode}`);
            setShowDeletePopup(false);
            onDeleteDrive(driveCode);
        } catch (error) {
            console.error('Failed to delete drive', error);
        }
    };

    const cancelDeleteDrive = () => {
        setShowDeletePopup(false);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredItems = items.filter(item => 
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='drive-content-container'>
            <div className='drive-content-header'>
                <div className='drive-content-path'>{breadcrumbs.map(b => b.name).join(' > ')}</div>
                <div className='drive-content-header-right'>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search files"
                        className='drive-content-search-input'
                    />
                    <div className='drive-content-view-option'>
                        <div 
                            className={`drive-content-list-view ${viewMode === 'list' ? 'active' : ''}`} 
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon />
                        </div>
                        <div 
                            className={`drive-content-grid-view ${viewMode === 'grid' ? 'active' : ''}`} 
                            onClick={() => setViewMode('grid')}
                        >
                            <GridIcon />
                        </div>
                    </div>
                    <DriveFolderPopup driveCode={driveCode} fetchFiles={() => fetchItems(parentPath)} parentPath={parentPath} teamNumber={teamno} />
                    <FileUploadWithDropzone driveCode={driveCode} fetchFiles={() => fetchItems(parentPath)} parentPath={parentPath} teamNumber={teamno} />
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                    />
                    <button onClick={() => fileInputRef.current.click()}>Upload</button>
                </div>
            </div>

            {breadcrumbs.length > 1 && (
                <button onClick={onBack}>뒤로</button>
            )}
            <div className={viewMode === 'list' ? 'list-view' : 'grid-view'}>
                {filteredItems.map((item) => (
                    <div key={item.fileCode} className='drive-item'>
                        {editFileCode === item.fileCode ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateFileName(item.fileCode); }}>
                                <input
                                    type="text"
                                    value={newFileName}
                                    onChange={(e) => setNewFileName(e.target.value)}
                                />
                                <button type="submit">저장</button>
                                <button onClick={() => setEditFileCode(null)}>취소</button>
                            </form>
                        ) : editFolderCode === item.fileCode ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateFolderName(item.fileCode); }}>
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                />
                                <button type="submit">저장</button>
                                <button onClick={() => setEditFolderCode(null)}>취소</button>
                            </form>
                        ) : (
                            <>
                                {item.folder ? (
                                    <strong>{item.fileName} (폴더)</strong>
                                ) : (
                                    <>{item.fileName}</>
                                )}
                                {item.folder ? (
                                    <>
                                        <button onClick={() => onViewFolder(item.filePath, item.fileName)}>보기</button>
                                        <button onClick={() => handleEdit(item.fileCode, item.fileName, true)}>이름 변경</button>
                                        <button onClick={() => handleDelete(item.fileCode, item.folder)}>삭제</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(item.fileCode, item.fileName, false)}>이름 변경</button>
                                        <button onClick={() => handleDownload(item.fileCode, item.fileName)}>다운로드</button>
                                        <button onClick={() => handleDelete(item.fileCode, item.folder)}>삭제</button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DriveContent;
