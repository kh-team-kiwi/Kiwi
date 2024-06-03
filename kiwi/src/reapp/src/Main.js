import React from 'react';
import './css/Main.css';
import {Link} from "react-router-dom"; // 외부 CSS 파일 import

function Main() {
    // 사용자 정보
    const user = JSON.parse(sessionStorage.getItem('userInfo'));

    // 팀 리스트
    const teams = [
        {
            id: 1,
            name: '팀 이름',
            image: '팀 이미지 URL',
            adminEmail: 'admin@example.com',
        }
    ];

    return (
        <div className="mainpage">
            <div className="inner">

            <div className="profile">
                <img src={user.profileImage} />
                <div>
                    <p>{user.memberNickname}</p>
                    <p>{user.memberId}</p>
                </div>
                <Link to="/regist">계정설정</Link>
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
                    <button className="create-team">+ 팀 생성하기</button>
                </li>
            </ul>
            </div>
        </div>
    );
}

export default Main;
