// import React, { useState } from 'react';
// import axios from 'axios';
// import '../../styles/components/documents/ApprovalLineModal.css';
//
// const ApprovalSection = ({ document, userRole }) => {
//     const [comment, setComment] = useState('');
//     const [comments, setComments] = useState(document.comments || []);
//
//     const handleCommentChange = (e) => {
//         setComment(e.target.value);
//     };
//
//     const handleCommentSubmit = async () => {
//         try {
//             const response = await axios.post(`/documents/${document.docNum}/comments`, { comment });
//             setComments([...comments, response.data]);
//             setComment('');
//         } catch (error) {
//             console.error("의견 등록에 실패했습니다.", error);
//         }
//     };
//
//     const handleApproval = async (isApproved) => {
//         try {
//             await axios.post(`/documents/${document.docNum}/approval`, { approved: isApproved });
//             alert(isApproved ? '문서가 승인되었습니다.' : '문서가 반려되었습니다.');
//         } catch (error) {
//             console.error("결재 처리에 실패했습니다.", error);
//         }
//     };
//
//     return (
//         <div className="approvalSection">
//             <h3>결재 및 의견</h3>
//             <div className="comments">
//                 <h4>의견</h4>
//                 {comments.map((comm, index) => (
//                     <div key={index}>
//                         <strong>{comm.author}</strong>: {comm.content}
//                     </div>
//                 ))}
//             </div>
//             {userRole === '결재자' ? (
//                 <div className="approvalButtons">
//                     <button className={"document-button"} onClick={() => handleApproval(true)}>승인</button>
//                     <button className={"document-button"} onClick={() => handleApproval(false)}>반려</button>
//                 </div>
//             ) : (
//                 <div className="commentInput">
//                     <textarea
//                         value={comment}
//                         onChange={handleCommentChange}
//                         placeholder="의견을 남겨주세요."
//                     />
//                     <button className={"document-button"} onClick={handleCommentSubmit}>등록</button>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default ApprovalSection;
