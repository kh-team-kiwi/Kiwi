import React, { useState, useEffect } from 'react';
import axios from 'axios';


const DriveList = ({ refresh }) => {
    const [drives, setDrives] = useState([]);

    useEffect(() => {
        fetchDrives();
    }, [refresh]);

    const fetchDrives = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/drive/list');
            setDrives(response.data);
        } catch (error) {
            console.error('Failed to fetch drives', error);
        }
    };

    const handleDelete = async (driveCode) => {
        try {
            await axios.delete(`http://localhost:8080/api/drive/${driveCode}`);
            fetchDrives(); // 리스트 갱신
        } catch (error) {
            console.error('Failed to delete drive', error);
        }
    };

    const handleUpdate = async (driveCode, newName) => {
        try {
            await axios.put(`http://localhost:8080/api/drive/${driveCode}`, { driveName: newName });
            fetchDrives(); // 리스트 갱신
        } catch (error) {
            console.error('Failed to update drive', error);
        }
    };
    const handleView = async () =>{

    };

    const [editDriveCode, setEditDriveCode] = useState(null);
    const [newName, setNewName] = useState('');

    const handleEdit = (driveCode, currentName) => {
        setEditDriveCode(driveCode);
        setNewName(currentName);
    };

    const handleEditSubmit = (e, driveCode) => {
        e.preventDefault();
        handleUpdate(driveCode, newName);
        setEditDriveCode(null);
        setNewName('');
    };

    return (
        <div>

            <h2>Drive List</h2>
            <ul>
                {drives.map((drive) => (
                    <li key={drive.driveCode}>
                        {editDriveCode === drive.driveCode ? (
                            <form onSubmit={(e) => handleEditSubmit(e, drive.driveCode)}>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                                <button type="submit">Save</button>
                                <button onClick={() => setEditDriveCode(null)}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                {drive.driveName}
                                <button onClick={() => handleEdit(drive.driveCode, drive.driveName)}>Edit</button>
                                <button onClick={() => handleDelete(drive.driveCode)}>Delete</button>
                                <button onClick={() => handleView(drive.driveCode)}>view</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>


        </div>
    );
};

export default DriveList;
