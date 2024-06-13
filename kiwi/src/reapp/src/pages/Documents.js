import React, { useState, useEffect } from 'react';
import Sidebar from '../components/documents/DocumentSidebar';
import DocumentList from '../components/documents/DocumentList';
import NewDocument from '../components/documents/NewDocument';
import DocumentInProgress from '../components/documents/DocumentInProgress';
import DocumentApproval from '../components/documents/DocumentApproval';
import DocumentReject from '../components/documents/DocumentReject';

import '../styles/pages/Documents.css';
import '../styles/pages/Page.css';


const Documents = () => {
    const [view, setView] = useState('documentList');

    const handleMenuClick = (view) => {
        setView(view);
    };

    return (
        <>
            <Sidebar handleMenuClick={handleMenuClick} />
            <div className="content-container">
                {view === 'documentList' && <DocumentList />}
                {view === 'newDocument' && <NewDocument />}
                {view === 'documentInProgress' && <DocumentInProgress />}
                {view === 'documentApproval' && <DocumentApproval />}
                {view === 'documentReject' && <DocumentReject />}
            </div>
        </>

    );
}

export default Documents;

