import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
// import '../../styles/components/documents/DocumentRejected.css';

const DocumentRejected = ({ onDocumentClick }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get('/documents/rejected');
                setDocuments(response.data);
            } catch (error) {
                setError('거절된 문서를 불러오는데 실패하였습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    if (loading) return <p>문서를 불러오는 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="documentList">
            <h1>Rejected Documents</h1>
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
}

export default DocumentRejected;