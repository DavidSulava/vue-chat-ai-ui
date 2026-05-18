import { describe, it, expect } from 'vitest'
import en from '../../i18n/locales/en'
import ru from '../../i18n/locales/ru'
import { getFlatKeys, getNestedValue } from './_test-utils'

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
})
