import React from 'react';
import '../../styles/components/teamsettings/Member.css'

const Member = () => {
    return (
        <div className='teamsettings-inner'>
            <div className='teamsettings-hedaer'>멤버 관리</div>
            <div className='teamsettings-team-table-header'>
                <div></div>
                <div>
                    <div></div>
                    <input type='text' />
                </div>
            </div>
            <table></table>
        </div>
    );
};

export default Member;