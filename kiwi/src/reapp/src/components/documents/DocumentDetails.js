import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from "moment";
import ApprovalModal from './ApprovalModal';
import '../../styles/components/documents/DocumentDetails.css';

const DocumentDetails = ({ document, onClose }) => {
    const [docDetails, setDocDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvalLine, setApprovalLine] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editedComment, setEditedComment] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [employeeNo, setEmployeeNo] = useState('');
    const [author, setAuthor] = useState({ name: '', deptName: '', position: '' });
    const [approvalModalIsOpen, setApprovalModalIsOpen] = useState(false);
    const [approvalAction, setApprovalAction] = useState(null);
    const [approvalReason, setApprovalReason] = useState('');
    const [selectedApprover, setSelectedApprover] = useState(null);

    const [isEditingDoc, setIsEditingDoc] = useState(false);
    const [editedDocDetails, setEditedDocDetails] = useState({
        docTitle: '',
        docContents: '',
    });

    const handleApprovalClick = (approver) => {
        setSelectedApprover(approver);
        setApprovalModalIsOpen(true);
    };

    const handleApprovalSubmit = async () => {
        const confirmation = window.confirm(`${approvalAction === 1 ? '승인' : '반려'}를 선택하시겠습니까?`);
        if (!confirmation) {
            return;
        }

        try {
            await axios.post(`http://localhost:8080/documents/${document.docNum}/approve`, {
                employeeNo: selectedApprover.employeeNo,
                docConf: approvalAction,
                docReject: approvalReason
            });
            setApprovalModalIsOpen(false);
            window.location.reload(); // 결재 후 페이지를 새로고침합니다.
        } catch (error) {
            console.error("결재 처리 중 오류가 발생했습니다.", error);
        }
    };

    useEffect(() => {
        const profile = JSON.parse(sessionStorage.getItem('profile'));
        if (profile && profile.username) {
            const username = profile.username;

            axios.get(`/api/members/details/${username}`)
                .then(response => {
                    if (response.data) {
                        const { employeeNo, name, deptName, position } = response.data;
                        setEmployeeNo(employeeNo);
                        setAuthor({ name, deptName, position });
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
        const fetchDocumentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/documents/details/${document.docNum}`);
                const details = response.data;

                setDocDetails(details);
                setApprovalLine(details.approvalLines || []);
                setComments(details.commentDtos || []);
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
        if (newComment.trim() === '') {
            return;
        }

        if (!employeeNo) {
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/documents/${document.docNum}/comments`, {
                content: newComment,
                employeeNo: employeeNo,
                employeeName: author.name
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const newCommentData = {
                ...response.data,
                employeeName: author.name,
                createdAt: response.data.createdAt
            };

            setComments([...comments, newCommentData]);
            setNewComment('');
        } catch (error) {
            setError('댓글 추가에 실패하였습니다.');
        }
    };

    const handleEditComment = (comment) => {
        if (comment.employeeNo !== employeeNo) {
            setError('자신의 댓글만 수정할 수 있습니다.');
            return;
        }
        setEditingComment(comment);
        setEditedComment(comment.content);
    };

    const handleUpdateComment = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/documents/comments/${editingComment.id}`, {
                id: editingComment.id,
                content: editedComment,
                employeeNo: editingComment.employeeNo,
                employeeName: editingComment.employeeName,
                createdAt: editingComment.createdAt
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const updatedComment = response.data;
            setComments(comments.map(comment => (comment.id === updatedComment.id ? updatedComment : comment)));
            setEditingComment(null);
            setEditedComment('');
        } catch (error) {
            setError('댓글 수정에 실패하였습니다.');
        }
    };

    const handleDeleteComment = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/documents/comments/${id}`);
            setComments(comments.filter(comment => comment.id !== id));
        } catch (error) {
            setError('댓글 삭제에 실패하였습니다.');
        }
    };

    const handleEditDoc = () => {
        setIsEditingDoc(true);
        setEditedDocDetails({
            docTitle: docDetails.docTitle,
            docContents: docDetails.docContents,
        });
    };

    const handleUpdateDoc = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/documents/${document.docNum}`, {
                docTitle: editedDocDetails.docTitle,
                docContents: editedDocDetails.docContents,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setDocDetails({
                ...docDetails,
                docTitle: response.data.docTitle,
                docContents: response.data.docContents,
            });
            setIsEditingDoc(false);
        } catch (error) {
            setError('문서 수정에 실패하였습니다.');
        }
    };

    const handleDeleteDoc = async () => {
        try {
            await axios.delete(`http://localhost:8080/documents/${document.docNum}`);
            onClose(); // 문서 삭제 후 페이지를 닫음
        } catch (error) {
            setError('문서 삭제에 실패하였습니다.');
        }
    };

    if (loading) return <p>로딩중...</p>;
    if (error) return <p>{error}</p>;
    if (!docDetails) return null;

    return (
        <div className="documentDetails">
            <div className="edit-delete-doc-buttons">
                {isEditingDoc ? (
                    <button className="edit-delete-doc-button" onClick={handleUpdateDoc}>저장</button>
                ) : (
                    <button className="edit-delete-doc-button" onClick={handleEditDoc}>수정</button>
                )}
                <button className="edit-delete-doc-button" onClick={handleDeleteDoc}>삭제</button>
            </div>
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
                                        {approvalLine[index]?.position || ''}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                {[...Array(8)].map((_, index) => (
                                    <td key={index} className="stamp">
                                        {approvalLine[index]?.docConf === 1 ? '✔️' : approvalLine[index]?.docConf === -1 ? '❌' : (
                                            approvalLine[index]?.employeeNo === employeeNo && (
                                                <button onClick={() => handleApprovalClick(approvalLine[index])}>결재</button>
                                            )
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                {[...Array(8)].map((_, index) => (
                                    <td key={index} className="name">
                                        {approvalLine[index]?.employeeName || ''}
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
                                    <span className="referenceHead"> {reference.employeeName}</span>
                                    <span className="referenceBody"> {reference.deptName}</span>
                                    <span className="referenceBody"> {reference.position}</span>
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
                {isEditingDoc ? (
                    <input
                        type="text"
                        value={editedDocDetails.docTitle}
                        onChange={(e) => setEditedDocDetails({ ...editedDocDetails, docTitle: e.target.value })}
                        className="edit-input"
                    />
                ) : (
                    <h2 className="docTitle">{docDetails.docTitle}</h2>
                )}
            </div>
            <div className="docContentsSection">
                {isEditingDoc ? (
                    <textarea
                        value={editedDocDetails.docContents}
                        onChange={(e) => setEditedDocDetails({ ...editedDocDetails, docContents: e.target.value })}
                        className="edit-textarea"
                    />
                ) : (
                    <p className="docContents" dangerouslySetInnerHTML={{ __html: docDetails.docContents }}></p>
                )}
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
            <div className="commentSection approval-comment approval">
                <p className="top number_comments">
                    <span className="point_color bold">{comments.length}</span>개의 의견
                </p>
                <ul className="approvalComments">
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <li key={index}>
                                <div className="profile">
                                    <img className="myphoto" src={`https://api.multiavatar.com/${comment.employeeName}.png`} alt="A multicultural avatar"/>
                                </div>
                                <div className="txt">
                                    <div className="hidden after">
                                        <p className="name bold">{comment.employeeName}</p>
                                        <p className="date">{moment(comment.createdAt).format('YYYY-MM-DD HH:mm')}</p>
                                    </div>
                                    {editingComment && editingComment.id === comment.id ? (
                                        <div>
                                            <textarea
                                                value={editedComment}
                                                onChange={(e) => setEditedComment(e.target.value)}
                                                className="edit-textarea"
                                            />
                                            <button className="edit-delete-button" onClick={handleUpdateComment}>수정</button>
                                            <button className="edit-delete-button" onClick={() => setEditingComment(null)}>취소</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p>{comment.content}</p>
                                            {comment.employeeNo === employeeNo && (
                                                <div className="edit-delete-buttons">
                                                    <button className="edit-delete-button" onClick={() => handleEditComment(comment)}>수정</button>
                                                    <button className="edit-delete-button" onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>의견 없음</p>
                    )}
                </ul>
                <div className="comment_write">
                    <textarea
                        id="approvalDocumentComment" placeholder="의견을 남겨주세요." title="의견을 남겨주세요."
                        className="comment-texarea" value={newComment} onChange={
                        (e) => setNewComment(e.target.value)}/>
                    <button type="button" className="bt_left" onClick={handleAddComment}>등록</button>
                </div>
            </div>

            {approvalModalIsOpen && (
                <ApprovalModal
                    isOpen={approvalModalIsOpen}
                    onRequestClose={() => setApprovalModalIsOpen(false)}
                    onSubmit={handleApprovalSubmit}
                    approvalAction={approvalAction}
                    setApprovalAction={setApprovalAction}
                    approvalReason={approvalReason}
                    setApprovalReason={setApprovalReason}
                />
            )}
        </div>
    );
};

export default DocumentDetails;
