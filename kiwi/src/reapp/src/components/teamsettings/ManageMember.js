import React, {useEffect, useState} from 'react';
import '../../styles/components/teamsettings/ManageMember.css'
import {getSessionItem} from "../../jwt/storage";
import axiosHandler from "../../jwt/axiosHandler";
import {parsePath, useParams} from "react-router-dom";
import ErrorImageHandler from "../common/ErrorImageHandler";

const ManageMember = ({setIsModalOpen, isModalOpen, checkedMembers}) => {

    const {teamno} = useParams();
    const [role, setRole] = useState('default');
    const [selectedList, setSelectedList] = useState(checkedMembers);
    const [isList, setIsList] = useState(false);

    useEffect(() => {
        setSelectedList(checkedMembers); 
    }, [checkedMembers]);

    const closeModal = () => {
        console.log(selectedList);
        setIsModalOpen(false);
    };

    const handleRole = async () =>{
        if(selectedList.filter(member=>member.role==='OWNER').length===1) return alert('OWNER는 변경할 수 없습니다.');
        try{
            if(role==='admin'){
                setSelectedList(prevState => (prevState.map(member=>{
                    member.role='ADMIN';
                })))
            } else if (role==='member') {
                setSelectedList(prevState => (prevState.map(member=>{
                    member.role='MEMBER';
                })))
            } else if (role==='exiled') {
                setSelectedList(prevState => (prevState.map(member=>{
                    member.status='EXILED';
                })))
            } else {
                setSelectedList(prevState => (prevState.map(member=>{
                    member.status='JOINED';
                })))
            }
            const res = await axiosHandler.post("/api/team/update/role/"+teamno,selectedList);
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
                    <div className="teamsettigs-manage-modal">
                        <div className="modal-content">
                            <div className='manage-modal-title'>멤버 관리</div>
                            <div className='modal-manage-select-box'>
                                <div className='modal-manage-tag-name'>선택된 멤버</div>
                                <div className='modal-manage-tag-content'>
                                    <span className='modal-hover-wrapper'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"
                                             className='manage-modal-icon'>
                                            <path fill="#74C0FC"
                                                  d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM625 177L497 305c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L591 143c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                                        </svg>
                                        <ul id="selectedList">
                                            {selectedList.map((member, idx) => (
                                                <li className='modal-mini-list' key={idx}>
                                                    <img className='modal-mini-list-img' src={member.memberFilepath} alt=''
                                                         onError={ErrorImageHandler}/>
                                                    <span className='modal-mini-list-nick'>{member.memberNickname}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </span>
                                    &nbsp;
                                    <span>
                                        총 {selectedList.length}명을 선택하셨습니다.
                                    </span>
                                </div>

                            </div>
                            <div className='modal-manage-role-box'>
                                <div className='modal-manage-tag-name'>관리</div>
                                <div className='modal-manage-tag-content'>
                                    <select value={role} onChange={selectRoleHandle}>
                                        <option value='default' hidden disabled>적용할 관리를 선택해주세요.</option>
                                        <option value='admin'>관리자로 지정</option>
                                        <option value='member'>멤버로 지정</option>
                                        <option value='exiled'>멤버 차단</option>
                                        <option value='joined'>차단 해제</option>
                                    </select>
                                </div>
                            </div>
                            <button className='manage-cancle-btn' onClick={closeModal}>Cancel</button>
                            <button className='manage-apply-btn' onClick={handleRole}>Apply</button>
                        </div>
                    </div>
                )}
            </>
    );
};

export default ManageMember;