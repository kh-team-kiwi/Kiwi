import React, {useEffect, useState} from 'react';
import '../styles/pages/Main.css';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {getSessionItem, removeLocalItem, removeSessionItem} from "../jwt/storage";
import axios from "axios";
import axiosHandler from "../jwt/axiosHandler";


// CreateTeam 모달 컴포넌트
const CreateTeam = ({show, handleClose, handleSubmit, inputValue, setInputValue}) => {
    return (
        <div className={`create-team-modal ${show ? 'create-team-display-block' : 'create-team-display-none'}`}>
            <div className='create-team-modal-inner'>
            <div className="create-team-modal-main">
                <h2>Create Team</h2>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter text"
                />
                <button onClick={handleSubmit}>Send</button>
                <button onClick={handleClose}>Close</button>
                <div><span className='main-create-team-duplicate'></span></div>
            </div>
            </div>
        </div>
    );
}

function Main() {

    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleSubmit = () => {
        alert(`Submitted: ${inputValue}`);
        setInputValue('');
        handleClose();
    };

    const user = getSessionItem("profile");

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
                    <button className="create-team" onClick={handleShow}>+ 팀 생성하기</button>
                </li>
            </ul>
            </div>
            <CreateTeam
                show={show}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                inputValue={inputValue}
                setInputValue={setInputValue}
            />
        </div>
    );
}

export default Main;