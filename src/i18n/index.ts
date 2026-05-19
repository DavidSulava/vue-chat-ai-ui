import { createI18n } from 'vue-i18n'
import {
  LOCALES,
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  isValidLocale,
  MESSAGES
} from '@/i18n/config'

const savedLocale = localStorage.getItem('locale')
const defaultLocale =
  savedLocale && isValidLocale(savedLocale) ? savedLocale : DEFAULT_LOCALE

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: FALLBACK_LOCALE,
  messages: MESSAGES
})

export default i18n
export { LOCALES, isValidLocale }
