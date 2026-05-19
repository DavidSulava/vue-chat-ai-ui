import en from '@/i18n/locales/en'
import ru from '@/i18n/locales/ru'
import type { LocaleConfig } from '@/types'

type LocaleMessages = typeof en

export const LOCALES: LocaleConfig<LocaleMessages>[] = [
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

export const LOCALE_CODES = LOCALES.map((l) => l.code) as string[]
export const DEFAULT_LOCALE = LOCALES[0].code
export const FALLBACK_LOCALE = DEFAULT_LOCALE

export function isValidLocale(
  code: string
): code is (typeof LOCALE_CODES)[number] {
  return LOCALE_CODES.includes(code)
}

export const MESSAGES: Record<string, LocaleMessages> = Object.fromEntries(
  LOCALES.map((l) => [l.code, l.messages])
)
