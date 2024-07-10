import React, {useEffect, useState} from 'react';
import '../../styles/components/teamsettings/ManageMember.css'
import {getSessionItem} from "../../jwt/storage";
import axiosHandler from "../../jwt/axiosHandler";
import {parsePath, useParams} from "react-router-dom";
import ErrorImageHandler from "../common/ErrorImageHandler";

const ManageMember = ({setIsModalOpen, isModalOpen, checkedMembers}) => {

    const {teamno} = useParams();
    const [role, setRole] = useState('default');
    const [selectedList, setSelectedList] = useState(checkedMembers===null?[]:checkedMembers);
    const [isList, setIsList] = useState(false);

    useEffect(() => {
        setSelectedList(checkedMembers); 
    }, [checkedMembers]);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRole = async () =>{
        if(selectedList.filter(member=>member.role==='OWNER').length===1) return alert('OWNER는 변경할 수 없습니다.');
        try{
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
            } else {
                updatedList = selectedList.map(member => ({
                    ...member,
                    status: 'JOINED'
                }));
            }

            const res = await axiosHandler.post("/api/team/"+teamno,updatedList);
            if (res.data.result) {
                window.location.reload();
            } else {
                alert("오류가 발생했습니다.");
            }
        } catch (error) {
            alert("오류가 발생했습니다.");
        }
    };

    // 셀렉트 이벤트
    const selectRoleHandle = (e) => {
        setRole(e.target.value);
    }

    return (
            <>
                {isModalOpen && (
                    <div className="teamsettings-manage-modal">
                        <div className="modal-content">
                            <div className='manage-modal-title'>Manage Selected Users - {selectedList.length}</div>
                            <div className='modal-manage-role-box'>
                                <div className='modal-manage-tag-content'>
                                    <select className='modal-manage-dropdown'value={role} onChange={selectRoleHandle}>
                                        <option value='default' hidden disabled>적용할 관리를 선택해주세요.</option>
                                        <option value='admin'>관리자로 지정</option>
                                        <option value='member'>멤버로 지정</option>
                                        <option value='blocked'>멤버 차단</option>
                                        <option value='joined'>차단 해제</option>
                                    </select>
                                </div>
                            </div>
                            <div className='manage-modal-middle'>
                                    <div className='manage-modal-selected-users'> 
                                        {selectedList.map((member, idx) => (
                                                    <li className='modal-mini-list' key={idx}>
                                                        <img className='modal-mini-list-img' src={member.memberFilepath} alt=''
                                                            onError={ErrorImageHandler}/>
                                                        <span className='modal-mini-list-nick'>{member.memberNickname}</span>
                                                    </li>
                                                ))}
                                    </div>
                                    <div>
                                        </div>



                            </div>
                            <div className='modal-manage-bottom'>
                            <button className='manage-cancel-btn' onClick={closeModal}>Cancel</button>
                            <button className='manage-apply-btn' onClick={handleRole}>Apply</button>

                            </div>

                        </div>
                    </div>
                )}
            </>
    );
};

export default ManageMember;