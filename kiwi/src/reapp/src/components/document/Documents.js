import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from './src/components/Sidebar';
import DocumentList from './src/components/DocumentList';
import NewDocument from './src/components/NewDocument';
import DocumentInProgress from './src/components/DocumentInProgress';
import DocumentApproval from './src/components/DocumentApproval';
import DocumentReject from './src/components/DocumentReject';
import './src/css/documents.css';


const Documents = () => {
    const [view, setView] = useState('documentList');

    const handleMenuClick = (view) => {
        setView(view);
    };

    return (
        <div className="appContainer">
            <Header />
            <div className="bodyContainer">
                <Sidebar handleMenuClick={handleMenuClick} />
                <div className="mainContent">
                    {view === 'documentList' && <DocumentList />}
                    {view === 'newDocument' && <NewDocument />}
                    {view === 'documentInProgress' && <DocumentInProgress />}
                    {view === 'documentApproval' && <DocumentApproval />}
                    {view === 'documentReject' && <DocumentReject />}
                </div>
            </div>
        </div>
    );
}

export default Documents;

