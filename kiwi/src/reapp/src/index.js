import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
//import './output.css'
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

import enTranslation from './languages/en.json';
import koTranslation from './languages/ko.json';
import esTranslation from './languages/es.json';
import frTranslation from './languages/fr.json';
import jaTranslation from './languages/ja.json';
import zhTranslation from './languages/zh.json';
import deTranslation from './languages/de.json';

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'en', 
  resources: {
    en: {
      translation: enTranslation,
    },
    ko: {
      translation: koTranslation,
    },
    es: {
      translation: esTranslation,
    },
    fr: {
      translation: frTranslation,
    },
    ja: {
      translation: jaTranslation,
    },
    zh: {
      translation: zhTranslation,
    },
    de: {
      translation: deTranslation,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <I18nextProvider i18n={i18next}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </I18nextProvider>
);

