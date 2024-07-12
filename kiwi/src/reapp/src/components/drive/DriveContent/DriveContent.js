import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import FileUploadWithDropzone from './FileUploadWithDropzone';
import DriveFolderPopup from "./DriveFolderPopup";
import DriveDeletePopup from './DriveDeletePopup';
import EmptyFileIcon from '../../../images/emptyfile.png';
import '../../../styles/components/drive/DriveContent.css';
import ExitIcon from '../../../images/svg/buttons/ExitIcon';
import DownloadIcon from '../../../images/svg/buttons/DownloadIcon';
import EditIcon from '../../../images/svg/buttons/EditIcon';
import DeleteIcon from '../../../images/svg/buttons/DeleteIcon';
import CheckIcon from '../../../images/svg/buttons/CheckIcon';
import BackIcon from '../../../images/svg/buttons/BackIcon';
import RightArrowIcon from '../../../images/svg/shapes/ThinRightArrow';
import PlusIcon from '../../../images/svg/shapes/PlusIcon';
import UploadFileIcon from '../../../images/svg/buttons/UploadFileIcon';
import ListIcon from '../../../images/svg/buttons/ListIcon';
import GridIcon from '../../../images/svg/buttons/GridIcon';
import FileIcon from './FileIcon';
import axiosHandler from "../../../jwt/axiosHandler";
import SearchIcon from '../../../images/svg/buttons/SearchIcon';

