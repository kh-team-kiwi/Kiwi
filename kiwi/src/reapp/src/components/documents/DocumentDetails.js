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
                console.log('Document details:', details);

                setDocDetails(details);
                setApprovalLine(details.approvalLines || []);
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
            <h1 className="docType">{docDetails.docType}</h1>
            <table className="tableType02 docInfoTable">
                <colgroup>
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '35%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '35%' }} />
                </colgroup>
                <tbody className="docInfo">
                <tr>
                    <th>문서 번호</th>
                    <td>{docDetails.docNum}</td>
                    <th>기안자</th>
                    <td>{docDetails.name}</td>
                </tr>
                <tr>
                    <th>문서 상태</th>
                    <td>{docDetails.docStatus}</td>
                    <th>보존 연한 / 보안 등급</th>
                    <td>{docDetails.retentionPeriod} / {docDetails.accessLevel} 등급</td>
                </tr>
                </tbody>
            </table>

            <table className="approvalLineTable">
                <colgroup>
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '90%' }} />
                </colgroup>
                <tbody>
                <tr>
                    <th className="approvalLineHeader">결재</th>
                    <td className="approvalLineContent">
                        <table className="approvalTeamTable">
                            <colgroup>
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                            </colgroup>
                            <tbody>
                            <tr>
                                {[...Array(8)].map((_, index) => (
                                    <td key={index} className="team name">
                                        {approvalLine[index]?.position || ''} {/* 추가된 직책 */}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                {[...Array(8)].map((_, index) => (
                                    <td key={index} className="stamp">
                                        {approvalLine[index]?.docConf === 1 ? '✔️' : approvalLine[index]?.docConf === -1 ? '❌' : ''}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                {[...Array(8)].map((_, index) => (
                                    <td key={index} className="name">
                                        {approvalLine[index]?.employeeName || ''} {/* 추가된 이름 */}
                                    </td>
                                ))}
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>

            <table className="referenceTable">
                <colgroup>
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '90%' }} />
                </colgroup>
                <tbody>
                <tr>
                    <th className="referenceHeader">참조</th>
                    <td className="referenceContent">
                        {docDetails.references && docDetails.references.length > 0 ? (
                            docDetails.references.map((reference, index) => (
                                <span key={index}>
                                    <span className="referenceHead"> {reference.employeeName} {/* 참조자 이름 */}</span>
                                    <span className="referenceBody"> {reference.deptName} {/* 참조자 부서 */}</span>
                                    <span className="referenceBody"> {reference.position} {/* 참조자 직책 */}</span>
                                    {index < docDetails.references.length - 1 ? ', ' : ''}
                                </span>
                            ))
                        ) : (
                            <span>참조자 없음</span>
                        )}
                    </td>
                </tr>
                </tbody>
            </table>

            <div className="docTitleSection">
                <h2 className="docTitle">{docDetails.docTitle}</h2>
            </div>
            <div className="docContentsSection">
                <p className="docContents" dangerouslySetInnerHTML={{ __html: docDetails.docContents }}></p>
            </div>
            <div className="attachmentsSection">
                <h3>파일 첨부</h3>
                <ul className="attachmentList">
                    {attachments.length > 0 ? (
                        attachments.map((file, index) => (
                            <li key={index}>
                                <a href={`http://localhost:8080/files/${file.id}`} download={file.name}>{file.name}</a>
                            </li>
                        ))
                    ) : (
                        <li>첨부 파일 없음</li>
                    )}
                </ul>
            </div>
            <div className="commentSection">
                <h3>의견</h3>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p>{comment.content}</p>
                            <small>{moment(comment.createdAt).format('YYYY-MM-DD HH:mm')}</small>
                        </div>
                    ))
                ) : (
                    <p>의견 없음</p>
                )}
                <div className="commentInput">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="의견을 입력하세요."
                    />
                    <button className="submitCommentButton" onClick={handleAddComment}>의견 제출</button>
                </div>
            </div>
            <button className="backButton" onClick={onClose}>뒤로가기</button>
        </div>
    );
};

export default DocumentDetails;
