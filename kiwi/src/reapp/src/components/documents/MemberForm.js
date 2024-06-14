import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

const MemberForm = ({ memberId }) => {
    const [formData, setFormData] = useState({
        employeeNo: '',
        name: '',
        gender: '',
        birthDate: '',
        empDate: '',
        quitDate: '',
        phone: '',
        address: '',
        deptName: '',
        title: '',
        position: '',
        docSecurity: '9',
        dayOff: '',
        usedDayOff: '',
        companyNum: '',
        memberId: ''
    });

    useEffect(() => {
        if (memberId) {
            fetchMember(memberId);
        }
    }, [memberId]);

    const fetchMember = async (id) => {
        try {
            const response = await axios.get(`/api/members/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching member:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (memberId) {
                await axios.put(`/api/members/${memberId}`, formData);
            } else {
                await axios.post('/api/members', formData);
            }
            // 처리 후 화면을 다시 로드하거나 다른 작업을 수행할 수 있음
        } catch (error) {
            console.error('Error saving member:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/api/members/${memberId}`);
                // 삭제 후의 작업을 수행 (예: 리스트에서 삭제된 항목 제거)
            } catch (error) {
                console.error('Error deleting member:', error);
            }
        }
    };

    return (
        <form className="member-form" onSubmit={handleSubmit}>
            <label>회원아이디</label>
            <input type="text" name="memberId" value={formData.memberId} onChange={handleChange}/>

            <label>이름</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}/>

            <label>연락처</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange}/>

            <label>사번</label>
            <input type="text" name="employeeNo" value={formData.employeeNo} onChange={handleChange}/>

            <label>부서</label>
            <input type="text" name="departmentName" value={formData.departmentName} onChange={handleChange}/>

            <label>직위</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange}/>

            <label>직책</label>
            <input type="text" name="position" value={formData.position} onChange={handleChange}/>

            <label>보안등급</label>
            <input type="text" name="securityLevel" value={formData.securityLevel} onChange={handleChange}/>

            <label>입사일</label>
            <input type="text" name="hireDate" value={formData.hireDate} onChange={handleChange}/>

            <label>퇴사일</label>
            <input type="text" name="resignDate" value={formData.resignDate} onChange={handleChange}/>

            <label>성별</label>
            <input type="text" name="gender" value={formData.gender} onChange={handleChange}/>

            <label>생년월일</label>
            <input type="text" name="birthDate" value={formData.birthDate} onChange={handleChange}/>

            <label>주소</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange}/>

            {/*<label>연차일수</label>*/}
            {/*<input type="text" name="annualLeaveDays" value={formData.annualLeaveDays} onChange={handleChange}/>*/}

            {/*<label>사용연차일수</label>*/}
            {/*<input type="text" name="usedAnnualLeaveDays" value={formData.usedAnnualLeaveDays} onChange={handleChange}/>*/}

            {/*<label>회사번호</label>*/}
            {/*<input type="text" name="companyNumber" value={formData.companyNumber} onChange={handleChange}/>*/}

            <button type="submit">{memberId ? '수정' : '등록'}</button>
            {memberId && <button type="button" onClick={handleDelete}>삭제</button>}
        </form>
    );
};

export default MemberForm;