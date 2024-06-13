import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const NewDocument = () => {
    const [tooltipText, setTooltipText] = useState(''); // 도움말 텍스트 상태

    const handleTooltip = (accessLevel) => {
        // accessLevel에 따라 도움말 텍스트 설정
        switch (accessLevel) {
            case 'C':
                setTooltipText('C 등급: 모든 임직원이 문서를 열람.');
                break;
            case 'B':
                setTooltipText('B 등급: 관련자들과 관리자가 설정한 3등급(팀장,PA)등급 이상인 사람만 열람.');
                break;
            case 'A':
                setTooltipText('A 등급: 관련자들과 관리자가 설정한 2등급(부장, 이사, 사내이사, 본부장)등급 이상인 사람만 열람.');
                break;
            case 'S':
                setTooltipText('S 등급: 관련자들만 문서를 볼 수 있음');
                break;
            default:
                setTooltipText('');
                break;
        }
    };

    const [newDocument, setNewDocument] = useState({
        docType: '',
        retentionPeriod: '',
        accessLevel: '',
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

    // 예시 내용을 각 문서 종류에 맞게 설정
    const getExampleContent = (docType) => {
        switch (docType) {
            case '품의서':
                return '품의서 예시 내용: ';
            case '지각사유서':
                return '지각사유서 예시 내용: ' +
                    '\n' + '\n' +
                    '2024년 01월 01일'+
                    '\n' + '\n' +
                    '(늦잠)으로 인해 (30분) 지각하였습니다. 죄송합니다.' +
                    '\n' + '\n' +
                    '(이름)';
            case '연차신청서':
                return '연차신청서 예시 내용: ' +
                    '\n' + '\n' +
                    '2024년 01월 01일부터 2024년 01월 04일까지'+
                    '\n' + '\n' +
                    '연차 신청합니다.' +
                    '\n' + '\n' +
                    '(이름)';
            case '지출결의서':
                return '지출결의서 예시 내용: ' +
                    '\n' + '\n' +
                    '2024년 01월 01일'+
                    '\n' + '\n' +
                    '' +
                    '\n' + '\n' +
                    '(이름)';
            case '시말서':
                return '시말서 예시 내용: ';
            case '사직서':
                return '사직서 예시 내용: ';
            default:
                return '';
        }
    };

    // 문서 종류가 변경될 때 예시 내용을 textarea에 설정
    const handleDocTypeChange = (e) => {
        const { value } = e.target;
        setNewDocument({ ...newDocument, docType: value, content: getExampleContent(value) });
    };

    return (
        <div className="newDocument">
            <div className="formGroup">
                <label>문서 종류</label>
                <select name="docType" onChange={handleDocTypeChange}>
                    <option value="">문서를 선택해주세요.</option>
                    <option value="품의서">품의서</option>
                    <option value="지각사유서">지각사유서</option>
                    <option value="연차신청서">연차신청서</option>
                    <option value="지출결의서">지출결의서</option>
                    <option value="시말서">시말서</option>
                    <option value="사직서">사직서</option>
                </select>
            </div>
            <div className="formGroup">
                <label>보존 기간</label>
                <select name="retentionPeriod" onChange={handleInputChange}>
                    <option value="">보존 기간을 선택해주세요.</option>
                    <option value="1년">1년</option>
                    <option value="2년">2년</option>
                    <option value="3년">3년</option>
                    <option value="5년">5년</option>
                    <option value="영구">영구</option>
                </select>
            </div>
            <div className="formGroup">
                <label>열람 권한 등급</label>
                <select
                    name="accessLevel"
                    onChange={(e) => {
                        handleInputChange(e);
                        handleTooltip(e.target.value); // 선택된 값에 따라 도움말 설정
                    }}
                >
                    <option value="">등급을 선택해주세요.</option>
                    <option value="C">C</option>
                    <option value="B">B</option>
                    <option value="A">A</option>
                    <option value="S">S</option>
                </select>
                {/* ? 아이콘과 Tooltip */}
                <span className="tooltipIcon">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    <span className="tooltipText">{tooltipText}</span>
                </span>
            </div>
            <div className="formGroup">
                <label>제목</label>
                <input type="text" name="title" onChange={handleInputChange}/>
            </div>
            <div className="formGroup">
                <label>내용</label>
                <textarea name="content" value={newDocument.content} onChange={handleInputChange}></textarea>
            </div>
            <div className="formGroup">
                <label>파일 첨부</label>
                <input type="file" name="attachment" onChange={handleFileChange} />
            </div>
            <button onClick={handleSubmit}>제출하기</button>
        </div>
    );
};

export default NewDocument;
