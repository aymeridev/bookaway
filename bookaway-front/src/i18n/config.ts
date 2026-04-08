import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationFR from './locales/fr.json';

export const resources = {
    fr: {
        translation: translationFR,
    },
} as const;

i18n.use(initReactI18next).init({
    lng: 'fr',
    fallbackLng: 'fr',
    resources,
});

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: typeof resources['fr'];
    }
}

export default i18n;