import React, { useEffect, useState } from 'react';
import '../../styles/components/teamsettings/ManageMember.css';
import { getSessionItem } from "../../jwt/storage";
import axiosHandler from "../../jwt/axiosHandler";
import { useParams } from "react-router-dom";
import ErrorImageHandler from "../common/ErrorImageHandler";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

const ManageMember = ({ setIsModalOpen, isModalOpen, checkedMembers }) => {
    const { t } = useTranslation();
    const { teamno } = useParams();
    const [role, setRole] = useState('default');
    const [selectedList, setSelectedList] = useState(checkedMembers === null ? [] : checkedMembers);

    useEffect(() => {
        setSelectedList(checkedMembers);
    }, [checkedMembers]);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRole = async () => {
        if (selectedList.filter(member => member.role === 'OWNER').length === 1) {
            return toast.error(t('cant-invite-self-error'));
        }
        try {
            let updatedList;
            if (role === 'admin') {
                updatedList = selectedList.map(member => ({
                    ...member,
                    role: 'ADMIN'
                }));
            } else if (role === 'member') {
                updatedList = selectedList.map(member => ({
                    ...member,
                    role: 'MEMBER'
                }));
            } else if (role === 'blocked') {
                updatedList = selectedList.map(member => ({
                    ...member,
                    status: 'BLOCKED'
                }));
            } else if (role === 'joined') {
                updatedList = selectedList.map(member => ({
                    ...member,
                    status: 'JOINED'
                }));
            } else {
                return;
            }

            const res = await axiosHandler.put("/api/team/" + teamno, updatedList);
            if (res.data.result) {
                window.location.reload();
            } else {
                toast.error(t('error-occurred'));
            }
        } catch (error) {
            toast.error(t('error-occurred'));
        }
    };

    const selectRoleHandle = (e) => {
        setRole(e.target.value);
    }

    return (
        <>
            {isModalOpen && (
                <div className="teamsettings-manage-modal">
                    <div className="modal-content">
                        <div className='manage-modal-title'>{t('manage-selected-users')} - {selectedList.length}</div>
                        <div className='modal-manage-role-box'>
                            <div className='modal-manage-tag-content'>
                                <select className='modal-manage-dropdown' value={role} onChange={selectRoleHandle}>
                                    <option value='default' hidden disabled>{t('options')}</option>
                                    <option value='admin'>{t('set-admin')}</option>
                                    <option value='member'>{t('set-member')}</option>
                                    <option value='blocked'>{t('block')}</option>
                                    <option value='joined'>{t('unblock')}</option>
                                </select>
                            </div>
                        </div>
                        <div className='manage-modal-middle'>
                            <div className='manage-modal-selected-users'>
                                {selectedList.map((member, idx) => (
                                    <li className='modal-mini-list' key={idx}>
                                        <img className='modal-mini-list-img' src={member.memberFilepath} alt=''
                                            onError={ErrorImageHandler} />
                                        <span className='modal-mini-list-nick'>{member.memberNickname}</span>
                                    </li>
                                ))}
                            </div>
                            <div>
                            </div>
                        </div>
                        <div className='modal-manage-bottom'>
                            <button className='manage-cancel-btn' onClick={closeModal}>{t('cancel')}</button>
                            <button className='manage-apply-btn' onClick={handleRole}>{t('apply')}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageMember;
