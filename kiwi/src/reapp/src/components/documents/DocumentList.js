import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import '../../styles/components/documents/DocumentList.css';
import axiosHandler from "../../jwt/axiosHandler";

const DocumentList = ({ onDocumentClick }) => {
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
                        setEmployeeNo(response.data.employeeNo);
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
                const response = await axiosHandler.get('/documents/all-documents');
                console.log("API Response:", response.data);
                const filteredDocs = response.data.filter(doc =>
                    doc.approvalLines.some(line => line.employeeNo === employeeNo) ||
                    doc.references.some(ref => ref.employeeNo === employeeNo)
                );
                console.log("Filtered Documents:", filteredDocs);
                setDocuments(filteredDocs);
            } catch (error) {
                setError('문서를 불러오는데 실패하였습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (employeeNo) {
            fetchDocuments();
            console.log("Employee No:", employeeNo);
        }
    }, [employeeNo]);


    if (loading) return <p>문서를 작성해주세요...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="documentList">
            <h1>전체 문서함</h1>
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
