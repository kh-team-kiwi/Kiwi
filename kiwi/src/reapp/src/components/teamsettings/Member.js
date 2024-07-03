import React from 'react';
import '../../styles/components/teamsettings/Member.css'
import ErrorImageHandler from "../common/ErrorImageHandler";

const Member = () => {

    const selectHandle = () => {

    }
    return (
        <div className='teamsettings-inner'>
            <div className='teamsettings-header'>멤버 관리</div>
            <div className='teamsettings-team-table-header'>
                <div className='teamsettings-team-table-header-top'>
                    <select value='engage' onChange={selectHandle}>
                        <option value='engage'>참여 중인 멤버</option>
                        <option value='invite'>초대 중인 멤버</option>
                        <option value='block'>차단 멤버</option>
                    </select>
                    <div>
                        <select value='name' onChange={selectHandle}>
                            <option value='name'>멤버 이름</option>
                            <option value='email'>이메일</option>
                        </select>
                        <input type='text'/>
                    </div>
                </div>
                <div className='teamsettings-team-table-header-bottom'>
                    <div className='heder-bottom-btn-box'>
                        <button type='button'>멤버 초대</button>
                        <button type='button'>멤버 관리</button>
                    </div>
                    <div>
                        <select value='view10' onChange={selectHandle}>
                            <option value='view10'>10 명씩 보기</option>
                            <option value='view20'>20 명씩 보기</option>
                            <option value='view50'>50 명씩 보기</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='teamsettings-team-table-wrapper'>
                <table className='teamsettings-team-table'>
                    <thead>
                    <tr>
                        <th><input type='checkbox'/></th>
                        <th>사진</th>
                        <th>이름</th>
                        <th>권한</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className='odd-column'>
                        <td><input type='checkbox'/></td>
                        <td>
                            <img className='teamsettigs-team-member-profile' src='' alt='' onError={ErrorImageHandler}></img>
                        </td>
                        <td><span>Gyeong Mo Koo</span><br/><span>koogyeongmokh@gmail.com</span></td>
                        <td>Member</td>
                    </tr>
                    <tr>
                        <td><input type='checkbox'/></td>
                        <td>

                        </td>
                        <td><span>정청원</span><br/><span>jcw9926@gmail.com</span></td>
                        <td>Member</td>
                    </tr>
                    <tr className='odd-column'>
                        <td><input type='checkbox'/></td>
                        <td>

                        </td>
                        <td><span>정청원</span><br/><span>jcw9926@gmail.com</span></td>
                        <td>Member</td>
                    </tr>
                    <tr>
                        <td><input type='checkbox'/></td>
                        <td>
                        </td>
                        <td><span>정청원</span><br/><span>jcw9926@gmail.com</span></td>
                        <td>Member</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Member;

