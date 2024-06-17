import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const DocumentList = ({ onDocumentClick }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get('http://localhost:8080/documents/all-documents');
                setDocuments(response.data);
                setLoading(false);
            } catch (error) {
                setError('서버에서 문서를 불러오는데 실패하였습니다.');
                setLoading(false);
            }
        };
        fetchDocuments();
    }, []);

    if (loading) {
        return <p>문서를 불러오는 중...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="documentList">
            <h1>Document List</h1>
            <table className="docTable">
                <thead>
                <tr>
                    <th>문서 번호</th>
                    <th>문서 제목</th>
                    <th>문서 상태</th>
                    <th>작성일</th>
                    <th>완료일</th>
                    <th>작성자</th>
                </tr>
                </thead>
                <tbody>
                {documents.map(doc => (
                    <tr key={doc.docNum} onClick={() => onDocumentClick(doc)}>
                        <td>{doc.docNum}</td>
                        <td>{doc.docTitle}</td>
                        <td>{doc.docStatus}</td>
                        <td>{moment(doc.docDate).format('YYYY-MM-DD HH:mm')}</td>
                        <td>{doc.docCompletion ? moment(doc.docCompletion).format('YYYY-MM-DD HH:mm') : ''}</td>
                        <td>{doc.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentList;