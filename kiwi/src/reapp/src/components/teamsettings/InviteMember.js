import React, { useState } from 'react';
import '../../styles/components/teamsettings/InviteMember.css';
import { getSessionItem } from "../../jwt/storage";
import axiosHandler from "../../jwt/axiosHandler";
import ErrorImageHandler from "../common/ErrorImageHandler";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

const InviteMember = ({ setIsModalOpen, isModalOpen, joinedMembers }) => {
    const { t } = useTranslation();
    const { teamno } = useParams();
    const [memberEmail, setMemberEmail] = useState('');
    const [inviteList, setInviteList] = useState([]);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInvite = async () => {
        try {
            const res = await axiosHandler.post("/api/team/invite", { teamName: teamno, invitedMembers: inviteList });
            if (res.data.result) {
                window.location.reload();
            } else {
                toast.error(t('error-occurred'));
            }
        } catch (error) {
            toast.error(t('error-occurred'));
        }
    };

    const handleMemberTagBtn = async (event) => {
        event.preventDefault();

        let check = validateInput(memberEmail);
        if (check !== true) {
            toast.error(check);
            return;
        }

        if (inviteList.some(member => member.username === memberEmail)) {
            toast.error(t("already-invited-error"));
            setMemberEmail('');
            return;
        }

        if (joinedMembers.some(member => member.memberId === memberEmail)) {
            toast.error(t("already-joined-error"));
            setMemberEmail('');
            return;
        }

        try {
            const res = await axiosHandler.get("/api/auth/member/" + memberEmail);
            if (res.data.result) {
                const data = res.data.data;
                setInviteList(prev => ([
                    ...prev, data,
                ]));
                setMemberEmail('');
            } else if (res.status === 200 && !res.data.result) {
                toast.error(res.data.message);
            } else {
                toast.error(t('error-occurred'));
            }
        } catch (error) {
            toast.error(t('error-occurred'));
        }
    }

    function validateInput(input) {
        const emptyPattern = /^$/;
        const whitespacePattern = /^\s*$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const noSpacesPattern = /^\S+$/;

        if (emptyPattern.test(input)) {
            return t('empty-error');
        } else if (whitespacePattern.test(input)) {
            return t("no-whitespace-error");
        } else if (!noSpacesPattern.test(input)) {
            return t("no-whitespace-error");
        } else if (!emailPattern.test(input)) {
            return t("valid-email");
        } else {
            return true;
        }
    }

    const deleteMember = (username) => {
        setInviteList(prev => prev.filter(member => member.username !== username));
    }

    return (
        <>
            {isModalOpen && (
                <div className="teamsettings-invite-modal">
                    <div className="modal-content">
                        <div className='invite-modal-title'>{t('invite-members')}</div>
                        <div className='invite-member-middle'>
                            <input
                                type="text"
                                value={memberEmail}
                                onChange={(e) => setMemberEmail(e.target.value)}
                                placeholder={t('search-users-by-email')}
                                className="invite-modal-input"
                            />
                            <button className='invite-add-btn' onClick={handleMemberTagBtn}>{t('add')}</button>
                        </div>

                        {inviteList.length > 0 && (
                            <div id="inviteList">
                                {inviteList.map(member => (
                                    <div key={member.username} className="invite-team-member">
                                        <img className='create-team-member-image' src={member.filepath}
                                             onError={ErrorImageHandler}/>
                                        <div className='create-team-member-info'>
                                            <div className='create-team-member-name-wrapper'>
                                                <div className='create-team-member-name'>{member.name}</div>
                                                <div className='create-team-invite-pending'>{t('invited')}</div>
                                            </div>
                                            <div className='create-team-member-email'>{member.username}</div>
                                        </div>
                                        <div className='create-team-member-cancel'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                                 fill="currentColor" viewBox="0 0 16 16"
                                                 onClick={() => deleteMember(member.username)}>
                                                <path
                                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className='invite-member-bottom'>
                            <button className='invite-cancel-btn' onClick={closeModal}>{t('cancel')}</button>
                            <button className='invite-invite-btn' onClick={handleInvite}>{t('invite')}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InviteMember;
