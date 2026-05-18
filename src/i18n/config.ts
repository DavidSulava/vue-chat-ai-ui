import en from './locales/en'
import ru from './locales/ru'

export interface LocaleConfig {
  code: string
  label: string
  messages: typeof en
}

export const LOCALES: LocaleConfig[] = [
  {
    code: 'en',
    label: 'EN',
    messages: en
  },
  {
    code: 'ru',
    label: 'RU',
    messages: ru
  }
]

export const LOCALE_CODES = LOCALES.map((l) => l.code)
export const DEFAULT_LOCALE = 'en'
export const FALLBACK_LOCALE = 'en'

export function isValidLocale(code: string): boolean {
  return LOCALE_CODES.includes(code)
}

export function buildMessages(): Record<string, typeof en> {
  return LOCALES.reduce<Record<string, typeof en>>((acc, locale) => {
    acc[locale.code] = locale.messages
    return acc
  }, {})
}
