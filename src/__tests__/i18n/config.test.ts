import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  isValidLocale,
  LOCALE_CODES
} from '../../i18n/config'

describe('i18n configuration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('uses en as default locale when localStorage is empty', async () => {
    vi.resetModules()
    const { default: i18n } = await import('../../i18n')
    expect(i18n.global.locale.value).toBe('en')
  })

  it('uses saved locale from localStorage when valid', async () => {
    localStorage.setItem('locale', 'en')
    vi.resetModules()
    const { default: i18n } = await import('../../i18n')
    expect(i18n.global.locale.value).toBe('en')
  })

  it('falls back to en when localStorage has invalid locale', async () => {
    localStorage.setItem('locale', 'fr')
    vi.resetModules()
    const { default: i18n } = await import('../../i18n')
    expect(i18n.global.locale.value).toBe(DEFAULT_LOCALE)
  })

  it('has fallbackLocale set to en', async () => {
    vi.resetModules()
    const { default: i18n } = await import('../../i18n')
    expect(i18n.global.fallbackLocale.value).toBe(FALLBACK_LOCALE)
  })

  it('has legacy mode disabled', async () => {
    vi.resetModules()
    const { default: i18n } = await import('../../i18n')
    expect(i18n.mode).toBe('composition')
  })

  it('isValidLocale returns true for valid locales', () => {
    expect(isValidLocale('en')).toBe(true)
    expect(isValidLocale('ru')).toBe(true)
  })

  it('isValidLocale returns false for invalid locales', () => {
    expect(isValidLocale('fr')).toBe(false)
    expect(isValidLocale('')).toBe(false)
    expect(isValidLocale('invalid')).toBe(false)
  })

  it('LOCALE_CODES contains all supported locales', () => {
    expect(LOCALE_CODES).toContain('en')
    expect(LOCALE_CODES).toContain('ru')
    expect(LOCALE_CODES).toHaveLength(2)
  })
})
