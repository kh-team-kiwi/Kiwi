import React, {useState} from 'react';
import '../../styles/components/teamsettings/ManageMember.css'
import {getSessionItem} from "../../jwt/storage";
import axiosHandler from "../../jwt/axiosHandler";

const ManageMember = ({setIsModalOpen, isModalOpen}) => {

    const [memberEmail, setMemberEmail] = useState('');
    const [inviteList, setInviteList] = useState([]);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInvite = () => {
        console.log('Invited members:', inviteList);
        setInviteList([]);
        closeModal();
    };

    return (
            <>
                {isModalOpen && (
                    <div className="teamsettigs-manage-modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <input
                                type="text"
                                value={memberEmail}
                                onChange={(e) => setMemberEmail(e.target.value)}
                                placeholder="멤버 이메일 입력"
                            />
                            <button >Add</button>
                            <div id="inviteList">
                                {inviteList.map((email, index) => (
                                    <div key={index}>{email}</div>
                                ))}
                            </div>
                            <button onClick={handleInvite}>Invite</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                )}
            </>
    );
};

export default ManageMember;