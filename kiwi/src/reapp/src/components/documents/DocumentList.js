import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('/docs');
            setDocuments(response.data);
        } catch (error) {
            console.error("서버에서 문서를 불러오는데 실패하였습니다.", error);
        }
    };

    return (
        <div className="documentList">
            <table className="docTable">
                <thead>
                <tr>
                    <th>문서 번호</th>
                    <th>문서 종류</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>완료일</th>
                </tr>
                </thead>
                <tbody>
                {documents.map((doc, index) => (
                    <tr key={index}>
                        <td>{doc.docNum}</td>
                        <td>{doc.docType}</td>
                        <td>{doc.docTitle}</td>
                        <td>{doc.memberId}</td>
                        <td>{doc.docDate}</td>
                        <td>{doc.docCompletion}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default DocumentList;
