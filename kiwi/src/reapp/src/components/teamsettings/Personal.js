import React, {useContext} from 'react';
import '../../styles/components/teamsettings/Personal.css'
import {TeamContext} from "../../context/TeamContext";
import axiosHandler from "../../jwt/axiosHandler";
import {getSessionItem} from "../../jwt/storage";
import {useParams} from "react-router-dom";

const Personal = () => {
    const { teamno } = useParams();

    const handleLeaveTeam = async () => {
        const dto = {
            memberId : getSessionItem("profile").memberId,
            team : {teamno}
        }
        try{
            const res = axiosHandler.post("api/team/leaveTeam",{dto});

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