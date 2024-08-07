import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import axiosHandler from "../../jwt/axiosHandler";

const DocumentCompleted = ({ onDocumentClick }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employeeNo, setEmployeeNo] = useState('');

    useEffect(() => {
        const profile = JSON.parse(sessionStorage.getItem('profile'));
        if (profile && profile.username) {
            const username = profile.username;

            axios.get(`/api/members/details/${username}`)
                .then(response => {
                    if (response.data) {
                        const { employeeNo } = response.data;
                        setEmployeeNo(employeeNo);
                    } else {
                        setError('사용자의 인사 정보를 찾을 수 없습니다.');
                    }
                })
                .catch(error => {
                    setError('사용자의 인사 정보를 가져오는 중 오류가 발생했습니다.');
                });
        } else {
            setError('로그인 정보가 없습니다.');
        }
    }, []);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axiosHandler.get('/documents/completed');
                const filteredDocuments = response.data.filter(doc =>
                    doc.approvalLines.some(line => line.employeeNo === employeeNo) ||
                    doc.references.some(ref => ref.employeeNo === employeeNo)
                );
                setDocuments(filteredDocuments);
            } catch (error) {
                setError('완료된 문서를 불러오는데 실패하였습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (employeeNo) {
            fetchDocuments();
        }
    }, [employeeNo]);

    if (loading) return <p>열람한 문서가 없습니다...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="documentList">
            <h1>완료된 문서 목록</h1>
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

export default DocumentCompleted;
