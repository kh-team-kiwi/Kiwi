import React, { useState } from 'react';
import axios from 'axios';
import './css/Regist.css';
import {useNavigate} from "react-router-dom";

const Regist = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        memberId: '',
        memberPw: '',
        confirmPw: '',
        memberFilepath: '',
        memberNickname: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 제출 시 기본 동작인 페이지 리로드를 막음

        // 회원가입 요청 보내기
        const response = await axios.post('/api/auth/signup', formData)
            .then((res)=>{
                if(res.data.result){
                    console.log('회원가입 성공:', res.data);
                    navigate('/',{replace:true});
                } else {
                    console.error('회원가입 실패:', res.data);
                }

            }).catch((err)=>{
                console.error("회원가입 실패:",err)
            });
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h2>회원가입</h2>
                <div>
                    <label htmlFor="memberId">아이디:</label>
                    <input type="text" id="memberId" name="memberId" value={formData.memberId} onChange={handleChange}
                           required/>
                </div>
                <div>
                    <label htmlFor="memberPw">비밀번호:</label>
                    <input type="password" id="memberPw" name="memberPw" value={formData.memberPw}
                           onChange={handleChange} required/>
                </div>
                <div>
                    <label htmlFor="confirmPw">비밀번호 확인:</label>
                    <input type="password" id="confirmPw" name="confirmPw" value={formData.confirmPw}
                           onChange={handleChange} required/>
                </div>
                <div>
                    <label htmlFor="memberFilepath">프로필 사진:</label>
                    <input type="file" id="memberFilepath" name="memberFilepath" accept="image/*"
                           onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="memberNickname">닉네임:</label>
                    <input type="text" id="memberNickname" name="memberNickname" value={formData.memberNickname}
                           onChange={handleChange} required/>
                </div>
                <button type="submit">가입하기</button>
            </form>
        </div>
    );
};

export default Regist;
