import { createI18n } from 'vue-i18n'
import {
  LOCALES,
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  isValidLocale,
  buildMessages
} from './config'

const savedLocale = localStorage.getItem('locale')
const defaultLocale = isValidLocale(savedLocale || '')
  ? savedLocale!
  : DEFAULT_LOCALE

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: FALLBACK_LOCALE,
  messages: buildMessages()
})

export default i18n
export { LOCALES, isValidLocale }
