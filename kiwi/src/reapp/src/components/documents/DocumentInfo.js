import React from 'react';
import '../../styles/pages/Documents.css';

const DocumentInfo = ({ document }) => {
    if (!document) return <p>문서 정보가 없습니다.</p>;

    const { docTitle, docStatus, docDate, docCompletion, name } = document;

    console.log('Document Info Props:', document);

    return (
        <div className="document-info">
            <h2 className="document-title">{docTitle}</h2>
            <p className="document-status"><strong>Status:</strong> {docStatus}</p>
            <p className="document-date"><strong>Date:</strong> {docDate}</p>
            <p className="document-completion"><strong>Completion:</strong> {docCompletion || 'Not completed'}</p>
            <p className="document-author"><strong>Author:</strong> {name}</p>
        </div>
    );
};

export default DocumentInfo;
