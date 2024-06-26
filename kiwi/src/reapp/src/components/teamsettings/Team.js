import React from 'react';

const Team = () => {
    return (
        <div className='teamsettings-inner'>
            <div className='teamsettings-hedaer'>팀 관리</div>
            <div>팀 이름 변경</div>
            <div>
                <input type='text'/>
                <button>팀 이름 변경하기</button>
            </div>
            <div>팀 아이콘 변경</div>
            <div>
                <input type='text'/>
                <button>팀 이름 변경하기</button>
            </div>
            <div>팀 삭제</div>
            <div>
                <p>정말로 팀을 삭제하시겠습니까?<br/>모든 메세지와 파일들이 삭제되며 복구할 수 없습니다.</p>
                <button>팀 삭제하기</button>
            </div>
        </div>
    );
};

export default Team;