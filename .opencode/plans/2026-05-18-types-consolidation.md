# TypeScript Types Consolidation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate all scattered TypeScript types into the `src/types/` directory, eliminate duplicate inline types, and add missing shared error types.

**Architecture:** Split `src/types/index.ts` into domain-specific files (`api.ts`, `i18n.ts`, `chat.ts`, `user.ts`) with a barrel `index.ts` that re-exports everything. Inline types in stores and views get replaced with proper named types.

**Tech Stack:** TypeScript 5.7, Vue 3, Pinia, Axios, Vitest

---

## File Structure

### New files to create:
- `src/types/chat.ts` — Chat-related interfaces (`ChatMessage`, `FormattedMessage`)
- `src/types/api.ts` — API request/response interfaces + shared error types
- `src/types/i18n.ts` — i18n configuration types
- `src/types/user.ts` — User-related interfaces (`UserData`, `SetUserPayload`)

### Files to modify:
- `src/types/index.ts` — Becomes a barrel file that re-exports from sub-modules
- `src/i18n/config.ts` — Import `LocaleConfig` from `../types/i18n`
- `src/stores/user.ts` — Replace inline `{ userId: string; name: string }` with `SetUserPayload`
- `src/views/HomeView.vue` — Replace inline axios error type with `ApiErrorResponse`
- `src/api/config.ts` — Use `ApiErrorResponse` instead of inline `{ error?: string }`

### Files to verify (no changes expected):
- `src/stores/chat.ts` — Import path works via barrel re-export
- `src/services/chatService.ts` — Import path works via barrel re-export
- `src/services/userService.ts` — Import path works via barrel re-export

---

### Task 1: Create `src/types/chat.ts`

**Files:**
- Create: `src/types/chat.ts`

- [ ] **Step 1: Extract chat-related interfaces**

Create `src/types/chat.ts`:

```typescript
export interface ChatMessage {
  message: string
  reply: string
}

export interface FormattedMessage {
  id: string
  role: 'user' | 'ai'
  content: string
}
```

- [ ] **Step 2: Run type check**

Run: `npx vue-tsc --noEmit`
Expected: PASS (new file not imported yet, existing types still in `index.ts`)

- [ ] **Step 3: Commit**

```bash
git add src/types/chat.ts
git commit -m "types: extract chat interfaces to dedicated module"
```

---

### Task 2: Create `src/types/api.ts`

**Files:**
- Create: `src/types/api.ts`

- [ ] **Step 1: Create API types with cross-import from chat**

Create `src/types/api.ts`:

```typescript
import type { ChatMessage } from './chat'

export interface RegisterUserRequest {
  name: string
  email: string
}

export interface RegisterUserResponse {
  userId: string
  name: string
}

export interface GetMessagesRequest {
  userId: string
}

export interface GetMessagesResponse {
  messages: ChatMessage[]
}

export interface ChatRequest {
  message: string
  userId: string
}

export interface ChatResponse {
  reply: string
}

export interface ApiErrorResponse {
  error?: string
  message?: string
}
```

- [ ] **Step 2: Run type check**

Run: `npx vue-tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/types/api.ts
git commit -m "types: extract API types and add shared ApiErrorResponse"
```

---

### Task 3: Create `src/types/i18n.ts`

**Files:**
- Create: `src/types/i18n.ts`

- [ ] **Step 1: Create i18n types**

Create `src/types/i18n.ts` as a generic interface (avoids circular dependency with locale files):

```typescript
export interface LocaleConfig<T = Record<string, unknown>> {
  code: string
  label: string
  messages: T
}
```

- [ ] **Step 2: Run type check**

Run: `npx vue-tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/types/i18n.ts
git commit -m "types: add i18n LocaleConfig interface"
```

---

### Task 4: Create `src/types/user.ts`

**Files:**
- Create: `src/types/user.ts`

- [ ] **Step 1: Create user types**

Create `src/types/user.ts`:

```typescript
export interface UserData {
  userId: string
  name: string
}

export interface SetUserPayload {
  userId: string
  name: string
}
```

- [ ] **Step 2: Run type check**

Run: `npx vue-tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/types/user.ts
git commit -m "types: extract user interfaces to dedicated module"
```

---

### Task 5: Convert `src/types/index.ts` to barrel file

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Replace content with re-exports**

Replace entire content of `src/types/index.ts`:

```typescript
export * from './api'
export * from './chat'
export * from './i18n'
export * from './user'
```

- [ ] **Step 2: Run type check**

