import React, { useState } from 'react';
import ApprovalLineModal from './ApprovalLineModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const NewDocument = ({ author }) => {
    const [showApprovalLineModal, setShowApprovalLineModal] = useState(false);
    const [approvalLine, setApprovalLine] = useState({ approvers: [], references: [] });
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const [newDocument, setNewDocument] = useState({
        docType: '',
        retentionPeriod: '',
        accessLevel: '',
        title: '',
        content: '',
        attachment: null,
        name: author
    });

    const handleTooltipMouseEnter = () => {
        setTooltipVisible(true);
    };

    const handleTooltipMouseLeave = () => {
        setTooltipVisible(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDocument({ ...newDocument, [name]: value });
    };

    const handleFileChange = (e) => {
        setNewDocument({ ...newDocument, attachment: e.target.files[0] });
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('docType', newDocument.docType);
            formData.append('retentionPeriod', newDocument.retentionPeriod);
            formData.append('accessLevel', newDocument.accessLevel);
            formData.append('title', newDocument.title);
            formData.append('content', newDocument.content);
            formData.append('attachment', newDocument.attachment);
            formData.append('name', newDocument.name);

            await axios.post('/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("문서가 성공적으로 저장되었습니다.");
        } catch (error) {
            console.error("문서 저장 중 오류가 발생했습니다.", error);
        }
    };

    const getExampleContent = (docType) => {
        switch (docType) {
            case '품의서':
                return '(삭제 후 작성해주세요.)\n\n품의서 예시 내용: ';
            case '지각사유서':
                return '(삭제 후 작성해주세요.)' +
                    '\n\n지각사유서 예시 내용: ' +
                    '\n\n2024년 01월 01일' +
                    '\n\n(늦잠)으로 인해 (30분) 지각하였습니다. 죄송합니다.' +
                    '\n\n(이름)';
            case '연차신청서':
                return '(삭제 후 작성해주세요.)' +
                    '\n\n연차신청서 예시 내용: ' +
                    '\n\n2024년 01월 01일부터 2024년 01월 04일까지' +
                    '\n\n연차 신청합니다.' +
                    '\n\n(이름)';
            case '지출결의서':
                return '(삭제 후 작성해주세요.)' +
                    '\n\n지출결의서 예시 내용: ' +
                    '\n\n2024년 01월 01일' +
                    '\n\n(이름)';
            case '시말서':
                return '(삭제 후 작성해주세요.)' +
                    '\n\n시말서 예시 내용: ';
            case '사직서':
                return '(삭제 후 작성해주세요.)' +
                    '\n\n사직서 예시 내용: ';
            default:
                return '';
        }
    };
    const handleDocTypeChange = (e) => {
        const { value } = e.target;
        setNewDocument({ ...newDocument, docType: value, content: getExampleContent(value) });
    };

    const handleApprovalLineSave = (line) => {
        setApprovalLine(line);
        setShowApprovalLineModal(false);
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
                <label>열람 권한 등급
                    <div
                        className="tooltipIcon"
                        onMouseEnter={handleTooltipMouseEnter}
                        onMouseLeave={handleTooltipMouseLeave}
                    >
                        <FontAwesomeIcon icon={faQuestionCircle}/>
                        {tooltipVisible && (
                            <span className="tooltipText">
                            S 등급 : 관련자들만 문서를 열람<br/>
                            A 등급 : 관련자 및 2등급(부장, 이사, 사내이사, 본부장) 이상인 사람만 열람<br/>
                            B 등급 : 관련자 및 3등급(팀장, PA) 이상인 사람만 열람<br/>
                            C 등급 : 모든 임직원이 문서를 열람
                        </span>
                        )}
                    </div>
                </label>
                <select name="accessLevel" onChange={handleInputChange}>
                    <option value="">등급을 선택해주세요.</option>
                    <option value="C">C</option>
                    <option value="B">B</option>
                    <option value="A">A</option>
                    <option value="S">S</option>
                </select>
            </div>
            <button type="button" onClick={() => setShowApprovalLineModal(true)}>결재선 설정</button>
            <div id="approvalDocumentLine">
                <table className="cal_table1 approve-write js-approval-line">
                    <colgroup>
                        <col style={{width: '10%'}}/>
                        <col style={{width: '30%'}}/>
                        <col style={{width: '10%'}}/>
                        <col style={{width: '50%'}}/>
                    </colgroup>
                    <tbody>
                    <tr>
                        <th scope="row" className="agree">
                            <div className="choice">신청</div>
                        </th>
                        <td className="confer vt" id="approvalFirstLine">
                            <table>
                                <colgroup>
                                    <col/>
                                    <col/>
                                    <col/>
                                </colgroup>
                                <tbody>
                                <tr>
                                    <td className="team name"></td>
                                    <td className="team name"></td>
                                    <td className="team name"></td>
                                </tr>
                                <tr>
                                    <td className="stamp"></td>
                                    <td className="stamp"></td>
                                    <td className="stamp"></td>
                                </tr>
                                <tr>
                                    <td className="name">{author}</td>
                                    <td className="name"></td>
                                    <td className="name"></td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                        <th scope="row" className="confer">
                            <div className="choice">처리</div>
                        </th>
                        <td className="confer vt" id="approvalSecondLine">
                            <table>
                                <colgroup>
                                    <col/>
                                    <col/>
                                    <col/>
                                    <col/>
                                </colgroup>
                                <tbody>
                                <tr>
                                    <td className="team name"></td>
                                    <td className="team name"></td>
                                    <td className="team name"></td>
                                    <td className="team name"></td>
                                    <td className="team name"></td>
                                </tr>
                                <tr>
                                    <td className="stamp"></td>
                                    <td className="stamp"></td>
                                    <td className="stamp"></td>
                                    <td className="stamp"></td>
                                    <td className="stamp"></td>
                                </tr>
                                <tr>
                                    <td className="name">{approvalLine.approvers[0]?.name || ''}</td>
                                    <td className="name"></td>
                                    <td className="name"></td>
                                    <td className="name"></td>
                                    <td className="name"></td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table className="cal_table1 approve-write refer">
                    <colgroup>
                        <col style={{width: '12.09%'}}/>
                        <col style={{width: '87.91%'}}/>
                    </colgroup>
                    <tbody>
                    <tr>
                        <th scope="row">참조</th>
                        <td id="approvalThirdLine">

                        </td>
                    </tr>
                    </tbody>
                </table>
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
                <input type="file" name="attachment" onChange={handleFileChange}/>
            </div>
            <button type="button" onClick={handleSubmit}>제출하기</button>

            {showApprovalLineModal && (
                <ApprovalLineModal
                    onClose={() => setShowApprovalLineModal(false)}
                    onSave={handleApprovalLineSave}
                />
            )}
        </div>
    );
};

export default NewDocument;