const DriveContent = ({ driveCode, driveName, parentPath, onViewFolder, onBack, breadcrumbs = [], onDeleteDrive }) => {
    const { teamno } = useParams();
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const [editFileCode, setEditFileCode] = useState(null);
    const [editFolderCode, setEditFolderCode] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [newFolderName, setNewFolderName] = useState('');
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const fileInputRef = useRef(null);
    const [viewMode, setViewMode] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'fileName', direction: 'ascending' });
    const [newDropdownVisible, setNewDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const toggleDropdown = () => {
        setNewDropdownVisible(!newDropdownVisible);
    };

    useEffect(() => {
        fetchItems(parentPath);
    }, [teamno, driveCode, parentPath, breadcrumbs]);

    useEffect(() => {
        if (!editFileCode && !editFolderCode) {
            setErrorMessage('');
        }
    }, [editFileCode, editFolderCode]);

    const fetchItems = async (path) => {
        const fullPath = path ? `${teamno}/drive/${path}` : `${teamno}/drive/${driveCode}`;
        setLoading(true);
        try {
            const response = await axiosHandler.get(`/api/drive/${teamno}/${driveCode}/files`, {
                params: { parentPath: path }
            });
            setItems(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch items', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (itemCode, isFolder) => {
        const fullPath = parentPath || `${teamno}/drive/${driveCode}`;
        try {
            const url = isFolder
                ? `/api/drive/${teamno}/${driveCode}/folders/${itemCode}`
                : `/api/drive/${teamno}/${driveCode}/files/${itemCode}`;
            await axiosHandler.delete(url, { params: { parentPath: fullPath } });
            fetchItems(parentPath);
        } catch (error) {
            console.error('Failed to delete item', error);
        }
    };

    const handleUpdateFileName = async (itemCode) => {
        if (newFileName.trim() === '') {
            setErrorMessage(t('no-whitespace'));
            return;
        }
        const fullPath = parentPath || `${teamno}/drive/${driveCode}`;
        try {
            await axiosHandler.put(`/api/drive/${teamno}/${driveCode}/files/${itemCode}`, JSON.stringify(newFileName), {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: { parentPath: fullPath }
            });
            setEditFileCode(null);
            setNewFileName('');
            setErrorMessage('');
            fetchItems(parentPath);
        } catch (error) {
            console.error('Failed to update item name', error);
        }
    };

    const handleUpdateFolderName = async (itemCode) => {
        if (newFolderName.trim() === '') {
            setErrorMessage(t('no-whitespace'));
            return;
        }
        const fullPath = parentPath || `${teamno}/drive/${driveCode}`;
        try {
            await axiosHandler.put(`/api/drive/${teamno}/${driveCode}/folders/${itemCode}`, JSON.stringify(newFolderName), {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: { parentPath: fullPath }
            });
            setEditFolderCode(null);
            setNewFolderName('');
            setErrorMessage('');
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
        try {
            const response = await axiosHandler.get(`/api/drive/${teamno}/${driveCode}/files/${itemCode}/download`, {
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

        const formData = new FormData();
        formData.append('files', file);
        formData.append('parentPath', fullPath);
        formData.append('teamNumber', teamno);

        try {
            await axiosHandler.post(`/api/drive/${driveCode}/files/upload`, formData, {
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
            await axiosHandler.delete(`/api/drive/${driveCode}`);
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

    const clearSearch = () => {
        setSearchQuery('');
    };

    const highlightText = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <span key={index} className='highlight'>{part}</span> : part
        );
    };

    const sortedItems = [...items].sort((a, b) => {
        const { key, direction } = sortConfig;
        let comparison = 0;

        if (key === 'fileName') {
            comparison = a.fileName.localeCompare(b.fileName);
        } else if (key === 'uploadTime') {
            comparison = new Date(a.uploadTime) - new Date(b.uploadTime);
        }

        return direction === 'ascending' ? comparison : -comparison;
    });

    const filteredItems = sortedItems.filter(item =>
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };

    const toggleOptionsMenu = (event, itemCode) => {
        event.stopPropagation();
        const menu = document.getElementById(`options-menu-${itemCode}`);
        if (menu) {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        }
    };

    return (
        <div className='drive-content-container'>
            <div className='drive-content-header'>
                <div className='drive-content-header-left'>
                    <div className='drive-content-new-dropdown'>
                        <div onClick={toggleDropdown} className='drive-content-new-dropdown-button'>
                            <PlusIcon className='drive-content-plus-icon' /> {t('new')}
                        </div>
                        {newDropdownVisible && (
                            <div className='drive-content-new-dropdown-menu'>
                                <div onClick={() => fileInputRef.current.click()} className='drive-content-new-dropdown-item'>
                                    <UploadFileIcon className='drive-content-upload-file-icon' /> {t('upload-file')}
                                </div>
                                <DriveFolderPopup
                                    driveCode={driveCode}
                                    fetchFiles={() => fetchItems(parentPath)}
                                    parentPath={parentPath}
                                    teamNumber={teamno}
                                    className='drive-content-new-dropdown-item'
                                />
                            </div>
                        )}
                    </div>
                    <div className='drive-content-path-container'>
                        {breadcrumbs.length > 1 && (
                            <div className='drive-content-back-button' onClick={onBack}><BackIcon className='drive-content-back-icon' /></div>
                        )}
                        <div className='drive-content-path'>
                            {breadcrumbs.map((b, index) => (
                                <span key={index} className='drive-content-breadcrumb-item'>
                                    {b.name}
                                    {index < breadcrumbs.length - 1 && <RightArrowIcon className='drive-content-arrow-icon' />}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='drive-content-header-right'>
                    {searchQuery && (
                        <span className='search-results-count'>{filteredItems.length} {t('results')}</span>
                    )}
                    <div className='drive-content-search-wrapper'>
                        <SearchIcon className="drive-content-search-icon" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder={t('search-files')}
                            className='drive-content-search-input'
                        />
                        {searchQuery && <button onClick={clearSearch} className='drive-clear-search-button'> <ExitIcon /> </button>}
                    </div>

                    <div className='drive-content-view-option'>
                        <div
                            className={`drive-content-list-view ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon className='drive-content-view-icon' />
                        </div>
                        <div
                            className={`drive-content-grid-view ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <GridIcon className='drive-content-view-icon' />
                        </div>

                        <input
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                        />
                    </div>
                </div>
            </div>

            <FileUploadWithDropzone driveCode={driveCode} fetchFiles={() => fetchItems(parentPath)} parentPath={parentPath} />

            {viewMode === 'list' ? (
                <div className='list-view'>
                    <div className='drive-content-list-header'>
                        <span className='column-header' onClick={() => handleSort('fileName')} style={{cursor: 'pointer'}}>
                            {t('file-name')} {sortConfig.key === 'fileName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </span>
                        <span className='column-header' onClick={() => handleSort('uploadTime')} style={{cursor: 'pointer'}}>
                            {t('upload-time')} {sortConfig.key === 'uploadTime' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </span>
                    </div>
                    {filteredItems.length === 0 ? (
                        <div className='img-enable-darkmode drive-content-no-files-container'>
                            <img src={EmptyFileIcon} className='drive-content-empty-icon'/>
                            <div className='drive-content-empty-title'>
                                {t('drag-and-drop')}
                            </div>
                            <div className='drive-content-empty-description'>
                                {t('drag-and-drop-description')}
                            </div>
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <div
                                key={item.fileCode}
                                className='drive-item'
                                onClick={item.folder ? () => onViewFolder(item.filePath, item.fileName) : undefined}
                                style={{ cursor: item.folder ? 'pointer' : 'default' }}
                            >
                                {editFileCode === item.fileCode ? (
                                    <form className='drive-content-item' onSubmit={(e) => { e.preventDefault(); handleUpdateFileName(item.fileCode); }}>
                                        <div className='drive-content-edit-container'>
                                            <input className='drive-content-edit-input'
                                                   type="text"
                                                   value={newFileName}
                                                   onChange={(e) => setNewFileName(e.target.value)}
                                            />
                                            <button className='drive-content-save-button' type="submit">
                                                <CheckIcon className='drive-content-check-icon' />
                                            </button>
                                        </div>
                                        <div className='drive-content-exit-button' onClick={() => { setEditFileCode(null); setErrorMessage(''); }}><ExitIcon /></div>
                                    </form>
                                ) : editFolderCode === item.fileCode ? (
                                    <form className='drive-content-item' onSubmit={(e) => { e.preventDefault(); handleUpdateFolderName(item.fileCode); e.stopPropagation(); }} onClick={(e) => e.stopPropagation()}>
                                        <div className='drive-content-edit-container'>
                                            <input className='drive-content-edit-input'
                                                   type="text"
                                                   value={newFolderName}
                                                   onChange={(e) => setNewFolderName(e.target.value)}
                                                   onClick={(e) => e.stopPropagation()}
                                            />
                                            <button className='drive-content-save-button' type="submit">
                                                <CheckIcon className='drive-content-check-icon' />
                                            </button>
                                        </div>
                                        <div className='drive-content-exit-button' onClick={(e) => { e.stopPropagation(); setEditFolderCode(null); setErrorMessage(''); }}><ExitIcon /></div>
                                    </form>
                                ) : (
                                    <>
                                        <div className='drive-item-details'>
                                            <span className='drive-content-file-name'>
                                                {item.folder ? (
                                                    <>
                                                        <FileIcon fileName={item.fileName} isFolder={true} viewMode={viewMode} />
                                                        <div>{highlightText(item.fileName, searchQuery)}</div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileIcon fileName={item.fileName} isFolder={false} viewMode={viewMode} />
                                                        <div>{highlightText(item.fileName, searchQuery)}</div>
                                                    </>
                                                )}
                                            </span>
                                            <span className='file-upload-time'>
                                                {new Date(item.uploadTime).toLocaleString('default', {
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        {item.folder ? (
                                            <div className='drive-item-right'>
                                                <div className='drive-content-icon-container' onClick={(e) => { e.stopPropagation(); handleEdit(item.fileCode, item.fileName, true); }}><EditIcon className='drive-content-icon' /></div>
                                                <div className='drive-content-icon-container' onClick={(e) => { e.stopPropagation(); handleDelete(item.fileCode, item.folder); }}><DeleteIcon className='drive-content-delete-icon' /></div>
                                            </div>
                                        ) : (
                                            <div className='drive-item-right'>
                                                <div className='drive-content-icon-container' onClick={(e) => { e.stopPropagation(); handleDownload(item.fileCode, item.fileName); }}><DownloadIcon className='drive-content-icon' /></div>
                                                <div className='drive-content-icon-container' onClick={(e) => { e.stopPropagation(); handleEdit(item.fileCode, item.fileName, false); }}><EditIcon className='drive-content-icon' /></div>
                                                <div className='drive-content-icon-container' onClick={(e) => { e.stopPropagation(); handleDelete(item.fileCode, item.folder); }}><DeleteIcon className='drive-content-delete-icon' /></div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className='grid-view'>
                    {filteredItems.length === 0 ? (
                        <div className='img-enable-darkmode drive-content-no-files-container'>
                            <img src={EmptyFileIcon} className='drive-content-empty-icon'/>
                            <div className='drive-content-empty-title'>
                                {t('drag-and-drop')}
                            </div>
                            <div className='drive-content-empty-description'>
                                {t('drag-and-drop-description')}
                            </div>
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <div
                                key={item.fileCode}
                                className='drive-grid-item'
                                onClick={item.folder ? () => onViewFolder(item.filePath, item.fileName) : undefined}
                                style={{ cursor: item.folder ? 'pointer' : 'default' }}
                            >
                                <div className='drive-grid-icon'>
                                    <FileIcon fileName={item.fileName} isFolder={item.folder} viewMode={viewMode} />
                                </div>
                                {editFileCode === item.fileCode ? (
                                    <form className='drive-grid-edit' onSubmit={(e) => { e.preventDefault(); handleUpdateFileName(item.fileCode); }}>
                                        <div className='drive-content-edit-container'>
                                            <input className='drive-content-edit-input'
                                                   type="text"
                                                   value={newFileName}
                                                   onChange={(e) => setNewFileName(e.target.value)}
                                            />
                                            <button className='drive-content-save-button' type="submit">
                                                <CheckIcon className='drive-content-check-icon' />
                                            </button>
                                        </div>
                                        <div className='drive-content-exit-button' onClick={() => { setEditFileCode(null); setErrorMessage(''); }}><ExitIcon /></div>
                                    </form>
                                ) : editFolderCode === item.fileCode ? (
                                    <form className='drive-grid-edit' onSubmit={(e) => { e.preventDefault(); handleUpdateFolderName(item.fileCode); e.stopPropagation(); }} onClick={(e) => e.stopPropagation()}>
                                        <div className='drive-content-edit-container'>
                                            <input className='drive-content-edit-input'
                                                   type="text"
                                                   value={newFolderName}
                                                   onChange={(e) => setNewFolderName(e.target.value)}
                                                   onClick={(e) => e.stopPropagation()}
                                            />
                                            <button className='drive-content-save-button' type="submit">
                                                <CheckIcon className='drive-content-check-icon' />
                                            </button>
                                        </div>
                                        <div className='drive-content-exit-button' onClick={(e) => { e.stopPropagation(); setEditFolderCode(null); setErrorMessage(''); }}><ExitIcon /></div>
                                    </form>
                                ) : (
                                    <div className='drive-grid-details'>
                                        <div className='drive-content-file-name'>
                                            <div>{highlightText(item.fileName, searchQuery)}</div>
                                        </div>
                                        <div className='drive-grid-options'>
                                            <button className='drive-options-button' onClick={(e) => toggleOptionsMenu(e, item.fileCode)}>⋮</button>
                                            <div className='options-menu' id={`options-menu-${item.fileCode}`}>
                                                <button className='drive-grid-options-dropdown' onClick={(e) => { e.stopPropagation(); handleDownload(item.fileCode, item.fileName); }}> <DownloadIcon className='drive-content-icon'/> {t('download')}</button>
                                                <button onClick={(e) => { e.stopPropagation(); handleEdit(item.fileCode, item.fileName, item.folder); }}> <EditIcon className='drive-content-icon'/> {t('edit')}</button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(item.fileCode, item.folder); }}> <DeleteIcon className='drive-content-delete-icon'/> {t('delete')}</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {showDeletePopup && (
                <DriveDeletePopup
                    itemName={driveName}
                    onDeleteConfirm={confirmDeleteDrive}
                    onCancel={cancelDeleteDrive}
                />
            )}
        </div>
    );
};

export default DriveContent;
