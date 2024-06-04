import React from 'react';
import '../../styles/components/common/ToggleButton.css';



const ToggleButton = ({ isChecked, onToggle }) => {
    return (
      <div className="toggle-container">
        <input
          type="checkbox"
          id="toggle"
          className="toggle-checkbox"
          checked={isChecked}
          onChange={onToggle}
        />
        <label htmlFor="toggle" className="toggle-label"></label>
      </div>
    );
  };
  
  export default ToggleButton;