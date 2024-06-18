import React, { useState } from 'react';

import kiwiImage from '../../images/kiwi.png'; 
import kiwiWord from '../../images/kiwi-word.png'; 
import '../../styles/components/common/Logo.css';


const Logo = () => {

    return (
    <div className="logo-container">
        <img src={kiwiImage} alt="Kiwi-icon" className='kiwi-icon' />
        <img src={kiwiWord} alt="Kiwi-word" className='kiwi-word' />
    </div>

    );
};

export default Logo;