import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/documents.css';

const Documents = () => {
    const [view, setView] = useState('all');
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('/docs');
            setDocuments(response.data);
        } catch (error) {
            console.error("서버에서 문서를 불러오는데 실패하였습니다.", error);
        }
    };

    const handleMenuClick = (view) => {
        setView(view);
    };

    return (
        <div className="container">
            <div className="sidebar">
                <h2>사이드바</h2>
                <form>
                    <button type='button' className="docSubmit" onClick={() => handleMenuClick('new')}>작성하기</button>
                    <hr />
                    <ul className="menu">
                        <li><button type='button' onClick={() => handleMenuClick('all')}>전체</button></li>
                        <li><button type='button' onClick={() => handleMenuClick('pending')}>대기</button></li>
                        <li><button type='button' onClick={() => handleMenuClick('approved')}>승인</button></li>
                        <li><button type='button' onClick={() => handleMenuClick('rejected')}>거절</button></li>
                    </ul>
                </form>
            </div>
            <div className="main">
                {view === 'new' ? (
                    <div className="newDocument">
                        <h2>기본 설정</h2>
                        <form>
                            <label>
                                문서 종류:
                                <select>
                                    <option value="draft">빈 문서</option>
                                    <option value="draft">기안서</option>
                                    <option value="expense">지출 결의서</option>
                                    <option value="incident">시말서</option>
                                    <option value="resignation">사직서</option>
                                </select>
                            </label>
                            <label>
                                보안등급:
                                <select>
                                    {[...Array(10).keys()].map((number) => (
                                        <option key={number} value={number}>{number}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                작성일: <input type="date" />
                            </label>
                            <label>
                                보존 연한:
                                <select>
                                    <option value="1 year">1년</option>
                                    <option value="2 years">2년</option>
                                    <option value="3 years">3년</option>
                                    <option value="5 years">5년</option>
                                    <option value="permanent">영구</option>
                                </select>
                            </label>
                        </form>
                        <h2>결재선</h2>
                        <table className="approvalTable">
                            <thead>
                            <tr>
                                <th>팀원</th>
                                <th>시니어</th>
                                <th>대표이사</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>팀원1</td>
                                <td>시니어1</td>
                                <td>대표1</td>
                            </tr>
                            <tr>
                                <td>팀원2</td>
                                <td>시니어2</td>
                                <td>대표2</td>
                            </tr>
                            </tbody>
                        </table>
                        <h2>본문</h2>
                        <textarea className="documentBody">문서를 작성해주세요.</textarea>
                    </div>
                ) : (
                    <div className="documentList">
                        <h2>문서 목록</h2>
                        <table className="docTable">
                            <thead>
                            <tr>
                                <th>문서 번호</th>
                                <th>문서 종류</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                                <th>완료일</th>
                            </tr>
                            </thead>
                            <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.docNum}>
                                    <td>{doc.docNum}</td>
                                    <td>{doc.docType}</td>
                                    <td>{doc.docTitle}</td>
                                    <td>{doc.creComEmpNum}</td>
                                    <td>{doc.docDate}</td>
                                    <td>{doc.completedDate}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Documents;