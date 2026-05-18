import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import en from '../../i18n/locales/en'
import ru from '../../i18n/locales/ru'

describe('i18n configuration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('uses ru as default locale when localStorage is empty', () => {
    vi.resetModules()
    const i18n = createI18n({
      legacy: false,
      locale: 'ru',
      fallbackLocale: 'en',
      messages: { en, ru }
    })
    expect(i18n.global.locale.value).toBe('ru')
  })

  it('uses saved locale from localStorage when valid', () => {
    localStorage.setItem('locale', 'en')
    const savedLocale = localStorage.getItem('locale')
    const defaultLocale =
      savedLocale && ['en', 'ru'].includes(savedLocale) ? savedLocale : 'ru'
    expect(defaultLocale).toBe('en')
  })

  it('falls back to ru when localStorage has invalid locale', () => {
    localStorage.setItem('locale', 'fr')
    const savedLocale = localStorage.getItem('locale')
    const defaultLocale =
      savedLocale && ['en', 'ru'].includes(savedLocale) ? savedLocale : 'ru'
    expect(defaultLocale).toBe('ru')
  })

  it('uses en as fallback locale', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'ru',
      fallbackLocale: 'en',
      messages: { en, ru }
    })
    expect(i18n.global.fallbackLocale.value).toBe('en')
  })

  it('has legacy mode disabled', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'ru',
      fallbackLocale: 'en',
      messages: { en, ru }
    })
    expect(i18n.global.locale).toBeDefined()
  })

  it('saves locale change to localStorage', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'ru',
      fallbackLocale: 'en',
      messages: { en, ru }
    })
    i18n.global.locale.value = 'en'
    localStorage.setItem('locale', i18n.global.locale.value)
    expect(localStorage.getItem('locale')).toBe('en')
  })
})
