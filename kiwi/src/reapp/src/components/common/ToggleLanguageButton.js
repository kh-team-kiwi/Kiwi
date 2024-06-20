import React, { useState } from 'react';
import '../../styles/components/common/ToggleLanguageButton.css';
import { useTranslation } from 'react-i18next';

import KoreanFlag from '../../images/svg/flags/KoreanFlag';
import EnglishFlag from '../../images/svg/flags/EnglishFlag';
import SpanishFlag from '../../images/svg/flags/SpanishFlag';
import FrenchFlag from '../../images/svg/flags/FrenchFlag';
import GermanFlag from '../../images/svg/flags/GermanFlag';
import JapaneseFlag from '../../images/svg/flags/JapaneseFlag';
import ChineseFlag from '../../images/svg/flags/ChineseFlag';

import DownArrow from '../../images/svg/arrows/DownArrow';

const ToggleLanguageButton = () => {
    const { t, i18n } = useTranslation();
    const [languageOptionsVisible, setLanguageOptionsVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

    const handleDropdownClick = () => {
        setLanguageOptionsVisible(!languageOptionsVisible);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setSelectedLanguage(lng);
        setLanguageOptionsVisible(false);
    };

    const getFlagComponent = (lng) => {
        const className = 'toggle-language-chosen-language-flag';
        switch (lng) {
            case 'ko':
                return <KoreanFlag className={className} />;
            case 'en':
                return <EnglishFlag className={className} />;
            case 'es':
                return <SpanishFlag className={className} />;
            case 'fr':
                return <FrenchFlag className={className} />;
            case 'de':
                return <GermanFlag className={className} />;
            case 'ja':
                return <JapaneseFlag className={className} />;
            case 'zh':
                return <ChineseFlag className={className} />;
            default:
                return <EnglishFlag className={className} />;
        }
    };

    return (
        <div className='toggle-language-button-container'>
            <div onClick={handleDropdownClick} className={`toggle-language-button ${languageOptionsVisible ? 'clicked' : ''}`}>
                <div>
                    {getFlagComponent(selectedLanguage)}
                </div>
                <div>
                    &nbsp; {t('language')} &nbsp;
                </div>
                <div className={`toggle-language-down-arrow ${languageOptionsVisible ? 'flipped' : ''}`}>
                    <DownArrow />
                </div>
            </div>
            <div className={`toggle-language-list ${languageOptionsVisible ? 'visible' : ''}`}>
                <div onClick={() => changeLanguage('ko')} className={selectedLanguage === 'ko' ? 'toggle-language-selected' : ''}>
                    한국어
                    <KoreanFlag />
                </div>
                <div onClick={() => changeLanguage('en')} className={selectedLanguage === 'en' ? 'toggle-language-selected' : ''}>
                    English
                    <EnglishFlag />
                </div>
                <div onClick={() => changeLanguage('es')} className={selectedLanguage === 'es' ? 'toggle-language-selected' : ''}>
                    Español
                    <SpanishFlag />
                </div>
                <div onClick={() => changeLanguage('fr')} className={selectedLanguage === 'fr' ? 'toggle-language-selected' : ''}>
                    Français
                    <FrenchFlag />
                </div>
                <div onClick={() => changeLanguage('de')} className={selectedLanguage === 'de' ? 'toggle-language-selected' : ''}>
                    Deutsch
                    <GermanFlag />
                </div>
                <div onClick={() => changeLanguage('ja')} className={selectedLanguage === 'ja' ? 'toggle-language-selected' : ''}>
                    日本語
                    <JapaneseFlag />
                </div>
                <div onClick={() => changeLanguage('zh')} className={selectedLanguage === 'zh' ? 'toggle-language-selected' : ''}>
                    中文
                    <ChineseFlag />
                </div>
            </div>
        </div>
    );
};

export default ToggleLanguageButton;
