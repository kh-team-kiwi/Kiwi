import React, { useState } from 'react';
import axios from 'axios';


/////////////////////////////////////////HTML/////////////////////////////////////////
function Documents () {
    const [] = useState(

    )

    return (
        <div>
            <div>
                <h2 >사이드바</h2>
                <form>
                    <button style={styles.docSubmit} type='button' name='docSubmit'>작성하기</button>
                    <hr/>
                    <ul style={styles.myMenu}>
                        <li><button style={styles.myMenuLi} type='button' name='docInProgress'>문서함</button></li>
                        <li><button style={styles.myMenuLi} type='button' name='docAll'>전체</button></li>
                        <li><button style={styles.myMenuLi} type='button' name='docPending'>대기</button></li>
                        <li><button style={styles.myMenuLi} type='button' name='docApproval'>승인</button></li>
                        <li><button style={styles.myMenuLi} type='button' name='docReject'>거절</button></li>
                        <li><button style={styles.myMenuLi} type='button' name='docSubmit'>문서함</button></li>
                    </ul>
                </form>

            </div>
            <div>
              <h2>메인</h2>
                <table style={styles.table}>
                    <tr>
                        <th style={styles.th}>문서 번호</th>
                        <th style={styles.th}>문서 종류</th>
                        <th style={styles.th}>제목</th>
                        <th style={styles.th}>작성자</th>
                        <th style={styles.th}>작성일</th>
                        <th style={styles.th}>완료일</th>
                    </tr>
                    <td style={styles.td}>AA25-B5321</td>
                    <td style={styles.td}>휴가 신청서</td>
                    <td style={styles.td}>-</td>
                    <td style={styles.td}>정청원</td>
                    <td style={styles.td}>2024-05-29</td>
                    <td style={styles.td}>2024-05-30</td>
                </table>
            </div>

        </div>
    );
}

const styles = {
    th: {
        padding:'30px',
        margin: '20px'
    },

    td: {
        padding:'20px',
        margin: '10px'
    },
    table:{
        position:'relative',
        margin:'10px auto'
    },
    ul: {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'row'
    },
    li: {
        paddingRight: '10px'
    },
    link: {
        textDecoration: 'none',
        color: 'inherit'
    },
    input:{
        width: '100%',
        fontsize: '18px',
        padding: '11px',
        border: '1px solid #ddd'
    },

    /* Style the navigation menu */
    docSubmit:{
        padding: '10px 20px',
        fontsize: '16px',
        textAlign: 'center',
        cursor: 'pointer',
        outline: 'none',
        border: 'none',
        borderRadius: '10px',
        boxShadow: '0 2px #999',
        marginTop: '15px',
        marginBottom: '20px'
    },
    myMenu: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    },
    /* Style the navigation links */
    myMenuLi: {
        padding: '10px 20px',
        fontsize: '16px',
        textAlign: 'center',
        cursor: 'pointer',
        outline: 'none',
        border: 'none',
        borderRadius: '10px',
        boxShadow: '0 2px #999',
        marginTop: '15px'
    // color: '#fff',
    // backgroundColor: '#04AA6D',
    // padding: '5px',
    // marginTop: '20px',
    // textDecoration: 'none',
    // color: 'black',
    // display: 'block'
    },

    myMenuLiHover: {
    backgroundColor: '#eee'
    }
};

export default Documents;