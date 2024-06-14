import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [error, setError] = useState(null); // 에러 상태 추가

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('/documents');
            setDocuments(response.data);
        } catch (error) {
            setError("서버에서 문서를 불러오는데 실패하였습니다.");
            console.error("서버에서 문서를 불러오는데 실패하였습니다.", error);
        } finally {
            setLoading(false); // 로딩 상태 업데이트
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="documentList">
            <table className="docTable">
                <thead>
                <tr>
                    <th>문서 번호</th>
                    <th>문서 종류</th>
                    <th>제목</th>
                    <th>사원 이름</th>
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
                        <td>{doc.name}</td>
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
