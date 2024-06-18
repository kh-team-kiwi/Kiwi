import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/components/documents/MemberForm.css';

const MemberForm = ({ selectedMember, onSave, onDelete }) => {
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
        docSecurity: '9'
    });

    useEffect(() => {
        if (selectedMember) {
            setFormData({
                ...selectedMember,
                birthDate: selectedMember.birthDate ? selectedMember.birthDate.split('T')[0] : '',
                empDate: selectedMember.empDate ? selectedMember.empDate.split('T')[0] : '',
                quitDate: selectedMember.quitDate ? selectedMember.quitDate.split('T')[0] : ''
            });
        }
    }, [selectedMember]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleDelete = () => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            onDelete(formData.employeeNo);
        }
    };

    return (
        <form className="member-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>회원아이디</label>
                <input type="text" name="memberId" value={formData.memberId} onChange={handleChange} disabled/>
            </div>
            <div className="form-group">
                <label>이름</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label>연락처</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label>사번</label>
                <input type="text" name="employeeNo" value={formData.employeeNo} onChange={handleChange} disabled/>
            </div>
            <div className="form-group">
                <label>부서</label>
                <input type="text" name="deptName" value={formData.deptName} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label>직위</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label>직책</label>
                <input type="text" name="position" value={formData.position} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label>보안등급</label>
                <input type="text" name="docSecurity" value={formData.docSecurity} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label>입사일</label>
                <input type="date" name="empDate" value={formData.empDate} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label>퇴사일</label>
                <input type="date" name="quitDate" value={formData.quitDate} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label>성별</label>
                <input type="text" name="gender" value={formData.gender} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label>생년월일</label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label>주소</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange}/>
            </div>
            <div className="form-actions">
                <button type="submit">수정</button>
                {selectedMember && <button type="button" onClick={handleDelete}>삭제</button>}
            </div>
        </form>
    );
};

export default MemberForm;
