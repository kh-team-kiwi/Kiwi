import React, { useState } from 'react';
import Sidebar from '../components/documents/DocumentSidebar';
import DocumentList from '../components/documents/DocumentList';
import NewDocument from '../components/documents/NewDocument';
import DocumentInProgress from '../components/documents/DocumentInProgress';
import DocumentCompleted from '../components/documents/DocumentCompleted';
import DocumentRejected from '../components/documents/DocumentRejected';
import MemberManagement from '../components/documents/MemberManagement';
import DocumentDetails from '../components/documents/DocumentDetails';
import '../styles/pages/Documents.css';

const Documents = () => {
    const [view, setView] = useState('documentList');
    const [selectedDocument, setSelectedDocument] = useState(null);

    const handleMenuClick = (view) => {
        setView(view);
        setSelectedDocument(null);  // 메뉴 클릭 시 선택된 문서 초기화
    };

    const handleDocumentClick = (document) => {
        setSelectedDocument(document);
        setView('documentDetails');
    };

    return (
        <>
            <Sidebar handleMenuClick={handleMenuClick} />
            <div className="content-container">
                {view === 'newDocument' && <NewDocument />}
                {view === 'documentList' && <DocumentList onDocumentClick={handleDocumentClick} />}
                {view === 'documentInProgress' && <DocumentInProgress />}
                {view === 'documentApproval' && <DocumentCompleted />}
                {view === 'documentReject' && <DocumentRejected />}
                {view === 'memberManagement' && <MemberManagement />}
                {view === 'documentDetails' && selectedDocument && (
                    <DocumentDetails
                        document={selectedDocument}
                        onClose={() => setView('documentList')}
                    />
                )}
            </div>
        </>
    );
};

export default Documents;
