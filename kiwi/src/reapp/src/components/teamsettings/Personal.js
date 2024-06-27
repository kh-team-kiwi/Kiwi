import React, {useContext, useEffect} from 'react';
import '../../styles/components/teamsettings/Personal.css'
import {TeamContext} from "../../context/TeamContext";
import axiosHandler from "../../jwt/axiosHandler";
import {getSessionItem} from "../../jwt/storage";
import {useNavigate, useParams} from "react-router-dom";

const Personal = () => {
    const { teamno } = useParams();
    const navigate = useNavigate();



    const handleLeaveTeam = async () => {
        const dto = {
            memberId : getSessionItem("profile").username,
            team : teamno
        }
        try{
            const res = await axiosHandler.post("/api/team/leaveTeam",dto);
            if(res.data.result){
                alert(res.data.message);
                navigate('/home',{replace:true});
            } else {
                alert(res.data.message);
            }
        } catch (e) {
            console.error("handleLeaveTeam failed : ",e)
        }
    }
    return (
        <div className='teamsettings-inner'>
            <div className='teamsettings-hedaer'>팀 탈퇴</div>
            <div className={'unsubscribe-btn-box'}>
                <button className='unsubscribe-btn' onClick={()=>handleLeaveTeam()}>팀 탈퇴하기</button>
            </div>
        </div>
    );
};

export default Personal;