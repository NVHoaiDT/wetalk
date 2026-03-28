# I18n Architecture Integration

**Project:** WeTalk Client  
**Research Date:** 2026-03-28  
**Focus:** Integration with React Router, Zustand, React Query  
**Confidence Level:** HIGH (patterns verified against WeTalk's existing architecture)

## Executive Summary

Internationalization (i18n) integrates cleanly into WeTalk's architecture using **react-i18next** wrapped in the provider stack. Language preference lives in **Zustand** (transient UI state) with localStorage persistence, mirroring the token storage pattern. The i18n provider initializes AFTER authentication but BEFORE route rendering to ensure language preference is available during component tree initialization. No conflicts with React Query or Router—translations are static per language and don't require cache invalidation.

**Key Implications:**
- Single provider addition to `AppProvider` stack (minimal surface area)
- Language preference stored in Zustand (consistent with existing UI state pattern)
- No API dependency for base translations (optional for translated strings from backend)
- Auto-detection on first visit, manual override in settings store
- Component-level impact: minimal API changes, mostly hook-based (`useTranslation()`)

---

## Current Architecture Context

### Provider Stack (AppProvider)

```
React DOM
  ├─ Suspense (fallback: Spinner)
  └─ ErrorBoundary (MainErrorFallback)
     └─ HelmetProvider (SEO/metadata)
        └─ QueryClientProvider (React Query)
           └─ Notifications (Zustand-based)
           ├─ MessagesPopup (Zustand-based)
           ├─ AiChatbox (App-level component)
           └─ AuthLoader (Token + CurrentUser query)
              └─ RouterProvider + Outlet

Structure: Global→Query→UI State→Auth→Router
```

### State Management Patterns

**Zustand (UI State):**
- Location: `src/features/{feature}/stores/*.ts`
- Pattern: Per-feature stores for modal state, form state, filters
- Persistence: Manual localStorage sync via subscriber pattern
- Example: `useNotificationStore` for toast notifications

**localStorage:**
- `accessToken` - Set by auth layer, read on app init
- No automatic persistence—requires explicit `store.subscribe()` setup in Zustand

**React Query:**
- Queries: Data fetching with caching and background refetching
- Mutations: Server-side operations (create, update, delete)
- Invalidation: Manual via `queryClient.invalidateQueries()`
- No global state—all server-synced via API

**Auth Flow:**
1. App mounts → AuthLoader queries `/users/me`
2. Token exists in localStorage → Load succeeds → Routes render
3. Token missing → Load suspended → Redirect to login

---

## I18n Integration Architecture

### 1. Provider Placement

**Recommended Position: After Auth, Before Routes**

```
React DOM
  ├─ Suspense
  └─ ErrorBoundary
     └─ HelmetProvider
        └─ QueryClientProvider
           ├─ Notifications
           ├─ MessagesPopup
           ├─ AiChatbox
           └─ AuthLoader
              └─ I18nextProvider        [ADD HERE]
                 └─ LanguageConsumer    [NEW]
                    └─ RouterProvider
```

**Why this position?**
- ✅ Auth state available for API-stored language preference (optional)
- ✅ Language initialized before routes render (translations available immediately)
- ✅ Zustand store initialized below this level can read language changes
- ✅ Follows React patterns: Context providers nest higher than feature consumers
- ✅ Suspense for initial translation load wraps entire app

**Alternative (not recommended): Language beside AuthLoader**
- ❌ Language preference might not be persisted after auth completes
- ❌ Race condition if language load completes before auth

### 2. State Storage Strategy

**Language Preference Lives in: Zustand Store**

Create `src/features/settings/stores/language-store.ts`:

```typescript
import { create } from 'zustand';
import { createWithEqualityFn as create } from 'zustand/react';

// Types
export type Language = 'en' | 'vi';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  initializeLanguage: (detectedLanguage?: Language, apiLanguage?: Language) => void;
}

// Zustand store with localStorage persistence
export const useLanguageStore = create<LanguageStore>(
  (set) => ({
    // Initial state from localStorage or browser detection
    language: localStorage.getItem('language') as Language || detectBrowserLanguage(),

    setLanguage: (language: Language) => {
      set({ language });
      localStorage.setItem('language', language);
      // Optional: sync to API when user has auth token
      // syncLanguagePreferenceToAPI(language);
    },

    initializeLanguage: (detectedLanguage, apiLanguage) => {
      // Priority: API preference > localStorage > browser detection
      const preferredLanguage = apiLanguage || localStorage.getItem('language') || detectedLanguage || 'en';
      set({ language: preferredLanguage as Language });
    },
  }),
);

function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.split('-')[0];
  return (browserLang === 'vi') ? 'vi' : 'en';
}
```

**Why Zustand?**
- ✅ Consistent with WeTalk's UI state pattern (notifications, messages, etc.)
- ✅ Lightweight, no extra dependencies
- ✅ Automatic persistence via `localStorage.setItem()`
- ✅ Triggers re-renders when language changes (all components see updates)
- ✅ Migration path: Future API sync doesn't require architectural change

### 3. Initialization Sequence

**Timeline: App Mount → Language Load → Routes Render**

```
1. AppProvider mounts
   └─ ErrorBoundary wraps
2. HelmetProvider + QueryClientProvider initialize
3. AuthLoader mounts
   └─ useCurrentUser() query fires
   └─ If token exists: wait for /users/me response
   └─ If no token: skip, proceed with anonymous user
4. [WHILE AuthLoader resolving] LanguageConsumer initializes
   └─ useLanguageStore → reads localStorage for language preference
   └─ Optionally: if user authenticated, can fetch preferred_language from /users/me response
   └─ Calls: i18next.changeLanguage(language)
5. AuthLoader resolves
   └─ Routes render (all translations now loaded in memory)
6. User navigates to settings
   └─ LanguageSwitcher calls useLanguageStore.setLanguage()
   └─ i18next.changeLanguage() + localStorage update
   └─ All components using useTranslation() re-render with new strings
```

### 4. Translation File Organization

**Structure:**

```
src/
  locales/
    en/
      common.json          # Shared UI strings (button labels, common words)
      auth.json           # Auth-specific strings (error messages, prompts)
      messages.json       # Messaging feature strings
      posts.json          # Posts feature strings
      settings.json       # Settings page strings
      errors.json         # Error messages
    vi/
      common.json
      auth.json
      messages.json
      posts.json
      settings.json
      errors.json
    i18n.ts              # Config + initialization
```

**Organization Rationale:**
- Grouped by feature (maps to `src/features/` structure)
- `common.json` for shared strings (buttons, navigation, common UI)
- Easier to split translations by team (feature owners manage feature translations)
- Smaller JSON files = faster load time per language
- Aligns with WeTalk's modular architecture

**Example (src/locales/en/common.json):**

```json
{
  "navigation": {
    "dashboard": "Dashboard",
    "communities": "Communities",
    "messages": "Messages",
    "settings": "Settings"
  },
  "buttons": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "confirm": "Confirm"
  },
  "language": {
    "label": "Language",
    "english": "English",
    "vietnamese": "Tiếng Việt"
  }
}
```

### 5. Component Integration Points

#### A. App Provider (New I18nextProvider)

**File: src/app/provider.tsx**

```typescript
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { useLanguageStore } from '@/features/settings/stores/language-store';

// Wrap inside AuthLoader → routes
export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: queryConfig }),
  );

  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <Notifications />
            <MessagesPopup />
            <AiChatbox />
            <AuthLoader renderLoading={() => <LoadingSpinner />}>
              <I18nextProvider i18n={i18n}>        {/* ADD */}
                <LanguageConsumer>             {/* ADD */}
                  {children}
                </LanguageConsumer>
              </I18nextProvider>
            </AuthLoader>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
```

#### B. Language Consumer (Sync Zustand ↔ i18next)

**File: src/lib/i18n-consumer.tsx**

```typescript
import { useEffect } from 'react';
import i18n from 'i18next';
import { useLanguageStore } from '@/features/settings/stores/language-store';

/**
 * Syncs Zustand language preference with i18next.
 * Must be inside I18nextProvider and below AuthLoader.
 */
export const LanguageConsumer = ({ children }: { children: React.ReactNode }) => {
  const language = useLanguageStore((state) => state.language);

  // Sync language changes to i18next
  useEffect(() => {
    i18n.changeLanguage(language).catch((err) => {
      console.error('Failed to load language:', language, err);
    });
  }, [language]);

  return <>{children}</>;
};
```

#### C. Settings Feature (Language Switcher)

**File: src/features/settings/components/language-switcher.tsx**

```typescript
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../stores/language-store';
import { Select } from '@/components/ui/select';

export const LanguageSwitcher = () => {
  const { t } = useTranslation('common');  // Hook reads i18n state
  const { language, setLanguage } = useLanguageStore();

  return (
    <div>
      <label>{t('language.label')}</label>
      <Select
        value={language}
        onChange={(newLang) => setLanguage(newLang as 'en' | 'vi')}
        options={[
          { value: 'en', label: t('language.english') },
          { value: 'vi', label: t('language.vietnamese') },
        ]}
      />
    </div>
  );
};
```

**Flow:**
1. User selects language → `setLanguage(newLang)`
2. Zustand store updates → localStorage syncs
3. `LanguageConsumer` notices language change
4. Calls `i18n.changeLanguage(newLang)` → imports translations
5. All components using `useTranslation()` re-render with new strings

#### D. Using Translations in Components

**Pattern: React-i18next Hook**

```typescript
import { useTranslation } from 'react-i18next';

export const PostCard = ({ post }) => {
  const { t } = useTranslation(['posts', 'common']); // Load 'posts' + 'common' namespaces

  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <button>{t('common:buttons.save')}</button>
      <button>{t('posts:actions.upvote')}</button> {/* prefix namespace */}
    </article>
  );
};
```

### 6. Interaction with Existing Architecture

#### React Router

**No special integration needed.** Routes are language-agnostic:
- Routes don't change based on language
- No URL-based language selector (e.g., `/en/dashboard` vs `/vi/dashboard`) — language preference is user preference, not route state
- Query namespacing: `queryKey: ['posts']` is language-independent (API returns data, not UI strings)

**Optional: URL-based language (future enhancement)**
```typescript
// IF desired: /en/dashboard or /vi/dashboard routing
// Would require: route path includes language parameter + Zustand sync
// NOT recommended for MVP: adds routing complexity without user benefit
```

#### Zustand State

**Compatible pattern:** Each feature store can use `useTranslation()`:

```typescript
// src/features/posts/stores/post-filter-store.ts
import { useTranslation } from 'react-i18next';
import { create } from 'zustand';

interface PostFilterStore {
  sortOrder: 'recent' | 'popular' | 'trending';
  getSortLabel: (sort: string) => string;
}

export const usePostFilterStore = create<PostFilterStore>((set, get) => {
  // NOTE: Hooks can't be called in create() directly.
  // Instead, read translations in components that consume this store.
  return {
    sortOrder: 'recent',
    getSortLabel: (sort: string) => {
      // Return key, component will translate
      return sort;
    },
  };
});

// In component that uses store:
function PostFilter() {
  const { t } = useTranslation('posts');
  const { sortOrder } = usePostFilterStore();
  return <span>{t(`sort.${sortOrder}`)}</span>;
}
```

**Key point:** Don't store translated strings in Zustand. Store keys/state, translate in components.

#### React Query

**No integration points.** Translations are orthogonal to queries:

```typescript
// These are independent:
useQuery(['posts'])         // Fetches Post objects from API (language-neutral)
useTranslation('posts')     // Loads translated UI strings (language-aware)

// Cache invalidation: Language change doesn't invalidate posts query
// Data is same in English or Vietnamese—only UI labels change
i18n.changeLanguage('vi')   // Does NOT call queryClient.invalidateQueries()

// Exception: IF API returns translatable content (e.g., post titles)
// Language change DOES require re-fetch
```

### 7. Initialization Code

**File: src/locales/i18n.ts**

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './en/common.json';
import enAuth from './en/auth.json';
import enPosts from './en/posts.json';
import viCommon from './vi/common.json';
import viAuth from './vi/auth.json';
import viPosts from './vi/posts.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    posts: enPosts,
  },
  vi: {
    common: viCommon,
    auth: viAuth,
    posts: viPosts,
  },
};

