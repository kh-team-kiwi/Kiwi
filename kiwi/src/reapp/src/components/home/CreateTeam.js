import React, { useState } from 'react';
import '../../styles/components/home/CreateTeam.css';
import axiosHandler from "../../jwt/axiosHandler";
import {getSessionItem} from "../../jwt/storage";

const CreateTeam = ({ onCreateTeam, toggleTeamView }) => {

  const [formData, setFormData] = useState({
    teamName: '',
    invitedMembers: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'invitedMembers') {
      setInputMember(e.target.value);
      // const membersList = value.split(',').map(member => member.trim());
      // setFormData({
      //   ...formData,
      //   [name]: membersList,
      // });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let check = validateInputName(formData.teamName)
    if(check!==true){
      alert(check);
      return;
    }
    onCreateTeam(formData); 

    setFormData({ teamName: '', invitedMembers: [] });
    toggleTeamView();

  };

  function validateInputName(input) {
    const emptyPattern = /^$/;
    const whitespacePattern = /^\s*$/;
    const noSpacesPattern = /^\S+$/;

    if (emptyPattern.test(input)) {
      return "값을 입력해주세요.";
    } else if (whitespacePattern.test(input)) {
      return "공백을 입력할 수 없습니다.";
    } else if (!noSpacesPattern.test(input)) {
      return "공백이 포함될 수 없습니다.";
    } else {
      return true;
    }
  }

  const handleCancel = () => {
    setFormData({ teamName: '', invitedMembers: [] });
    toggleTeamView();
  };

  /* 작성 김성식 : 초대멤버코드 */

  const [member, setMember] = useState({
    username: '',
    name: '',
    filepath: '',
    role:''
  });

  const[inputMember, setInputMember] = useState('');

  const handleMemberTag = async (event) => {
    if(event.key === "Enter"){
      event.preventDefault();

      let check = validateInput(inputMember);
      console.log(check);
      if(check!==true){
        alert(check);
        return;
      }

      if(formData.invitedMembers.some(member=>member.username === inputMember)){
        alert("이미 초대된 회원입니다.");
        setInputMember('');
        return;
      }

      if(getSessionItem("profile").username===inputMember){
        alert("팀 생성자는 자동으로 추가 됩니다.");
        setInputMember('');
        return;
      }

      console.log("create-team >> input enter evenet : ", inputMember);
      const res = await axiosHandler.post("/api/auth/member",{memberId:event.target.value});

      if (res.status === 200 && res.data.result) {
        console.log("create-team >> return : ", res.data);
        const data = res.data.data;
        console.log(data);
        setFormData(prev => ({
          ...prev,
          invitedMembers: [...prev.invitedMembers, data],
        }));
        console.log(formData);
        setInputMember('');
      } else if(res.status === 200 && !res.data.result) {
        alert(res.data.message);
      } else {
        alert("오류가 발생했습니다.");
      }

    }
  };

  const handleMemberTagBtn = async (event) => {
    event.preventDefault();

    let check = validateInput(inputMember);
    if(check!==true){
      alert(check);
      return;
    }

    if(formData.invitedMembers.some(member=>member.username === inputMember)){
      alert("이미 초대된 회원입니다.");
      setInputMember('');
      return;
    }
    if(getSessionItem("profile").username===inputMember){
      alert("팀 생성자는 자동으로 추가 됩니다.");
      setInputMember('');
      return;
    }
    const res = await axiosHandler.post("/api/auth/member",{memberId:inputMember});
    if (res.status === 200 && res.data.result) {
      const data = res.data.data;
      setFormData(prev => ({
        ...prev,
        invitedMembers: [...prev.invitedMembers, data],
      }));
      setInputMember('');
    } else if(res.status === 200 && !res.data.result) {
      alert(res.data.message);
    } else {
      alert("오류가 발생했습니다.");
    }
  }

  const preventEnterSubmit = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const deleteMember = (username) => {
    setFormData((prev)=>({
      ...prev,
      invitedMembers: [...prev.invitedMembers.filter(member=>member.username !== username)]
    }));
  }

  function validateInput(input) {
    const emptyPattern = /^$/;
    const whitespacePattern = /^\s*$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const noSpacesPattern = /^\S+$/;

    if (emptyPattern.test(input)) {
      return "값을 입력해주세요.";
    } else if (whitespacePattern.test(input)) {
      return "공백을 입력할 수 없습니다.";
    } else if (!noSpacesPattern.test(input)) {
      return "공백이 포함될 수 없습니다.";
    } /*else if (!emailPattern.test(input)) {
      return "이메일을 정확히 입력해주세요.";
    }*/ else {
      return true;
    }
  }

  /* 작성 김성식 : 초대멤버 코드 */

  return (
    <>
    <div className='create-team-title-container'>
      <div className='create-team-title'>
        Create a New Team
      </div> 
    </div>
        
    <div className='create-team-container' >  
      <form onSubmit={handleSubmit}>
        <div className='create-team-top'>
          <div>
            <div className='create-team-name-title'>
              Team Name
            </div>
            <div className='create-team-name-container' >
              <input
                className="create-team-name-input"
                name="teamName"
                value={formData.teamName}
                placeholder="Choose your team's name"
                onKeyDown={preventEnterSubmit}
                onChange={handleChange}
              />
            </div>

          </div>
          <div>
            <div className='create-team-invite-members-title'>
                Invite Members
            </div>
            <div className='create-team-invite-members-wrapper'>
              <div className='create-team-invite-members-container' >
                <input
                  className="create-team-invite-members-input"
                  name="invitedMembers"
                  placeholder='Search members by email'
                  value={inputMember}
                  onKeyDown={preventEnterSubmit}
                  onChange={handleChange}
                  onKeyUp={handleMemberTag}
                />
              </div>

              <button onClick={handleMemberTagBtn} className='create-team-invite-button'>
                Invite
              </button>

            </div>
          </div>


          {formData.invitedMembers.length > 0 && (
            <div className='create-team-member-list-container'> 
                <ul>
                {formData.invitedMembers.map(member => (
                        <li key={member.username} className="create-team-member">
                            <img className='create-team-member-image' src={member.filepath} />

                            <div className='create-team-member-info'>
                              <div className='create-team-member-name-wrapper' >
                                <div className='create-team-member-name'>{member.name}</div>
                                <div className='create-team-invite-pending' > Invite Pending</div>
                              </div>


                              <div className='create-team-member-email'>{member.username}</div>
                            </div>
                            <div className='create-team-member-cancel'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" onClick={()=>deleteMember(member.username)}>
                              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>

                            </div>
                        </li>
                    ))}

                </ul>
            </div>
          )}

        </div>

        <div className='create-team-bottom'>
          <button
            type="button"
            className='create-team-cancel-button'
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button type="submit" className='create-team-create-button'>
            Create Team
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default CreateTeam;
