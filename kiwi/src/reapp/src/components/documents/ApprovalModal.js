import React from 'react';
import '../../styles/components/documents/ApprovalModal.css';

const ApprovalModal = ({ isOpen, onRequestClose, onSubmit, approvalAction, setApprovalAction, approvalReason, setApprovalReason }) => {
    if (!isOpen) return null;

    return (
        <div className="modalOverlay">
            <div className="approvalContent">
                <h1>결재</h1>
                <div className="radioGroup">
                    <label>
                        <input type="radio" value={1} checked={approvalAction === 1}
                               onChange={() => setApprovalAction(1)}/>
                        승인
                    </label>
                    <label>
                        <input type="radio" value={-1} checked={approvalAction === -1}
                               onChange={() => setApprovalAction(-1)}/>
                        반려
                    </label>
                </div>
                <h2>결재하시겠습니까?</h2>
                <div className="modalActions">
                    <button className="confirmButton" onClick={onSubmit}>확인</button>
                    <button id="cancelButton" onClick={onRequestClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalModal;
