import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/pages/Member.css';
import axios from 'axios';

const Member = () => {
    const { teamno } = useParams(); // useParams 훅을 사용하여 teamno를 추출
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (teamno) {  // teamno가 존재하는지 확인
            axios.get(`/api/team/${teamno}/members`)
                .then(response => {
                    console.log('response data:', response.data); // 응답 데이터 로그 추가
                    // 응답 데이터가 객체로 감싸져 있는지 확인
                    const data = response.data.data;
                    if (Array.isArray(data)) {
                        setMembers(data);
                    } else {
                        console.error('Invalid data format:', response.data);
                    }
                })
                .catch(error => {
                    console.error('There was an error fetching the members!', error);
                });
        } else {
            console.error('teamno is undefined');
        }
    }, [teamno]);

    const handleRoleChange = (memberId, role) => {
        axios.post('/api/team/updateRole', null, {
            params: {
                teamId: teamno,
                memberId,
                role
            }
        })
            .then(response => {
                alert(response.data.message);
                // 업데이트 후 멤버 목록을 다시 불러옵니다.
                setMembers(members.map(member => member.username === memberId ? { ...member, role } : member));
            })
            .catch(error => {
                console.error('권한 변경을 할 수 없습니다.!', error);
            });
    };

    const handleRemoveMember = (memberId) => {
        axios.post('/api/team/removeMember', null, {
            params: {
                teamId: teamno,
                memberId
            }
        })
            .then(response => {
                alert(response.data.message);
                // 멤버 목록에서 제거합니다.
                setMembers(members.filter(member => member.username !== memberId));
            })
            .catch(error => {
                console.error('멤버를 제거할 수 없습니다.!', error);
            });
    };

    return (
        <div className='teamsettings-inner'>
            <div className='teamsettings-header'>멤버 관리</div>
            <div className='table-container'>
                <table>
                    <thead>
                    <tr>
                        <th className='checkbox-column'><input type='checkbox' /></th>
                        <th>이름</th>
                        <th className='email-column'>이메일</th>
                        <th>권한</th>
                        <th>설정</th>
                    </tr>
                    </thead>
                    <tbody>
                    {members.map((member, index) => (
                        <tr key={index}>
                            <td className='checkbox-column'><input type='checkbox' /></td>
                            <td>{member.name}</td>
                            <td>{member.role}</td>
                            <td>{member.username}</td>
                            {/*<td>*/}
                            {/*    <span className={`role-badge role-${member.role.toLowerCase()}`}>*/}
                            {/*        {member.role}*/}
                            {/*    </span>*/}
                            {/*</td>*/}
                            <td>
                                <button onClick={() => handleRoleChange(member.username, 'ADMIN')}>관리자로 변경</button>
                                <button onClick={() => handleRoleChange(member.username, 'MEMBER')}>멤버로 변경</button>
                                <button onClick={() => handleRemoveMember(member.username)}>추방</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Member;
