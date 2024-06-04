import React from 'react';
import DriveSidebar from '../components/drive/DriveSidebar';
import '../styles/pages/Page.css';
import '../styles/pages/Drive.css';

const Drive = () => {
  return (
    <>
    <DriveSidebar />
    <div className='content-container'>
        <h1>Drive Page</h1>
    </div>
    </>
  );
};

export default Drive;