import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DocumentInfo from './DocumentInfo';
import '../../styles/pages/Documents.css';

const DocumentDetail = ({ docId }) => {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios.get(`/documents/details/${docId}`);
                console.log('Fetched Document:', response.data);
                setDocument(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching document:', error);
                setError('문서 정보를 불러오는데 실패하였습니다.');
                setLoading(false);
            }
        };

        console.log('docId:', docId);  // docId 값을 콘솔에 출력
        // docId가 유효한 경우 fetchDocument 호출
        if (docId !== undefined && docId !== null && docId !== '') {
            fetchDocument();
        } else {
            setError('유효한 문서 ID가 제공되지 않았습니다.');
            setLoading(false);
        }
    }, [docId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="document-detail">
            <DocumentInfo document={document} />
        </div>
    );
};

export default DocumentDetail;
