import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import axiosHandler from "../../jwt/axiosHandler";

const DocumentList = ({ onDocumentClick }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchDocuments() {
        try {
            const response = await axiosHandler.get('/documents/all-documents');
            if (response.status === 200) {
                console.log(response.data);
                setDocuments(response.data);
            } else {
                setLoading(false);
            }
        } catch (error) {
            setError('서버에서 문서를 불러오는데 실패하였습니다.');
        }
    }

    useEffect(() => {
        // fetchDocuments 호출을 반환하도록 수정
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