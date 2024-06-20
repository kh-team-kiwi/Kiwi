import React, { useState } from 'react';
import ApprovalLineModal from './ApprovalLineModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/components/documents/NewDocument.css';

const NewDocument = ({ author = { name: '', department: '', position: '' } }) => {
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
        name: author?.name || '',
        docDate: new Date().toISOString() // 현재 시간을 ISO 형식으로 추가
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();

            // 기본 값 설정 로직 추가
            const employeeNo = newDocument.employeeNo && newDocument.employeeNo.trim() !== '' ? newDocument.employeeNo : '1@kimcs';

            const docData = {
                docType: newDocument.docType,
                retentionPeriod: newDocument.retentionPeriod,
                accessLevel: newDocument.accessLevel,
                title: newDocument.title,
                content: newDocument.content,
                name: newDocument.name,
                employeeNo: employeeNo, // 기본 값이 설정된 employeeNo 사용
                docDate: new Date().toISOString().slice(0, 19), // ISO 형식의 끝 'Z' 제거
                docStatus: "진행중" // 기본 상태로 설정
            };

            // docTitle이 비어 있으면 경고 메시지 표시
            if (!newDocument.title || newDocument.title.trim() === '') {
                alert("문서 제목을 입력해 주세요.");
                return;
            }

            // JSON을 문자열로 변환하고 Blob으로 감싸서 FormData에 추가합니다.
            formData.append('doc', new Blob([JSON.stringify(docData)], { type: 'application/json' }));

            // 파일이 있을 경우에만 FormData에 추가합니다.
            if (newDocument.attachment) {
                formData.append('attachment', newDocument.attachment);
            }

            // Axios로 POST 요청을 보냅니다.
            await axios.post('/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("문서가 성공적으로 저장되었습니다.");
        } catch (error) {
            console.error("문서 저장 중 오류가 발생했습니다.", error);
            alert("문서 저장 중 오류가 발생했습니다.");
        }
    };


    // 문서 저장 버튼 클릭 시
    const handleSaveClick = () => {
        if (!newDocument.title || newDocument.title.trim() === '') {
            alert("문서 제목을 입력해 주세요.");
            return;
        }
        handleSubmit();
    };






    // 문서 종류에 따른 예시 내용을 반환
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

    const getExampleTitle = (docType) => {
        switch (docType) {
            case '품의서':
                return '신규 사업 제안서 - (이름)';
            case '지각사유서':
                return '00년 00월 00일 지각 사유서 - (이름)';
            case '연차신청서':
                return '연차 신청서 - (이름)';
            case '지출결의서':
                return '(지출 이름) 지출 결의서 - (이름)';
            case '시말서':
                return '00년 00월 00일 (이슈 이름) 시말서 - (이름)';
            case '사직서':
                return '사직서 제출 - (이름)';
            default:
                return '';
        }
    };

    const handleDocTypeChange = (e) => {
        const { value } = e.target;
        setNewDocument({
            ...newDocument,
            docType: value,
            content: getExampleContent(value),
            title: getExampleTitle(value)
        });
    };

    const handleApprovalLineSave = (line) => {
        setApprovalLine(line);
        setShowApprovalLineModal(false);
    };

    return (
        <div className="newDocument">
            <table className="tableType02">
                <colgroup>
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '35%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '35%' }} />
                </colgroup>
                <tbody>
                <tr>
                    <th scope="row">문서 종류</th>
                    <td>
                        <select name="docType" onChange={handleDocTypeChange}>
                            <option value="">문서를 선택해주세요.</option>
                            <option value="품의서">품의서</option>
                            <option value="지각사유서">지각사유서</option>
                            <option value="연차신청서">연차신청서</option>
                            <option value="지출결의서">지출결의서</option>
                            <option value="시말서">시말서</option>
                            <option value="사직서">사직서</option>
                        </select>
                    </td>
                    <th scope="row">작성자</th>
                    <td>
                        <span className="author-name">{author?.name || '홍길동'}</span>
                        <span className="author-department">{author?.department || '개발부서'}</span>
                        <span className="author-position">{author?.position || '사원'}</span>
                    </td>
                </tr>
                <tr>
                    <th scope="row">보존 기간</th>
                    <td>
                        <select name="retentionPeriod" onChange={handleInputChange}>
                            <option value="">보존 기간을 선택해주세요.</option>
                            <option value="1년">1년</option>
                            <option value="2년">2년</option>
                            <option value="3년">3년</option>
                            <option value="5년">5년</option>
                            <option value="영구">영구</option>
                        </select>
                    </td>
                    <th scope="row">보안 등급
                        <div
                            className="tooltipIcon"
                            onMouseEnter={handleTooltipMouseEnter}
                            onMouseLeave={handleTooltipMouseLeave}
                        >
                            <FontAwesomeIcon icon={faQuestionCircle} />
                            {tooltipVisible && (
                                <span className="tooltipText">
                                        S 등급 : 관련자들만 문서를 열람<br />
                                        A 등급 : 관련자 및 2등급(부장, 이사, 사내이사, 본부장) 이상인 사람만 열람<br />
                                        B 등급 : 관련자 및 3등급(팀장, PA) 이상인 사람만 열람<br />
                                        C 등급 : 모든 임직원이 문서를 열람
                                    </span>
                            )}
                        </div>
                    </th>
                    <td>
                        <select name="accessLevel" onChange={handleInputChange}>
                            <option value="">보안 등급을 선택해주세요.</option>
                            <option value="S">S</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>
                    </td>
                </tr>
                </tbody>
            </table>
            <button type="button" className={"document-button"} onClick={() => setShowApprovalLineModal(true)}>결재선 설정
            </button>
            <div id="approvalDocumentLine">
                <table className="cal_table1 approve-write js-approval-line">
                    <colgroup>
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '50%' }} />
                    </colgroup>
                    <tbody>
                    <tr>
                        <th scope="row" className="apply">
                            <div className="choice">신청</div>
                        </th>
                        <td className="confer vt applyTable" id="approvalFirstLine">
                            <table className="teamTable">
                                <colgroup>
                                    <col />
                                    <col />
                                    <col />
                                </colgroup>
                                <tbody>
                                <tr>
                                    <td className="team name">{author.position}</td>
                                    <td className="team name">{author.position}</td>
                                    <td className="team name">{author.position}</td>
                                </tr>
                                <tr>
                                    <td className="stamp"></td>
                                    <td className="stamp"></td>
                                    <td className="stamp"></td>
                                </tr>
                                <tr>
                                    <td className="name">{author.name}</td>
                                    <td className="name">{author.name}</td>
                                    <td className="name">{author.name}</td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                        <th scope="row" className="process">
                            <div className="choice">처리</div>
                        </th>
                        <td className="confer vt processTable" id="approvalSecondLine">
                            <table className="teamTable">
                                <colgroup>
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                </colgroup>
                                <tbody>
                                <tr>
                                    <td className="team name">{approvalLine.approvers[0]?.position || ''}</td>
                                    <td className="team name">{approvalLine.approvers[1]?.position || ''}</td>
                                    <td className="team name">{approvalLine.approvers[2]?.position || ''}</td>
                                    <td className="team name">{approvalLine.approvers[3]?.position || ''}</td>
                                    <td className="team name">{approvalLine.approvers[4]?.position || ''}</td>
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
                                    <td className="name">{approvalLine.approvers[1]?.name || ''}</td>
                                    <td className="name">{approvalLine.approvers[2]?.name || ''}</td>
                                    <td className="name">{approvalLine.approvers[3]?.name || ''}</td>
                                    <td className="name">{approvalLine.approvers[4]?.name || ''}</td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table className="cal_table1 approve-write refer">
                    <colgroup>
                        <col style={{ width: '12.09%' }} />
                        <col style={{ width: '87.91%' }} />
                    </colgroup>
                    <tbody>
                    <tr>
                        <th scope="row">참조</th>
                        <td id="approvalThirdLine">
                            {approvalLine.references.map((ref, index) => (
                                <span key={ref.id}>
                                        {ref.name}
                                    {index < approvalLine.references.length - 1 ? ', ' : ''}
                                    </span>
                            ))}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="formGroup">
                <label>제목</label>
                <input type="text" name="title" value={newDocument.title} onChange={handleInputChange} />
            </div>
            <div className="formGroup">
                <label>내용</label>
                <textarea name="content" className={"content"} value={newDocument.content} onChange={handleInputChange}></textarea>
            </div>
            <div className="formGroup">
                <label>파일 첨부</label>
                <input type="file" name="attachment" onChange={handleFileChange} />
            </div>
            <button type="button" className={"document-button"} onClick={handleSubmit}>제출하기</button>

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
