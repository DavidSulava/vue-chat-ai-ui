import { describe, it, expect } from 'vitest'
import en from '../../i18n/locales/en'
import ru from '../../i18n/locales/ru'

function getFlatKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return getFlatKeys(value as Record<string, unknown>, fullKey)
    }
    return fullKey
  })
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object')
      return (acc as Record<string, unknown>)[part]
    return undefined
  }, obj)
}

describe('Translation completeness', () => {
  const requiredSections = ['common', 'home', 'chat', 'header'] as const

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
