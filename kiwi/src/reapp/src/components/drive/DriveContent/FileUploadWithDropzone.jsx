import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import '../../../styles/components/drive/FileUploadWithDropzone.css';
import { useParams } from "react-router-dom";

const FileUploadWithDropzone = ({ driveCode, fetchFiles, parentPath }) => {
    const { teamno } = useParams();
    const [isDragging, setIsDragging] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const onDrop = async (acceptedFiles) => {
        setIsDragging(false);

        // const folderDetected = acceptedFiles.some(file => file.path && file.path.includes('/'));
        const folderDetected = acceptedFiles.some(file =>
            (file.webkitRelativePath && file.webkitRelativePath.includes('/')) ||
            (file.size === 0)
        );

        if (folderDetected) {
            setShowWarning(true);
            return;
        }

        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append('files', file);
        });
        formData.append('parentPath', parentPath);
        formData.append('teamNumber', teamno);

        try {
            await axios.post(`/api/drive/${driveCode}/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchFiles(); // 파일 업로드 후 파일 목록 갱신
        } catch (error) {
            console.error('Failed to upload files', error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        noClick: true, // 드래그 앤 드롭 영역 클릭 비활성화
        onDragEnter: () => setIsDragging(true),
        onDragLeave: () => setIsDragging(false),
    });

    useEffect(() => {
        const handleDragOver = (e) => {
            e.preventDefault();
            setIsDragging(true);
        };

        const handleDrop = () => {
            setIsDragging(false);
        };

        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, []);

    const handleCloseWarning = () => {
        setShowWarning(false);
    };

    return (
        <div className="upload-container">
            <div {...getRootProps({ className: `dropzone ${isDragging ? 'visible' : ''}` })}>
                <input {...getInputProps()} />
                {isDragging && (
                    <div className="dropzone-overlay">
                        <p>Drop the files here...</p>
                    </div>
                )}
            </div>
            {showWarning && (
                <div className="warning-popup">
                    <p>Folders cannot be uploaded. Please select files only.</p>
                    <button onClick={handleCloseWarning}>Close</button>
                </div>
            )}
        </div>
    );
};

export default FileUploadWithDropzone;
