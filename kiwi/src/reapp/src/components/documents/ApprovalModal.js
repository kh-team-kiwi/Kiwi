import React from 'react';
import '../../styles/components/documents/ApprovalModal.css';

const ApprovalModal = ({ isOpen, onRequestClose, onSubmit, approvalAction, setApprovalAction, approvalReason, setApprovalReason }) => {
    if (!isOpen) return null;

    return (
        <div className="modalOverlay">
            <div className="approvalContent">
                <h2>결재</h2>
                <div>
                    <label>
                        <input
                            type="radio"
                            value={1}
                            checked={approvalAction === 1}
                            onChange={() => setApprovalAction(1)}
                        />
                        승인
                    </label>
                    <label>
                        <input
                            type="radio"
                            value={-1}
                            checked={approvalAction === -1}
                            onChange={() => setApprovalAction(-1)}
                        />
                        반려
                    </label>
                </div>
                {approvalAction === -1 && (
                    <div>
                        <label>반려 사유</label>
                        <textarea
                            value={approvalReason}
                            onChange={(e) => setApprovalReason(e.target.value)}
                        />
                    </div>
                )}
                <div className="modalActions">
                    <button onClick={onSubmit}>확인</button>
                    <button onClick={onRequestClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalModal;
