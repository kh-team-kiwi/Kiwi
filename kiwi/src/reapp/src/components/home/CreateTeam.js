import React, { useState } from 'react';
import '../../styles/components/home/CreateTeam.css';
import axiosHandler from "../../jwt/axiosHandler";
import {getSessionItem} from "../../jwt/storage";
import ErrorImageHandler from "../common/ErrorImageHandler";
import { useTranslation } from 'react-i18next';

import { toast } from 'react-toastify';
import i18next from 'i18next';


const CreateTeam = ({ onCreateTeam, toggleTeamView }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    teamName: '',
    invitedMembers: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'invitedMembers') {
      setInputMember(e.target.value);
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
      toast.error(check);
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
      return t('empty-error');
    } else if (whitespacePattern.test(input)) {
      return t('no-whitespace-error');
    } else if (!noSpacesPattern.test(input)) {
      return t('no-whitespace-error');
    } else {
      return true;
    }
  }

  const handleCancel = () => {
    setFormData({ teamName: '', invitedMembers: [] });
    toggleTeamView();
  };


  const [member, setMember] = useState({
    username: '',
    name: '',
    filepath: '',
    role:''
  });

  const[inputMember, setInputMember] = useState('');

  const handleMemberTagBtn = async (event) => {
    event.preventDefault();

    let check = validateInput(inputMember);
    if(check!==true){
      toast.error(check);
      return;
    }

    if(formData.invitedMembers.some(member=>member.username === inputMember)){
      toast.error(t('already-invited-error'));
      setInputMember('');
      return;
    }
    if(getSessionItem("profile").username===inputMember){
      toast.error(t('cant-invite-self-error'));
      setInputMember('');
      return;
    }
    const res = await axiosHandler.get("/api/auth/member/"+inputMember);
    if (res.status === 200 && res.data.result) {
      const data = res.data.data;
      setFormData(prev => ({
        ...prev,
        invitedMembers: [...prev.invitedMembers, data],
      }));
      setInputMember('');
    } else if(res.status === 200 && !res.data.result) {
      toast.error(t('no-user-error'));
    } else {
      toast.error(t('error-occurred'));
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
      return t('empty-error');
    } else if (whitespacePattern.test(input)) {
      return t('no-whitespace-error');
    } else if (!noSpacesPattern.test(input)) {
      return t('no-whitespace-error');
    }  else {
      return true;
    }
  }

  return (
    <>
    <div className='create-team-title-container'>
      <div className='create-team-title'>
      {t('create-new-team')}
      </div> 
    </div>
        
    <div className='create-team-container' >  
      <form onSubmit={handleSubmit}>
        <div className='create-team-top'>
          <div>
            <div className='create-team-name-title'>
            {t('team-name')}
            </div>
            <div className='create-team-name-container' >
              <input
                className="create-team-name-input"
                name="teamName"
                value={formData.teamName}
                placeholder={t('choose-team-name')}
                onKeyDown={preventEnterSubmit}
                onChange={handleChange}
              />
            </div>

          </div>
          <div>
            <div className='create-team-invite-members-title'>
            {t('invite-members')}
            </div>
            <div className='create-team-invite-members-wrapper'>
              <div className='create-team-invite-members-container' >
                <input
                  className="create-team-invite-members-input"
                  name="invitedMembers"
                  placeholder={t('invite-members')}
                  value={inputMember}
                  onKeyDown={preventEnterSubmit}
                  onChange={handleChange}
                />
              </div>

              <button onClick={handleMemberTagBtn} className='create-team-invite-button'>
              {t('invite')}
              </button>

            </div>
          </div>


          {formData.invitedMembers.length > 0 && (
            <div className='create-team-member-list-container'> 
                {formData.invitedMembers.map(member => (
                        <div key={member.username} className="create-team-member">
                            <img className='create-team-member-image' src={member.filepath} onError={ErrorImageHandler} />

                            <div className='create-team-member-info'>
                              <div className='create-team-member-name-wrapper' >
                                <div className='create-team-member-name'>{member.name}</div>
                                <div className='create-team-invite-pending' > {t('invited')}</div>
                              </div>


                              <div className='create-team-member-email'>{member.username}</div>
                            </div>
                            <div className='create-team-member-cancel'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" onClick={()=>deleteMember(member.username)}>
                              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>

                            </div>
                        </div>
                    ))}

            </div>
          )}

        </div>

        <div className='create-team-bottom'>
          <button
            type="button"
            className='create-team-cancel-button'
            onClick={handleCancel}
          >
            {t('cancel')}
          </button>

          <button type="submit" className='create-team-create-button'>
          {t('create-team')}
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default CreateTeam;