import React, { useState } from 'react';
import axios from 'axios';
import './Regist.css';

const Regist = () => {
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
        try {
            const response = await axios.post('/api/auth/signUp', formData);

            // 회원가입 성공 시 처리
            console.log('회원가입 성공:', response.data);
            // 추가적으로 필요한 작업 수행
        } catch (error) {
            // 회원가입 실패 시 처리
            console.error('회원가입 실패:', error);
            // 추가적으로 필요한 작업 수행
        }
    };

    return (
        <div className="container">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="memberId">아이디:</label>
                    <input type="text" id="memberId" name="memberId" value={formData.memberId} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="memberPw">비밀번호:</label>
                    <input type="password" id="memberPw" name="memberPw" value={formData.memberPw} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="confirmPw">비밀번호 확인:</label>
                    <input type="password" id="confirmPw" name="confirmPw" value={formData.confirmPw} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="memberFilepath">프로필 사진:</label>
                    <input type="file" id="memberFilepath" name="memberFilepath" accept="image/*" onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="memberNickname">닉네임:</label>
                    <input type="text" id="memberNickname" name="memberNickname" value={formData.memberNickname} onChange={handleChange} required />
                </div>
                <button type="submit">가입하기</button>
            </form>
        </div>
    );
};

export default Regist;
