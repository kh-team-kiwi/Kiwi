import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import ApprovalLineModal from "./ApprovalLineModal";

const DocumentDetails = ({ document, onClose }) => {
    const [docDetails, setDocDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocumentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/documents/details/${document.docNum}`);
                setDocDetails(response.data);
                setLoading(false);
            } catch (error) {
                setError('문서 세부 정보를 불러오는데 실패하였습니다.');
                setLoading(false);
            }
        };

        if (document.docNum) {
            fetchDocumentDetails();
        } else {
            setError('유효한 문서 번호가 제공되지 않았습니다.');
            setLoading(false);
        }
    }, [document.docNum]);

    if (loading) return <p>로딩중...</p>;
    if (error) return <p>{error}</p>;
    if (!docDetails) return null;

    return (
        <div className="documentDetails">

            <div className="formGroup">
                <label>상태 {docDetails.docStatus}</label>
            </div>

            <div className="formGroup">
                <label>작성일 {moment(docDetails.docDate).format('YYYY-MM-DD HH:mm')}</label>
            </div>

            <div className="formGroup">
                <label>완료일 {docDetails.docCompletion ? moment(docDetails.docCompletion).format('YYYY-MM-DD HH:mm') : ''}</label>
            </div>

            <div className="formGroup">
                <label>보존 기간</label>
            </div>

            <div className="formGroup">
                <label>열람 권한 등급</label>
            </div>

            <div className="formGroup">
                <label>작성자 {docDetails.name}</label>
            </div>

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
                                    <td className="name">{docDetails.name}</td>
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
                                    {/*<td className="name">{approvalLine.approvers[0]?.name || ''}</td>*/}
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
                <label><h2>{docDetails.docTitle}</h2></label>
            </div>
            <div className="formGroup">
                <label>{docDetails.docContents}</label>

            </div>
                <br/>
            <div className="formGroup">
                <label>파일 첨부</label>
                <br/>
            </div>
                <br/>

            {/*{showApprovalLineModal && (*/}
            {/*    <ApprovalLineModal*/}
            {/*        onClose={() => setShowApprovalLineModal(false)}*/}
            {/*        onSave={handleApprovalLineSave}*/}
            {/*    />*/}
            {/*)}*/}
            <button onClick={onClose}>뒤로가기</button>
        </div>
    );
};

export default DocumentDetails;