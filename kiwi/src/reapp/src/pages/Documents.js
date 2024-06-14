import React, { useState } from 'react';
import Sidebar from '../components/documents/DocumentSidebar';
import DocumentList from '../components/documents/DocumentList';
import NewDocument from '../components/documents/NewDocument';
import DocumentInProgress from '../components/documents/DocumentInProgress';
import DocumentCompleted from '../components/documents/DocumentCompleted';
import DocumentRejected from '../components/documents/DocumentRejected';
import MemberManagement from '../components/documents/MemberManagement';
import '../styles/pages/Documents.css';

const Documents = () => {
    const [view, setView] = useState('documentList');

    const handleMenuClick = (view) => {
        setView(view);
    };

    return (
        <>
            <Sidebar handleMenuClick={handleMenuClick} />
            <div className="content-container">
                {view === 'newDocument' && <NewDocument/>}
                {view === 'documentList' && <DocumentList/>}
                {view === 'documentInProgress' && <DocumentInProgress/>}
                {view === 'documentApproval' && <DocumentCompleted/>}
                {view === 'documentReject' && <DocumentRejected/>}
                {view === 'memberManagement' && <MemberManagement/>}
            </div>
        </>
    );
}

export default Documents;