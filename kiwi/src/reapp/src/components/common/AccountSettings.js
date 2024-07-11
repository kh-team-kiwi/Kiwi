import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/common/AccountSettings.css';
import ErrorImage from '../../images/default-image.png';
import PlusIcon from '../../images/svg/shapes/PlusIcon';
import ThinUpArrow from '../../images/svg/shapes/ThinUpArrow';
import EditIcon from '../../images/svg/buttons/EditIcon';
import { getSessionItem, removeLocalItem, removeSessionItem, setSessionItem } from "../../jwt/storage";
import axiosHandler from "../../jwt/axiosHandler";
import { useParams } from "react-router-dom";

import { toast } from 'react-toastify';


const AccountSettings = ({ isOpen, onClose }) => {
  const [name, setName] = useState(getSessionItem('profile').name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPasswordSectionExpanded, setIsPasswordSectionExpanded] = useState(false);
  const [isDeleteSectionExpanded, setIsDeleteSectionExpanded] = useState(false);
  const { t, i18n } = useTranslation();
  const [profilePicture, setProfilePicture] = useState(getSessionItem('profile').filepath);
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState({
    emptyWhitespacePattern: false,
    least8char: false,
    specialSymbol: false,
    duplicatePattern: false
  });

  const [file, setFile] = useState();
  const { teamno } = useParams();

  useEffect(() => {
    if (!isOpen) {
      setIsEditingName(false);
      setIsPasswordSectionExpanded(false);
      setIsDeleteSectionExpanded(false);
    }
  }, [isOpen]);

  const handleProfilePictureChange = (e) => {
    setProfilePicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  const handleEditClick = () => {
    setIsEditingName(!isEditingName);
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (file !== undefined) {
      formData.append('profile', file);
    } else {
      formData.append('profile', null);
    }
    formData.append('memberId', getSessionItem('profile').username);
    formData.append('memberNickname', name);

    try {
      const res = await axiosHandler.post('/api/auth/update/account', formData,
        { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.result) {
        toast.success('Changes have been saved!');
        setSessionItem('profile', res.data.data);
        window.location.reload();
      } else {
        toast.error(res.data.message);
      }
    } catch (e) {
      toast.error('An error has occurred.');

    }
  };

  const validatePassword = (password) => {
    const emptyWhitespacePattern = password.length > 0 && !/^\s*$/.test(password) && /^\S+$/.test(password);
    const least8char = /^[\w가-힣!@#$%^]{8,16}$/.test(password);
    const specialSymbol = /^(?=.*[!@#$%^])[a-zA-Z0-9!@#$%^]{8,16}$/.test(password);

    return {
      emptyWhitespacePattern,
      least8char,
      specialSymbol,
      isValid: emptyWhitespacePattern && least8char && specialSymbol
    };
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    const passwordValidation = validatePassword(value);
    setPasswordCheck(passwordValidation);
    setNewPassword(value);
  };

  const updatePassword = async () => {
    if (!passwordCheck.isValid) {
      toast.error("Invalid password. Ensure it meets all requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const memberId = getSessionItem('profile').username;
      const currentPw = currentPassword;
      const newPw = newPassword;
      const res = await axiosHandler.put('/api/auth/member/'+memberId, { currentPw, newPw });
      if (res.data.result) {
        setIsPasswordSectionExpanded(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success("Your password has been updated");
      } else {
        toast.error(res.data.message);
      }
    } catch (e) {
      toast.error('An error has occurred.');

    }
  };

  const deleteAccount = async () => {
    try {
      const memberId = getSessionItem('profile').username;
      const password = currentPassword;
      const res = await axiosHandler.delete('/api/auth/member/'+memberId, { password });
      if (res.data.result) {
        setSessionItem('profile', res.data.data);
        removeLocalItem("accessToken");
        removeSessionItem("profile");
        removeSessionItem("teams");
        removeSessionItem("events");
        window.location.replace("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (e) {
      toast.error('An error has occurred.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="account-settings-overlay">
      <div className="account-settings-modal">
        <div className="account-settings-title">{t('account-settings')}</div>
        <div className="account-settings-profile-container">
          <div className="account-settings-profile-picture-container">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile Preview" className="account-settings-profile-image" />
            ) : (
              <img src={ErrorImage} className="account-settings-placeholder" />
            )}
            <button className="account-settings-upload-button" onClick={() => document.getElementById('fileInput').click()}>
              <PlusIcon className="account-settings-plus-icon" />
            </button>
            <input
              id="fileInput"
              type="file"
              style={{ display: 'none' }}
              onChange={handleProfilePictureChange}
            />
          </div>
          <div className="account-settings-profile-info">
            <div className={`account-settings-name-container ${isEditingName ? 'editing' : ''}`}>
              <input
                type="text"
                name="name"
                className="account-settings-name"
                placeholder={t('name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly={!isEditingName}
              />
              <div className="account-settings-edit-container" onClick={handleEditClick}>
                <EditIcon className="account-settings-edit-icon" />
              </div>
            </div>
            <div className="account-settings-email">
              {getSessionItem('profile').username}
            </div>
          </div>
        </div>
        <div className="account-settings-options">
          <div className={`account-settings-change-password-container ${isPasswordSectionExpanded ? 'expanded' : ''}`}>
            <div className="account-settings-change-password" onClick={() => setIsPasswordSectionExpanded(!isPasswordSectionExpanded)}>
              <div>
                Change password
              </div>
              <ThinUpArrow className={`account-settings-arrow ${isPasswordSectionExpanded ? 'down' : ''}`} />
            </div>
            {isPasswordSectionExpanded && (
              <div className="account-settings-password-inputs">
                <div className='account-settings-password-text'>
                  Type in your current password
                </div>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="account-settings-input"
                />
                <div className='account-settings-password-text'>
                  Choose your new password
                </div>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className="account-settings-input"
                />
                <div className='account-settings-password-text'>
                  Confirm your new password
                </div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="account-settings-input"
                />
                <button className="account-settings-change-password-button"
                  onClick={updatePassword}>
                  Change password
                </button>
              </div>
            )}
          </div>
          <div className={`account-settings-delete-account-container ${isDeleteSectionExpanded ? 'expanded' : ''}`}>
            <div className="account-settings-delete-account"
              onClick={() => setIsDeleteSectionExpanded(!isDeleteSectionExpanded)}>
              Delete Account
              <ThinUpArrow className={`account-settings-arrow ${isDeleteSectionExpanded ? 'down' : ''}`} />
            </div>

            {isDeleteSectionExpanded && (
              <div className="account-settings-delete-inputs">
                <div className='account-settings-delete-warning'>
                  Warning: Deleting your account is permanent and cannot be undone.
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="account-settings-input"
                />
                <button className="account-settings-delete-button" onClick={deleteAccount}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="account-settings-bottom-container">
          <button type="button" className="account-settings-cancel-button" onClick={onClose}>{t('cancel')}</button>
          <button type="button" className="account-settings-save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
