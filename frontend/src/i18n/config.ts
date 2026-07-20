import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationFR from './locales/fr.json';
import translationEN from './locales/en.json';

const savedLanguage = localStorage.getItem('language') || 'fr';

i18n.use(initReactI18next).init({
    resources: {
        fr: { translation: translationFR },
        en: { translation: translationEN },
    },
    lng: savedLanguage,
    fallbackLng: 'fr',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;