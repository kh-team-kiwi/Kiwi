import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from "moment";

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

    if (loading) return <p>로딩중...</p>;
    if (error) return <p>{error}</p>;
    if (!docDetails) return null;

    return (
        <div className="documentDetails">
            <button onClick={onClose}>닫기</button>
            <h2>{docDetails.docTitle}</h2>
            <p>상태: {docDetails.docStatus}</p>
            <p>작성일: {moment(docDetails.docDate).format('YYYY-MM-DD HH:mm')}</p>
            <p>완료일: {docDetails.docCompletion ? moment(docDetails.docCompletion).format('YYYY-MM-DD HH:mm') : ''}</p>
            <p>작성자: {docDetails.name}</p>
            <p>내용: {docDetails.docContents}</p>
        </div>
    );
};

export default DocumentDetails;
