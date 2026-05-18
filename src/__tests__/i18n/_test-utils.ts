export function getFlatKeys(
  obj: Record<string, unknown>,
  prefix = ''
): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return getFlatKeys(value as Record<string, unknown>, fullKey)
    }
    return fullKey
  })
}

export function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object')
      return (acc as Record<string, unknown>)[part]
    return undefined
  }, obj)
}