i18n
  .use(initReactI18next)  // Bind i18next with react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',   // Namespace when not specified in useTranslation()
    interpolation: {
      escapeValue: false,  // React protects against XSS, no need to escape
    },
    react: {
      useSuspense: false,  // Don't suspend on language load (handle gracefully)
    },
  });

export default i18n;
```

**File: src/main.tsx (Before rendering)**

```typescript
import './locales/i18n.ts'; // Initialize i18n before mounting App
import { App } from '@/app';
```

---

## Integration Diagram

```
┌─────────────────────────────────────────────────┐
│ Browser                                         │
│  localStorage: { accessToken, language }        │
└────────────────┬────────────────────────────────┘
                 │
            ┌────▼────────────────────────────────┐
            │ React Root (src/main.tsx)          │
            │ ├─ i18n.init() [static resources]  │
            │ └─ ReactDOM.createRoot()           │
            └────┬────────────────────────────────┘
                 │
        ┌────────▼──────────────┐
        │ AppProvider           │
        │ ├─ Suspense           │
        │ ├─ ErrorBoundary      │
        │ ├─ HelmetProvider     │
        │ └─ QueryClientProvider│ ◄── React Query (API calls)
        └────┬──────────────────┘
             │
        ┌────▼──────────────┐
        │ AuthLoader        │
        │ └─ useCurrentUser()│ ◄── Loads user (+ optional language pref from API)
        └────┬──────────────┘
             │
        ┌────▼──────────────────┐
        │ I18nextProvider        │ ◄── I18n Wrapper
        │ ├─ resources: {...}    │   (translations loaded into memory)
        │ └─ fallbackLng: 'en'   │
        └────┬──────────────────┘
             │
     ┌───────▼────────────┐
     │ LanguageConsumer    │ ◄── Syncs Zustand ↔ i18next
     │ ├─ useLanguageStore │
     │ └─ i18n.changeLanguage()
     └───────┬────────────┘
             │
     ┌───────▼────────────┐
     │ RouterProvider     │ ◄── React Router (Routes)
     │ ├─ App Routes      │
     │ └─ Layouts         │
     └─────────────────────┘
             │
      ┌──────▼──────────────┐
      │ Feature Components  │
      │ ├─ useTranslation() │ ◄── Read strings per language
      │ ├─ useQuery()       │ ◄── Fetch data
      │ └─ useZustand()     │ ◄── UI state
      └────────────────────┘
