import React, { useState } from 'react';
import '../../styles/components/home/CreateTeam.css';

const CreateTeam = ({ onCreateTeam, toggleTeamView }) => {
  const [formData, setFormData] = useState({
    teamName: '',
    invitedMembers: [],
  });

  const members = [
    {
        email: 'test1@gmail.com',
        name: 'test1',
        image: ''
    },
    {
      email: 'test2@gmail.com',
      name: 'test2',
      image: ''
    }
    ,
    {
      email: 'test3@gmail.com',
      name: 'test3',
      image: ''
    }
];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'invitedMembers') {
      const membersList = value.split(',').map(member => member.trim());
      setFormData({
        ...formData,
        [name]: membersList,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateTeam(formData); 
    setFormData({ teamName: '', invitedMembers: [] }); 
  };

  const handleCancel = () => {
    setFormData({ teamName: '', invitedMembers: [] });
    toggleTeamView();
  };

  return (
    <>
    <div className='create-team-title-container'>
      <div className='create-team-title'>
        Create Team
      </div> 
    </div>
        
    <div className='create-team-container' >  
      <form onSubmit={handleSubmit}>
        <div className='create-team-top'>
          <div className='create-team-name-container' >
            Team Name
            <input
              className="create-team-name-input"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
            />
          </div>
          <div className='create-team-search-members-container' >
            Members 
            <input
              className="create-team-search-members-input"
              name="invitedMembers"
              placeholder='Search Members by Email'
            //   value={formData.invitedMembers.join(', ')}
              onChange={handleChange}
            />
          </div>

            <div className='create-team-member-list-container'> 
                <ul>
                {members.map(member => (
                        <li key={member.email} className="create-team-member">
                            <img className='create-team-member-image' src={member.image} />

                            <div className='create-team-member-info'>
                              <div className='create-team-member-name'>{member.name}</div>

                              <div className='create-team-member-email'>{member.email}</div>
                            </div>
                        </li>
                    ))}

                </ul>

            </div>

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
            Create
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default CreateTeam;
