import { createI18n } from 'vue-i18n'
import en from './locales/en'
import ru from './locales/ru'

const savedLocale = localStorage.getItem('locale')
const defaultLocale = savedLocale && ['en', 'ru'].includes(savedLocale) ? savedLocale : 'ru'

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    ru
  }
})

export default i18n