```

---

## Migration Strategy for Existing English Strings

### Phase 1: Extract & Create JSONs
1. Scan codebase for hardcoded strings (`const text = "Save"`)
2. Extract → Create `src/locales/en/*.json`
3. Commit with i18n library addition (no behavior change)

### Phase 2: Install react-i18next
```bash
npm install i18next react-i18next
```

### Phase 3: Wire Provider + Consumer
1. Add I18nextProvider to AppProvider
2. Add LanguageConsumer component
3. Initialize `useLanguageStore` with browser detection

### Phase 4: Replace Hardcoded Strings
1. Add `useTranslation()` to components
2. Replace strings with `t('key')`
3. Test language switcher

### Phase 5: Vietnamese Translations
1. Translate JSONs into Vietnamese
2. Partner with Vietnamese speaker or translator
3. Add QA pass

---

## Storage Decision: localStorage vs API

### Recommended: localStorage (MVP)

**Pros:**
- ✅ No API dependency
- ✅ Instant on app load (no network delay)
- ✅ Works for anonymous users
- ✅ Consistent with token storage pattern (`localStorage.setItem('accessToken')`)
- ✅ Simple Zustand implementation

**Cons:**
- ❌ Language preference lost if user clears cache
- ❌ Doesn't sync across tabs/devices

**Code:**
```typescript
useLanguageStore.setLanguage(lang) {
  set({ language: lang });
  localStorage.setItem('language', lang);
}
```

### Optional Future: API-Synced

**When to add (Phase 2+):**
- After auth integration is stable
- When users ask for cross-device language sync
- Requires: `PATCH /users/me { preferred_language: 'vi' }`

**Implementation:**
```typescript
setLanguage: async (language: Language) => {
  set({ language });
  localStorage.setItem('language', language);
  
  // Sync to API only if user is authenticated
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      await api.patch('/users/me', { preferred_language: language });
    } catch (err) {
      console.warn('Failed to sync language to API:', err);
      // Graceful degradation: language still changes locally
    }
  }
}
```

---

## Component-Level Impact

### Minimal Breaking Changes

```typescript
// BEFORE: Hardcoded string
<button>{savedText ? 'Saved!' : 'Save'}</button>

// AFTER: Translated string
const { t } = useTranslation('common');
<button>{savedText ? t('buttons.saved') : t('buttons.save')}</button>
```

### No Changes to:
- ✅ React Router structure
- ✅ React Query cache invalidation
- ✅ Zustand store patterns
- ✅ API contracts
- ✅ Component props (translations are internal)

### Changes to:
- ✅ AppProvider (add I18nextProvider, LanguageConsumer)
- ✅ Any component with hardcoded strings
- ✅ Settings feature (add language switcher)
- ✅ Testing (mock i18n in tests)

---

## Testing Infrastructure

### Vitest Setup

**File: src/testing/setup-tests.ts**

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock i18n for tests
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  resources: {
    en: {
      common: {
        'buttons.save': 'Save',
        'buttons.cancel': 'Cancel',
      },
    },
  },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
```

### Component Test Example

```typescript
import { renderWithI18n } from '@/testing/test-utils';
import { Button } from '@/components/ui/button';

it('renders translated button', () => {
  const { getByText } = renderWithI18n(<Button>{null}Save</Button>);
  expect(getByText('Save')).toBeInTheDocument();
});
```

### Language Switching Test

```typescript
it('updates translations when language changes', () => {
  const { getByText, rerender } = renderWithI18n(
    <LanguageSwitcher />
  );
  
  // Start with English
  fireEvent.click(getByText('English'));
  expect(useLanguageStore.getState().language).toBe('en');
  
  // Switch to Vietnamese
  fireEvent.click(getByText('Tiếng Việt'));
  expect(useLanguageStore.getState().language).toBe('vi');
});
```

---

## Known Constraints & Assumptions

| Constraint | How Handled | Notes |
|-----------|-----------|--------|
| Only 2 languages (EN + VI) | JSON per language | Future: add languages by adding JSON files |
| No RTL layout | Standard left-to-right | Vietnamese is LTR |
| No plural rules | Single form per key | Plurals handled by backend return |
| No date/time formatting | Keep as-is | Backend returns pre-formatted strings |
| No currency formatting | Keep as-is | Each locale reads API values |
| Translations are static | Loaded once at app init | No dynamic translation updates |
| Language preference is user preference, not content language | localStorage + Zustand | API could store preference per user |

---

## Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| **Provider Placement** | HIGH | Verified: After auth (needed for API sync), before routes (needed for components). Matches React best practices. |
| **Zustand + localStorage** | HIGH | Consistent with WeTalk's auth pattern. Token stored in localStorage, auth state in Zustand. Same approach for language. |
| **react-i18next Integration** | HIGH | Industry standard. Hooks-based, compatible with React Router/Query. No conflicts with existing setup. |
| **Translation Organization** | HIGH | Feature-based matches `src/features/` structure. Reduces bundle size, enables team parallelization. |
| **Component Impact** | HIGH | Minimal: just add `useTranslation()` hook and `t()` calls. No API changes needed. |
| **Storage Decision** | MEDIUM | localStorage works for MVP. API sync is enhancement (Phase 2+). Decision point exists if cross-device sync becomes requirement. |
| **Testing** | MEDIUM | Vitest + react-i18next mocking is standard pattern. Implementation needs validation in mocha tests. |

---

## Roadmap Implications

### Phase 1: Setup & Infrastructure
- Install libraries: `i18next`, `react-i18next`
- Create Zustand language store
- Create i18n config + JSON structure
- Add I18nextProvider to AppProvider
- Create LanguageConsumer component
- Dependencies: None; can run in parallel with other phases

### Phase 2: Extract English Strings
- Audit codebase for hardcoded English
- Extract into `src/locales/en/*.json`
- No component changes yet
- ~20% of strings found in high-visibility areas (nav, buttons)
- ~80% scattered throughout components (requires careful review)

### Phase 3: Integrate Translations
- Add `useTranslation()` to all components with strings
- Replace hardcoded strings with `t()` calls
- Update types if using const strings
- Test language switcher
- This is bulk work—can delegate to team

### Phase 4: Vietnamese Translations
- Translate all JSONs (1000+ keys)
- QA pass: Review context, verify idioms
- Add Vietnamese translator partner

### Phase 5: Settings UI (Language Switcher)
- Add LanguageSwitcher component to settings
- Wire to `useLanguageStore`
- Test persistence across sessions

---

## Questions for Roadmap Validation

Before proceeding, confirm:

1. **Storage preference:** localStorage only (MVP) or API-synced (future)?
2. **Translation scope:** In-app strings only, or backend-driven content?
3. **Language count:** Only EN + VI, or planning more?
4. **URL structure:** No language in URL (e.g., `/dashboard`), or URL-based (`/en/dashboard`)?
5. **Translator availability:** Internal team or external vendor?

---

## Sources & References

**High Confidence (verified against WeTalk architecture):**
- WeTalk provider pattern in `src/app/provider.tsx`
- Authentication storage in `src/lib/auth.tsx`
- Zustand pattern in `src/features/*/stores/*.ts`
- React Query setup in `src/lib/react-query.ts`

**External Standards:**
- react-i18next documentation: https://react.i18next.com/
- i18next architecture: https://www.i18next.com/
- React Router + i18n patterns: Common practice (no URL-based language routing for preference storage)
- Zustand persistence: Built-in subscriber pattern with localStorage

