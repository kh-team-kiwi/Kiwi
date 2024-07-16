import React, { useState, useEffect } from 'react';
import ApprovalLineModal from './ApprovalLineModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/components/documents/NewDocument.css';
import axiosHandler from "../../jwt/axiosHandler";
import { toast } from 'react-toastify';


const NewDocument = ({ onDocumentSubmit }) => {
    const [showApprovalLineModal, setShowApprovalLineModal] = useState(false);
    const [approvalLine, setApprovalLine] = useState({ approvers: [], references: [] });
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [author, setAuthor] = useState({ name: '', department: '', position: '' });
    const [newDocument, setNewDocument] = useState({
        docType: '',
        retentionPeriod: '',
        accessLevel: '',
        title: '',
        content: '',
        attachment: null,
        name: '',
        memberId: '',
        docDate: new Date().toISOString()
    });

    useEffect(() => {
        const profile = JSON.parse(sessionStorage.getItem('profile'));
        console.log("Session profile:", profile);

        if (profile) {
            const { username } = profile;
            console.log("Username from session:", username);

            axios.get(`/api/members/details/${username}`)
                .then((response) => {
                    console.log("API response:", response.data);
                    if (response.data) {
                        const { name, deptName, position } = response.data;
                        setAuthor({
                            name: name || 'N/A',
                            department: deptName || 'N/A',
                            position: position || 'N/A'
                        });
                        setNewDocument((prevState) => ({
                            ...prevState,
                            name: name || 'N/A',
                            memberId: username
                        }));
                    } else {
                        toast.error("인사 정보에 등록해야합니다. 인사 담당자에게 문의하세요.");
                        window.location.href = "/";
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch user data:", error);
                    toast.error("인사 정보에 등록해야합니다. 인사 담당자에게 문의하세요.");
                    window.location.href = "/documents/all-documents";
                });
        }
    }, []);

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
            const docData = {
                docType: newDocument.docType,
                retentionPeriod: newDocument.retentionPeriod, // 추가된 필드
                accessLevel: newDocument.accessLevel, // 추가된 필드
                docTitle: newDocument.title,
                docContents: newDocument.content,
                name: newDocument.name,
                employeeNo: newDocument.memberId,
                docDate: new Date().toISOString().slice(0, 19),
                docStatus: "진행중"
            };

            if (!newDocument.title || newDocument.title.trim() === '') {
                toast.error("문서 제목을 입력해 주세요.");
                return;
            }

            formData.append('doc', new Blob([JSON.stringify(docData)], { type: 'application/json' }));

            // 결재자와 참조자 정보를 추가
            const approvalLineData = {
                approvers: approvalLine.approvers.map((approver, index) => ({
                    employeeNo: approver.employeeNo,
                    name: approver.name,
                    position: approver.position
                })),
                references: approvalLine.references.map(ref => ({
                    employeeNo: ref.employeeNo,
                    memberId: ref.memberId,
                    name: ref.name,
                    position: ref.position
                }))
            };

            formData.append('approvalLine', new Blob([JSON.stringify(approvalLineData)], { type: 'application/json' }));

            if (newDocument.attachment) {
                formData.append('attachment', newDocument.attachment);
            }

            const response = await axiosHandler.post('/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Document saved successfully:', response.data);
            toast.success("문서가 성공적으로 저장되었습니다.");

            // 문서 제출 후 상태 업데이트를 위해 콜백 호출
            if (onDocumentSubmit) {
                onDocumentSubmit();
            }
        } catch (error) {
            console.error("문서 저장 중 오류가 발생했습니다.", error);
            toast.error("문서 저장 중 오류가 발생했습니다.");
        }
    };


    const handleSaveClick = () => {
        if (!newDocument.title || newDocument.title.trim() === '') {
            toast.error("문서 제목을 입력해 주세요.");
            return;
        }
        handleSubmit();
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
                        <span className="author-name">{author.name || 'N/A'}</span>
                        <span className="author-department">{author.department || 'N/A'}</span>
                        <span className="author-position">{author.position || 'N/A'}</span>
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
            <button type="button" className="approval-button" onClick={() => setShowApprovalLineModal(true)}>결재선 설정
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
                                <tbody>
                                <tr>
                                    <td className="team name">{author.position}</td>
                                    <td className="team name"></td>
                                    <td className="team name"></td>
                                </tr>
                                <tr>
                                    <td className="stamp"></td>
                                    <td className="stamp"></td>
                                    <td className="stamp"></td>
                                </tr>
                                <tr>
                                    <td className="name">{author.name}</td>
                                    <td className="name"></td>
                                    <td className="name"></td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                        <th scope="row" className="process">
                            <div className="choice">결재</div>
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
                                <span key={ref.memberId}>
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
