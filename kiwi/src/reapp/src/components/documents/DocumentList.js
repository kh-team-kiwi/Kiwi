import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import DocumentDetails from './DocumentDetails';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);

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

    const handleRowClick = async (docNum) => {
        try {
            const response = await axios.get(`http://localhost:8080/documents/details/${docNum}`);
            setSelectedDocument(response.data);
        } catch (error) {
            setError('문서 세부 정보를 불러오는데 실패하였습니다.');
        }
    };

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
                    <tr key={doc.docNum} onClick={() => handleRowClick(doc.docNum)}>
                        <td>{doc.docNum}</td>
                        <td>{doc.docTitle}</td>
                        <td>{doc.docStatus}</td>
                        <td>{moment(doc.docDate).format('YYYY-MM-DD HH:mm')}</td>
                        <td>{doc.docCompletion ? moment(doc.docCompletion).format('YYYY-MM-DD HH:mm') : 'Not completed'}</td>
                        <td>{doc.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedDocument && <DocumentDetails document={selectedDocument} onClose={() => setSelectedDocument(null)} />}
        </div>
    );
};

export default DocumentList;
