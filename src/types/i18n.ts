export interface LocaleConfig<T = Record<string, unknown>> {
  code: string
  label: string
  messages: T
}
