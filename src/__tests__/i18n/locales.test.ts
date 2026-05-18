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

describe('Locale structure', () => {
  it('en and ru have the same keys', () => {
    const enKeys = new Set(getFlatKeys(en))
    const ruKeys = new Set(getFlatKeys(ru))

    const missingInRu = [...enKeys].filter((k) => !ruKeys.has(k))
    const missingInEn = [...ruKeys].filter((k) => !enKeys.has(k))

    expect(missingInRu).toEqual([])
    expect(missingInEn).toEqual([])
  })

  it('en has no empty translation strings', () => {
    const flatEn = getFlatKeys(en)
    const emptyKeys = flatEn.filter((key) => {
      const value = getNestedValue(en, key)
      return typeof value === 'string' && value.trim() === ''
    })
    expect(emptyKeys).toEqual([])
  })

  it('ru has no empty translation strings', () => {
    const flatRu = getFlatKeys(ru)
    const emptyKeys = flatRu.filter((key) => {
      const value = getNestedValue(ru, key)
      return typeof value === 'string' && value.trim() === ''
    })
    expect(emptyKeys).toEqual([])
  })

  it('en has no duplicate values within the same top-level section', () => {
    const sections = Object.keys(en) as (keyof typeof en)[]
    sections.forEach((section) => {
      const sectionData = en[section] as Record<string, string>
      const values = Object.values(sectionData)
      const uniqueValues = new Set(values)
      expect(values.length).toBe(uniqueValues.size)
    })
  })

  it('ru has no duplicate values within the same top-level section', () => {
    const sections = Object.keys(ru) as (keyof typeof ru)[]
    sections.forEach((section) => {
      const sectionData = ru[section] as Record<string, string>
      const values = Object.values(sectionData)
      const uniqueValues = new Set(values)
      expect(values.length).toBe(uniqueValues.size)
    })
  })
})
