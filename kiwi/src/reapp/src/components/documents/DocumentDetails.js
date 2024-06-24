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
    const [employeeNo, setEmployeeNo] = useState('');
    const [author, setAuthor] = useState({ name: '', deptName: '', position: '' });

    useEffect(() => {
        const profile = JSON.parse(sessionStorage.getItem('profile'));
        if (profile && profile.username) {
            console.log("Session profile:", profile);
            const username = profile.username;

            axios.get(`/api/members/details/${username}`)
                .then(response => {
                    if (response.data) {
                        const { employeeNo, name, deptName, position } = response.data;
                        setEmployeeNo(employeeNo);
                        setAuthor({ name, deptName, position });
                        console.log("User details from API:", response.data);
                    } else {
                        console.warn("No HR information found for the user.");
                        setError('사용자의 인사 정보를 찾을 수 없습니다.');
                    }
                })
                .catch(error => {
                    console.error("Failed to fetch user details:", error);
                    setError('사용자의 인사 정보를 가져오는 중 오류가 발생했습니다.');
                });
        } else {
            console.warn("No user profile found in session.");
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
        if (newComment.trim() === '') {
            console.warn("Empty comment cannot be submitted");
            return;
        }

        if (!employeeNo) {
            console.warn("employeeNo is not set. User may not be logged in properly.");
            return;
        }

        try {
            console.log("Sending comment:", newComment, "by employeeNo:", employeeNo);
            const response = await axios.post(`http://localhost:8080/documents/${document.docNum}/comments`, {
                content: newComment,
                employeeNo: employeeNo
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Comment added successfully:", response.data);
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
                                        {approvalLine[index]?.position || ''}
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
            <div className="commentSection approval-comment approval">
                <h3>의견</h3>
                <p className="top number_comments">
                    <span className="point_color bold">{comments.length}</span>개의 의견
                </p>
                <ul className="approvalComments">
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <li key={index}>
                                <div className="profile">
                                    <img className="myphoto"
                                         src={`https://api.multiavatar.com/${comment.employeeName}.png`}
                                         alt="A multicultural avatar"/>
                                </div>
                                <div className="txt">
                                    <div className="hidden after">
                                    <p className="name bold">{comment.employeeName}</p>
                                        <p className="date">{moment(comment.createdAt).format('YYYY-MM-DD HH:mm')}</p>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>의견 없음</p>
                    )}
                </ul>
                <div className="comment_write">
                    <label htmlFor="commentInput" className="blind">댓글 입력란</label>
                    <textarea
                        id="approvalDocumentComment"
                        placeholder="댓글을 남겨주세요."
                        title="댓글을 남겨주세요."
                        className="comment-texarea"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button type="button" className="bt_left" onClick={handleAddComment}>등록</button>
                </div>
            </div>
            <button className="backButton" onClick={onClose}>뒤로가기</button>
        </div>
    );
};

export default DocumentDetails;
