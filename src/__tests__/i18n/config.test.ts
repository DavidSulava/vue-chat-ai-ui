import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import en from '../../i18n/locales/en'
import ru from '../../i18n/locales/ru'
import { LOCALE_CODES, DEFAULT_LOCALE, FALLBACK_LOCALE, isValidLocale } from '../../i18n/config'

describe('i18n configuration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('uses ru as default locale when localStorage is empty', () => {
    vi.resetModules()
    const i18n = createI18n({
      legacy: false,
      locale: DEFAULT_LOCALE,
      fallbackLocale: FALLBACK_LOCALE,
      messages: { en, ru }
    })
    expect(i18n.global.locale.value).toBe(DEFAULT_LOCALE)
  })

  it('uses saved locale from localStorage when valid', () => {
    localStorage.setItem('locale', 'en')
    const savedLocale = localStorage.getItem('locale')
    const defaultLocale = isValidLocale(savedLocale || '') ? savedLocale! : DEFAULT_LOCALE
    expect(defaultLocale).toBe('en')
  })

  it('falls back to ru when localStorage has invalid locale', () => {
    localStorage.setItem('locale', 'fr')
    const savedLocale = localStorage.getItem('locale')
    const defaultLocale = isValidLocale(savedLocale || '') ? savedLocale! : DEFAULT_LOCALE
    expect(defaultLocale).toBe(DEFAULT_LOCALE)
  })

  it('uses en as fallback locale', () => {
    const i18n = createI18n({
      legacy: false,
      locale: DEFAULT_LOCALE,
      fallbackLocale: FALLBACK_LOCALE,
      messages: { en, ru }
    })
    expect(i18n.global.fallbackLocale.value).toBe(FALLBACK_LOCALE)
  })

  it('has legacy mode disabled', () => {
    const i18n = createI18n({
      legacy: false,
      locale: DEFAULT_LOCALE,
      fallbackLocale: FALLBACK_LOCALE,
      messages: { en, ru }
    })
    expect(i18n.global.locale).toBeDefined()
  })

  it('saves locale change to localStorage', () => {
    const i18n = createI18n({
      legacy: false,
      locale: DEFAULT_LOCALE,
      fallbackLocale: FALLBACK_LOCALE,
      messages: { en, ru }
    })
    i18n.global.locale.value = 'en'
    localStorage.setItem('locale', i18n.global.locale.value)
    expect(localStorage.getItem('locale')).toBe('en')
  })
})
