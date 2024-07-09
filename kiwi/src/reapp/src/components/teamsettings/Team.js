import React, {useCallback, useContext, useEffect, useState} from 'react';
import '../../styles/components/teamsettings/Team.css'
import axiosHandler from "../../jwt/axiosHandler";
import PlusIcon from "../../images/svg/shapes/PlusIcon";
import {TeamContext} from "../../context/TeamContext";
import {getLocalItem, getSessionItem} from "../../jwt/storage";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import ErrorImageHandler from "../common/ErrorImageHandler";

const Loading = () => {
    return <div>Loading...</div>;
};


const Team = () => {
    const location = useLocation();
    const [name, setName] = useState('');
    const [profile, setProfile] = useState();
    const [file, setFile] = useState();
    const navigate = useNavigate();
    const { teamno } = useParams();
    const {role} = useContext(TeamContext);

    const handleProfilePictureChange = (e) => {
        setProfile(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]);
    };
    
    const handleProfileCancle =()=>{
        setProfile(undefined);
    }

    const handleTeamName = async () => {
        if(name.length===0) return alert("최소 1글자 이상 입력해야합니다.");
        try {
            const memberId = getSessionItem('profile').username;
            const res = await axiosHandler.post('/api/team/update/team',{ teamno: teamno, teamName:name });
            if(res.data.result){
                alert("팀 이름이 변경되었습니다.")
                window.location.reload();
            }else {
                alert(res.data.message);
            }
        } catch (e) {
            console.error(e);
            alert("팀 이름 변경을 실패했습니다.")
        }
    }

    const handleTeamDelete = async () => {
        try {
            const memberId = getSessionItem('profile').username;
            const res = await axiosHandler.post('/api/team/delete'+location.pathname,{memberId});
            if(res.data.result){
                alert("삭제되었습니다.")
                navigate('/home',{replace:true});
            }else {
                alert(res.data.message);
            }
        } catch (e) {
            console.error(e);
            alert("팀 삭제에 실패했습니다.")
        }
    }

    const handleTeamProfile = async () => {
        if(profile===undefined) return alert('등록된 이미지가 없습니다.');
        const formData = new FormData();
        formData.append('profile', file);
        formData.append('team', teamno);
        formData.append('memberId',getSessionItem('profile').username);
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        try {
            const res = await axiosHandler.post('/api/team/upload/profile', formData,
                {headers: { 'Content-Type': 'multipart/form-data' }});
            if(res.data.result){
                alert("팀 프로필이 변경되었습니다.")
                window.location.reload();
            }else {
                alert(res.data.message);
            }
        } catch (e) {
            console.error(e);
            alert("팀 프로필 변경을 실패했습니다.")
        }
    }

    const handleRole = async () => {
        try{
            const res = await axiosHandler.post('/api/team/change/owner',{teamno:teamno,newOwner:searchSelect.memberId,oldOwner:getSessionItem('profile').username});
            if(res.data.result){
                window.location.reload();
            } else {
                alert(res.data.message);
            }
        } catch (e) {
            console.log("에러가 발생했습니다.")
        }
    }

    const [ownerInput, setOwnerInput] = useState('');
    const [searchList, setSearchList] = useState([]);
    const [searchSelect, setSearchSelect] = useState('');
    const [isOwnerBtn, setIsOwnerBtn] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(role!==null){
            setLoading(false);
        }
    }, [role]);

    useEffect(() => {
        if(loading===false&&role!=='OWNER'){
            alert('권한이 없습니다.');
            navigate('/team/'+teamno+'/settings');
        }
    }, [loading, role]);

    useEffect(() => {
        if(searchSelect==='') {
            setIsOwnerBtn(true);
        } else {
            setIsOwnerBtn(false);
        }
    }, [searchSelect]);

    useEffect( () => {
        searchMember();
    }, [ownerInput]);

    const searchMember = async () => {
        if (ownerInput === '') return setSearchList([]);
        try {
            const res = await axiosHandler.post('/api/team/search',{teamno:teamno,search:ownerInput});
            if(res.data.result){
                console.log(res.data.data);
                setSearchList(res.data.data);
            } else {
                alert(res.data.message);
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleOwnerInput = async (e) => {
        setOwnerInput(e.target.value)
    }

    const searchSelectHandle = (item) => {
        setSearchSelect(item);
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='teamsettings-inner'>
            <div className='teamsettings-header'>팀 관리</div>
            <div className='teamsettings-team-section'>
                <div>팀 이름 변경</div>
                <div>
                    <input type='text' placeholder='새 팀 이름' value={name}  onChange={(e)=>setName(e.target.value)}/>
                    <div>
                        <button onClick={() => handleTeamName()}>팀 이름 변경하기</button>
                    </div>
                </div>
            </div>
            <div className='teamsettings-team-section'>
                <div>팀 아이콘 변경</div>
                <div>
                    <div className='teamsettings-team-profile-box'>
                        {profile === undefined ?
                            (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17"
                                  className='teamsettings-team-icon'
                                  onClick={() => document.getElementById('fileInput').click()}>
                                <path
                                    d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
                            </svg>)
                            :
                            (<>
                                <img src={profile} className='teamsettings-team-profile' alt=''/>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='teamsettings-team-profile-x' onClick={handleProfileCancle}>
                                    <path
                                        d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm79 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
                                </svg>
                            </>)}
                    </div>
                    <button onClick={() => handleTeamProfile()}>팀 아이콘 변경하기</button>
                    <input
                        id="fileInput"
                        type="file"
                        style={{display: 'none'}}
                        onChange={handleProfilePictureChange}
                    />
                </div>
            </div>
            <div className='teamsettings-team-section'>
                <div><span>권한 양도 (OWNER 권한을 양도합니다. ADMIN권한으로 전환됩니다.)</span></div>
                {
                    searchSelect !== '' && (
                        <div className='teamsettigs-team-select-item'>
                            <img className='teamsettigs-team-search-profile' src={searchSelect.memberFilepath} alt=''
                                 onError={ErrorImageHandler}></img>
                            <div className='teamsettigs-team-search-name'>
                                <span>{searchSelect.memberNickname}</span>
                                <span>{searchSelect.memberId}</span>
                            </div>
                            <sapn className='teamsettigs-team-search-role'>{searchSelect.role}</sapn>
                        </div>
                    )
                }
                <div>
                    <input type='text' value={ownerInput} onChange={handleOwnerInput} className='team-owner-input'
                           placeholder='이메일 입력'/>
                    <ul>
                        {
                            searchList.map((item, idx) => (
                                <li className={`teamsettigs-team-search-item ${item.memberId===searchSelect.memberId ? 'select':''}`} key={idx}
                                    onClick={() => searchSelectHandle(item)}>
                                    <img className='teamsettigs-team-search-profile' src={item.memberFilepath} alt=''
                                         onError={ErrorImageHandler}></img>
                                    <div className='teamsettigs-team-search-name'>
                                        <span>{item.memberNickname}</span>
                                        <span>{item.memberId}</span>
                                    </div>
                                    <sapn className='teamsettigs-team-search-role'>{item.role}</sapn>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <button type='button' onClick={handleRole}>권한 양도하기</button>
            </div>
            <div className='teamsettings-team-section teamsettings-team-delete'>
                <div>팀 삭제</div>
                <div>
                    <p>정말로 팀을 삭제하시겠습니까?<br/>모든 메세지와 파일들이 삭제되며 복구할 수 없습니다.</p>
                    <button onClick={() => handleTeamDelete()}>팀 삭제하기</button>
                </div>
            </div>
        </div>
    );
};

export default Team;