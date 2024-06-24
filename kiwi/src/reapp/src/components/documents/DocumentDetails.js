import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from "moment";
import '../../styles/components/documents/DocumentDetails.css';

const DocumentDetails = ({ document, onClose }) => {
    const [docDetails, setDocDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvalLine, setApprovalLine] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        const fetchDocumentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/documents/details/${document.docNum}`);
                const details = response.data;

                setDocDetails(details);
                setApprovalLine(details.approvalLine || []);
                setComments(details.comments || []);
                setAttachments(details.attachments || []);
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

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;
        try {
            const response = await axios.post(`http://localhost:8080/documents/${document.docNum}/comments`, {
                content: newComment
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('댓글 추가 오류:', error.response ? error.response.data : error.message);
            setError('댓글 추가에 실패하였습니다.');
        }
    };


    if (loading) return <p>로딩중...</p>;
    if (error) return <p>{error}</p>;
    if (!docDetails) return null;

    return (
        <div className="documentDetails">
            <h1 className="title">문서 상세 정보</h1>
            <div className="docInfo">
                <table>
                    <tbody>
                    <tr>
                        <th>상태</th>
                        <td>{docDetails.docStatus}</td>
                    </tr>
                    <tr>
                        <th>작성일</th>
                        <td>{moment(docDetails.docDate).format('YYYY-MM-DD HH:mm')}</td>
                    </tr>
                    <tr>
                        <th>완료일</th>
                        <td>{docDetails.docCompletion ? moment(docDetails.docCompletion).format('YYYY-MM-DD HH:mm') : ''}</td>
                    </tr>
                    <tr>
                        <th>보존 기간</th>
                        {/*<td>{docDetails.scheduledDeletionDate ? moment(docDetails.scheduledDeletionDate).format('YYYY-MM-DD') : 'N/A'}</td>*/}
                        <td>{docDetails.retentionPeriod}</td>
                    </tr>
                    <tr>
                    <th>열람 권한 등급</th>
                        <td>{docDetails.accessLevel}</td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td>{docDetails.name}</td>
                    </tr>
                    </tbody>
                </table>
                <div className="approvalLine">
                    <h3>결재선</h3>
                    <table className="cal_table1">
                        <thead>
                        <tr>
                            <th>신청</th>
                            <th>처리</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <table>
                                    <tbody>
                                    <tr>
                                        {approvalLine.slice(0, 3).map((approver, index) => (
                                            <td key={index} className="team name">{approver.name}</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        {approvalLine.slice(0, 3).map((approver, index) => (
                                            <td key={index}
                                                className="stamp">{approver.status === 'APPROVED' ? '✔️' : '❌'}</td>
                                        ))}
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td>
                                <table>
                                    <tbody>
                                    <tr>
                                        {approvalLine.slice(3, 7).map((approver, index) => (
                                            <td key={index} className="team name">{approver.name}</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        {approvalLine.slice(3, 7).map((approver, index) => (
                                            <td key={index}
                                                className="stamp">{approver.status === 'APPROVED' ? '✔️' : '❌'}</td>
                                        ))}
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="references">
                    <h3>참조자</h3>
                    <p>{docDetails.references && docDetails.references.map((reference, index) => (
                        <span key={index}>{reference.name}{index < docDetails.references.length - 1 ? ', ' : ''}</span>
                    ))}</p>
                </div>
            </div>
            <div className="docTitle">
                <h2>{docDetails.docTitle}</h2>
            </div>
            <div className="docContents">
                <p dangerouslySetInnerHTML={{__html: docDetails.docContents}}></p>
            </div>
            <div className="attachments">
                <h3>파일 첨부</h3>
                <ul>
                    {attachments.map((file, index) => (
                        <li key={index}>
                            <a href={`http://localhost:8080/files/${file.id}`} download={file.name}>{file.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="commentSection">
                <h3>의견</h3>
                {comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <p>{comment.content}</p>
                        <small>{moment(comment.createdAt).format('YYYY-MM-DD HH:mm')}</small>
                    </div>
                ))}
                <div className="commentInput">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="의견을 입력하세요."
                    />
                    <button onClick={handleAddComment}>의견 제출</button>
                </div>
            </div>
            <button className="backButton" onClick={onClose}>뒤로가기</button>
        </div>
    );
};

export default DocumentDetails;