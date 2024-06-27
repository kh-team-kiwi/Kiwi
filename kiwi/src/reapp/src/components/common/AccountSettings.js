import React, { useState } from 'react';
import '../../styles/components/common/AccountSettings.css';
import {getSessionItem} from "../../jwt/storage";

const AccountSettings = ({ isOpen, onClose }) => {
  const [profilePicture, setProfilePicture] = useState(getSessionItem("profile").filepath);
  const [name, setName] = useState(getSessionItem("profile").name);
  const [password, setPassword] = useState('');

  const handleProfilePictureChange = (e) => {
    setProfilePicture(URL.createObjectURL(e.target.files[0]));
  };

  const handleSave = () => {
    console.log('Changes saved:', { profilePicture, name, password });
    onClose();
  };

  if (!isOpen) return null;



  return (
    <div className="account-settings-overlay">
      <div className="account-settings-modal">
        <h2>Account Settings</h2>
        <div className="account-settings-profile-picture">
          {profilePicture ? (
              <img src={profilePicture} alt="Profile Preview" className="account-settings-profile-preview"/>
          ) : (
              <div className="account-settings-placeholder"></div>
          )}
          <button className="account-settings-upload-button"
                  onClick={() => document.getElementById('fileInput').click()}>
            Upload
          </button>
          <input
              id="fileInput"
              type="file"
              style={{display: 'none'}}
              onChange={handleProfilePictureChange}
          />
        </div>
        <div className="account-settings-form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
          <button onClick={handleSave}>Save</button>
        </div>
        <div className="account-settings-form-group">
          <div>Password:</div>
          <div>
            <input type="password" placeholder='Current password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div>
            <input type="password" placeholder='Modify password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div>
            <input type="password" placeholder='Confirm password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <button onClick={handleSave} disabled>Save</button>
        </div>
        <div className="account-settings-form-group">
          <div>Delete Account</div>
          <div>
            <input type="password" placeholder='input password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <button onClick={""}>Delete</button>
          <p>Are you sure you want to leave?<br/>You can't go back.</p>
        </div>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AccountSettings;
