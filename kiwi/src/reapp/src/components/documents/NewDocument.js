import React, { useState } from 'react';

const NewDocument = () => {
    const [newDocument, setNewDocument] = useState({
        docType: '',
        retentionPeriod: '1년',
        accessLevel: '0',
        title: '',
        content: '',
        attachment: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDocument({ ...newDocument, [name]: value });
    };

    const handleFileChange = (e) => {
        setNewDocument({ ...newDocument, attachment: e.target.files[0] });
    };

    const handleSubmit = () => {
        // handle document submission logic
    };

    return (
        <div className="newDocument">
            <div className="formGroup">
                <label>문서 종류</label>
                <select name="docType" onChange={handleInputChange}>
                    <option value="품의서">품의서</option>
                    <option value="지각사유서">지각사유서</option>
                    <option value="연차신청서">연차신청서</option>
                </select>
            </div>
            <div className="formGroup">
                <label>보존 연한</label>
                <select name="retentionPeriod" onChange={handleInputChange}>
                    <option value="1년">1년</option>
                    <option value="2년">2년</option>
                    <option value="3년">3년</option>
                    <option value="4년">4년</option>
                    <option value="5년">5년</option>
                    <option value="영구">영구</option>
                </select>
            </div>
            <div className="formGroup">
                <label>열람 권한 등급</label>
                <select name="accessLevel" onChange={handleInputChange}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                </select>
            </div>
            <div className="formGroup">
                <label>제목</label>
                <input type="text" name="title" onChange={handleInputChange} />
            </div>
            <div className="formGroup">
                <label>내용</label>
                <textarea name="content" onChange={handleInputChange}></textarea>
            </div>
            <div className="formGroup">
                <label>파일 첨부</label>
                <input type="file" name="attachment" onChange={handleFileChange} />
            </div>
            <button onClick={handleSubmit}>제출하기</button>
        </div>
    );
}

export default NewDocument;
