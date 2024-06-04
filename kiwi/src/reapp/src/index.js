import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/App.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
//import './output.css'
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

import enTranslation from './languages/en.json';
import koTranslation from './languages/ko.json';

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

