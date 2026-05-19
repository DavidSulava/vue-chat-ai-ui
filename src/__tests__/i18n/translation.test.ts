import { describe, it, expect } from 'vitest'
import en from '../../i18n/locales/en'
import ru from '../../i18n/locales/ru'
import { getFlatKeys, getNestedValue } from './_test-utils'

describe('Translation completeness', () => {
  const requiredSections = ['common', 'auth', 'chat', 'header'] as const

  requiredSections.forEach((section) => {
    it(`${section} section exists in en`, () => {
      expect(en[section]).toBeDefined()
    })

    it(`${section} section exists in ru`, () => {
      expect(ru[section]).toBeDefined()
    })
  })

  it('every en key has a non-empty ru translation', () => {
    const enKeys = getFlatKeys(en)
    const missingOrEmpty = enKeys.filter((key) => {
      const ruValue = getNestedValue(ru, key)
      return typeof ruValue !== 'string' || ruValue.trim() === ''
    })
    expect(missingOrEmpty).toEqual([])
  })

  it('every ru key has a non-empty en translation', () => {
    const ruKeys = getFlatKeys(ru)
    const missingOrEmpty = ruKeys.filter((key) => {
      const enValue = getNestedValue(en, key)
      return typeof enValue !== 'string' || enValue.trim() === ''
    })
    expect(missingOrEmpty).toEqual([])
  })

  it('translations are actual strings, not objects or null', () => {
    const enKeys = getFlatKeys(en)
    const ruKeys = getFlatKeys(ru)

    enKeys.forEach((key) => {
      const value = getNestedValue(en, key)
      expect(typeof value).toBe('string')
    })

    ruKeys.forEach((key) => {
      const value = getNestedValue(ru, key)
      expect(typeof value).toBe('string')
    })
  })
})
