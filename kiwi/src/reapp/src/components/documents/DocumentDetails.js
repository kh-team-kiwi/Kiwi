import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentDetails = ({ document, onClose }) => {
    const [docDetails, setDocDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocumentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/documents/details/${document.docNum}`);
                setDocDetails(response.data);
                setLoading(false);
            } catch (error) {
                setError('문서 세부 정보를 불러오는데 실패하였습니다.');
                setLoading(false);
            }
        };

        if (document.docNum) {
            fetchDocumentDetails();
        } else {
            setError('유효한 문서 번호가 제공되지 않았습니다.');
            setLoading(false);
        }
    }, [document.docNum]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!docDetails) return null;

    return (
        <div className="documentDetails">
            <button onClick={onClose}>닫기</button>
            <h2>{docDetails.docTitle}</h2>
            <p>Status: {docDetails.docStatus}</p>
            <p>Date: {docDetails.docDate}</p>
            <p>Completion: {docDetails.docCompletion || 'Not completed'}</p>
            <p>Author: {docDetails.name}</p>
            <p>Contents: {docDetails.docContents}</p>
        </div>
    );
};

export default DocumentDetails;