Run: `npx vue-tsc --noEmit`
Expected: PASS — all existing imports of `../types` still resolve via barrel

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "types: convert index.ts to barrel re-export file"
```

---

### Task 6: Update `src/i18n/config.ts`

**Files:**
- Modify: `src/i18n/config.ts`

- [ ] **Step 1: Import LocaleConfig from types, remove local interface**

Replace entire content of `src/i18n/config.ts`:

```typescript
import en from './locales/en'
import ru from './locales/ru'
import type { LocaleConfig } from '../types'

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
```

- [ ] **Step 2: Run type check**

Run: `npx vue-tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Run i18n tests**

Run: `npx vitest run src/__tests__/i18n/config.test.ts`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/i18n/config.ts
git commit -m "refactor: use centralized LocaleConfig type from types module"
```

---

### Task 7: Update `src/stores/user.ts`

**Files:**
- Modify: `src/stores/user.ts`

- [ ] **Step 1: Replace inline type with SetUserPayload**

Replace entire content of `src/stores/user.ts`:

```typescript
import { defineStore } from 'pinia'
import type { SetUserPayload } from '../types'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null as string | null,
    name: null as string | null
  }),
  actions: {
    setUser(data: SetUserPayload) {
      this.userId = data.userId
      this.name = data.name
    },
    logout() {
      this.userId = null
      this.name = null
    }
  },
  persist: true
})
```

- [ ] **Step 2: Run type check**

Run: `npx vue-tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/stores/user.ts
git commit -m "refactor: replace inline user type with SetUserPayload"
```

---

### Task 8: Update `src/views/HomeView.vue`

**Files:**
- Modify: `src/views/HomeView.vue`

- [ ] **Step 1: Replace inline axios error type with ApiErrorResponse**

Replace the `<script setup>` block:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { userService } from '../services/userService'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import type { ApiErrorResponse } from '../types'
import robotImage from '../assets/robot.png'

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')

function goToChat() {
  router.push({ name: 'chat' })
}

async function createUser() {
  if (!name.value || !email.value) {
    error.value = t('home.nameEmailRequired')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await userService.registerUser({
      name: name.value,
      email: email.value
    })

    userStore.setUser({
      userId: response.userId,
      name: response.name
    })

    goToChat()
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: ApiErrorResponse }; message?: string }
    if (axiosError.response?.data?.message) {
      error.value = axiosError.response.data.message
    } else if (axiosError.response?.data?.error) {
      error.value = axiosError.response.data.error
    } else if (axiosError.message) {
      error.value = axiosError.message
    } else {
      error.value = t('home.somethingWrong')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (userStore.userId) {
    goToChat()
  }
})
</script>
```

- [ ] **Step 2: Run type check**

Run: `npx vue-tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/views/HomeView.vue
git commit -m "refactor: use ApiErrorResponse type instead of inline error shape"
```

---

### Task 9: Update `src/api/config.ts`

**Files:**
- Modify: `src/api/config.ts`

- [ ] **Step 1: Use ApiErrorResponse in interceptor**

Replace entire content of `src/api/config.ts`:

```typescript
import axios, { AxiosError, type AxiosInstance } from 'axios'
import type { ApiErrorResponse } from '../types'

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (!error.response) {
      return Promise.reject(
        new Error('Network error: Unable to connect to server')
      )
    }
    return Promise.reject(error)
  }
)
```

- [ ] **Step 2: Run type check**

Run: `npx vue-tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/api/config.ts
git commit -m "refactor: use ApiErrorResponse type in axios interceptor"
```

---

### Task 10: Final verification

- [ ] **Step 1: Run full type check**

Run: `npx vue-tsc --noEmit`
Expected: Zero errors

- [ ] **Step 2: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 3: Run linter**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 4: Verify final structure**

Expected:
```
src/types/
├── index.ts      # Barrel re-exports
├── api.ts        # API request/response + ApiErrorResponse
├── chat.ts       # ChatMessage, FormattedMessage
├── i18n.ts       # LocaleConfig
└── user.ts       # UserData, SetUserPayload
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "types: consolidate all TypeScript types into organized modules"
```

---

## Self-Review

### 1. Spec coverage
- Extract chat types → Task 1
- Extract API types + add ApiErrorResponse → Task 2
- Extract i18n types → Task 3
- Extract user types → Task 4
- Convert index.ts to barrel → Task 5
- Update i18n/config.ts → Task 6
- Update stores/user.ts → Task 7
- Update HomeView.vue → Task 8
- Update api/config.ts → Task 9
- Final verification → Task 10

### 2. Placeholder scan
No placeholders. All steps contain exact code, commands, and file paths.

### 3. Type consistency
- `ChatMessage` in `chat.ts`, imported in `api.ts` — consistent
- `ApiErrorResponse` in `api.ts`, used in `HomeView.vue` and `api/config.ts` — consistent
- `SetUserPayload` in `user.ts`, used in `stores/user.ts` — consistent
- `LocaleConfig` in `i18n.ts`, used in `i18n/config.ts` — consistent
- All types re-exported via barrel — existing `from '../types'` imports continue to work
