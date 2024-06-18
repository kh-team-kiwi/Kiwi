import React from 'react';
import '../../styles/components/documents/DocumentInfo.css';

const DocumentInfo = ({ document }) => {
    const { docTitle = '', docStatus = '', docDate = '', docCompletion = '', name = '' } = document || {};
    console.log('Document Info Props:', document);

    return (
        <div className="documentInfo">
            <h2>{docTitle}</h2>
            <p>Status: {docStatus}</p>
            <p>Date: {docDate}</p>
            <p>Completion: {docCompletion || 'Not completed'}</p>
            <p>Author: {name}</p>
        </div>
    );
};

export default DocumentInfo;
