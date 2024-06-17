import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {getSessionItem, removeLocalItem, removeSessionItem} from "../jwt/storage";
import axiosHandler from "../jwt/axiosHandler";
import CreateTeam from "../components/main/CreateTeam";

function Main() {


    const navigate = useNavigate();
    const teams = [
        {
            id: 1,
            name: '팀 이름',
            image: '팀 이미지 URL',
            adminEmail: 'admin@example.com',
        }
    ];

    // useEffect(() => {
    //     if (inputValue !== '') {
    //         const fetchData = async () => {
    //             try {
    //                 const response = await axios.get(`/api/your-endpoint?query=${inputValue}`);
    //                 console.log(response.data);
    //             } catch (error) {
    //                 console.error('Error fetching data:', error);
    //             }
    //         };
    //         fetchData();
    //     }
    // }, [inputValue]);

    const user = getSessionItem("profile");

    async function logoutBtn(){

        const response = await axiosHandler.post("/api/auth/logout");
        if (response.status === 200) {
            removeLocalItem("accessToken");
            removeSessionItem("profile");
            localStorage.getItem("")
            navigate('/login');
        }
    }

    return (
        <div className="mainpage">
            <div className="inner">

            <div className="profile">
                <img src={user.filepath ? user.filepath : ''} />
                <div>
                    <p>{user.role}</p>
                    <p>{user.name}</p>
                </div>
                <div className="mainpage-profile-box3">
                    <Link to="/regist">계정설정</Link>
                    <button onClick={logoutBtn}>logout</button>
                </div>

            </div>

            {/* 팀 리스트 구역 */}
            <ul className="team-list">
                {/* 소속된 팀 목록 */}
                {teams.map(team => (
                    <li key={team.id} className="team-item">
                        {/* 팀 이미지 */}
                        <img src={team.image} />
                        <div>
                            {/* 팀 이름 */}
                            <p>{team.name}</p>
                            {/* 팀 관리자 이메일 */}
                            <p>관리자: {team.adminEmail}</p>
                        </div>
                        {/* 팀 관리 버튼 */}
                        <button>팀 관리</button>

                        {/* 팀으로 가기 버튼 */}
                        <button>팀으로 가기</button>
                    </li>
                ))}

                {/* 팀 생성하기 버튼 */}
                <li>
                    {/*<button className="create-team" onClick={handleShow}>+ 팀 생성하기</button>*/}
                </li>
            </ul>
            </div>
            <CreateTeam  />
        </div>
    );
}

export default Main;