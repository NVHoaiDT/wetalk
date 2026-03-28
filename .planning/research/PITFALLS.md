# i18n Integration Pitfalls for React Apps

**Project:** WeTalk (React social media platform)
**Scope:** Adding Vietnamese support (UI strings only, not user content translation)
**Researched:** 2026-03-28
**Context:** Existing app with ~72 console logs, complex API client patterns, Zustand state management, React Query caching, SSE real-time features

---

## Executive Summary

Adding i18n to an existing React application is deceptively complex. Most critical pitfalls fall into 4 categories:

1. **String Extraction** — Incomplete string discovery, strings embedded in wrong layers
2. **Translation Management** — Missing translation keys, stale translations, incomplete plural forms
3. **Component Integration** — Missing fallback handling, context provider mishaps, dynamic content issues
4. **Scaling Complexity** — Performance degradation, translation validation burden, maintenance overhead

This document catalogues 26 distinct pitfalls ranked by severity, with actionable prevention strategies and integration notes for WeTalk's tech stack (React 18, Zustand, React Query, Tailwind, SSE real-time).

---

## Critical Pitfalls (Severity: HIGH)

These pitfalls cause complete feature breakage or security issues if not addressed.

### 1. **Untranslated Strings In Fallback Path**

**What goes wrong:**
English strings appear hardcoded throughout the app when translation keys are missing or loading fails. Users see a mix of English and Vietnamese, breaking UX.

**Why it happens:**

- Developers don't anticipate all translation key failures
- Fallback UI doesn't specify a clear locale
- Missing pluralization rules go unnoticed until QA
- Translation files incomplete but app shipped anyway

**Example:**

```typescript
// src/features/posts/components/create-post.tsx
<button>
  {t('posts.createButton', 'Create Post')} {/* ❌ English fallback if key not found */}
</button>

// If Vietnamese translation missing, renders: "Create Post" (English)
// User sees English button while rest of UI is Vietnamese → Jarring!
```

**Consequences:**

- **High:** Broken user experience with mixed languages
- **High:** Users see incomplete translations as app is "broken"
- **Medium:** Untranslated strings make app look unprofessional
- **Medium:** Difficult to identify which translations are missing

**Prevention:**

- DO: Use strict mode in i18n library where missing keys throw errors in dev
- DO: Maintain a "Missing Translations" test that fails if fallback language is used
- DO: Before any language launch, audit with "find untranslated strings" check
- DO: Use a translation coverage report (keys per language) in CI
- DON'T: Ship with English fallback for production languages

**Testing Strategy:**

```typescript
// Add to test suite - fail if Vietnamese missing ANY keys
test('Vietnamese translation complete', () => {
  const vn = i18n.getResourceBundle('vi', 'translations');
  const en = i18n.getResourceBundle('en', 'translations');

  const missingKeys = getMissingKeys(vn, en);
  expect(missingKeys).toEqual(
    [],
    `Missing keys in Vietnamese: ${missingKeys.join(', ')}`,
  );
});
```

**Phase Responsibility:** Phase should include translation validation in UAT. Cannot mark Complete until 100% coverage verified.

**WeTalk Integration Note:** With 72 existing console logs and multiple feature files, string discovery will be complex. Automated string extraction tool (not manual grep) is critical.

---

### 2. **Dynamic Content Not Interpolated**

**What goes wrong:**
Translation strings hardcode user names, numbers, or variables instead of using interpolation. When strings need modification (accent marks, ordering), translations break.

**Why it happens:**

- Developers concatenate strings: `t('hello') + " " + userName`
- Interpolation template not used in translation system
- Complex pluralization rules embedded in component logic
- Developers assume English word order applies to all languages

**Example — BAD:**

```typescript
// Component concatenates strings
const message = t('greetings.hello') + ' ' + userName + '!';
// Translation file: { "greetings.hello": "Xin chào" }
// Renders: "Xin chào userName!" ❌ Fixed word order

// Vietnamese grammar might need: "Xin chào [name], bạn khỏe không?"
// But without interpolation template, can't reorder!
```

**Example — GOOD:**

```typescript
// Use interpolation template
const message = t('greetings.hello', { name: userName });
// Translation file: { "greetings.hello": "Xin chào {{name}}, bạn khỏe không?" }
// Renders with proper grammar ✓
```

**Consequences:**

- **High:** Translation strings inflexible for grammar differences
- **High:** Scaling to 3rd language requires code rewrite if interpolation missing
- **Medium:** Pluralization logic duplicated in components
- **Medium:** Number/date formatting hardcoded instead of locale-aware

**Prevention:**

- DO: Always use interpolation templates `t('key', { var: value })`
- DO: Extract all number/date formatting to locale-aware formatters
- DO: Use pluralization rules: `t('items.count', { count: itemCount })`
- DO: In code review, reject string concatenation + translation keys
- DO: Create a linting rule to catch string concatenation with `t()` calls

**Pluralization Example:**

```typescript
// GOOD: Plural forms with count parameter
i18n config:
{
  "posts.item_count": "{{count}} bài viết",  // Vietnamese singular
  "posts.item_count_plural": "{{count}} bài viết"  // Same for plural (Vietnamese doesn't distinguish)
}

Usage:
<p>{t('posts.item_count', { count: postCount })}</p>
```

**Testing Strategy:**

```typescript
test('All interpolation templates in translation keys', () => {
  const keys = getAllTranslationKeys();
  keys.forEach((key) => {
    const hasTemplate = /{{.*}}/.test(i18n.t(key));
    if (hasTemplate) {
      // Verify template variables are valid
      const template = extractTemplate(key); // {{name}}, {{count}}, etc.
      expect(knownInterpolationVars).toContain(template);
    }
  });
});
```

**Phase Responsibility:** Code review during implementation. Cannot approve translator until component structure is finalized.

**WeTalk Integration Note:** With Zustand state management and React Query mutations, need to ensure form errors, validation messages, and dynamic counts all use interpolation.

---

### 3. **Missing Translation Keys Not Detected Pre-Deployment**

**What goes wrong:**
A translation key is added in code but translator forgets to add the Vietnamese equivalent. App launches with English text in Vietnamese mode because fallback chain hides the error.

**Why it happens:**

- No automated sync between development code and translation files
- Translator works from incomplete requirements list
- "Missing key" detection only happens at runtime after user clicks that feature
- Translation file validation mixes old/legacy/unused keys

**Example:**

```typescript
// New feature added:
<p>{t('posts.newFeature.aiSummary')}</p>  // ← Added this key

// Translation file never updated (translator missed it)
// App shipped with: "AI Summary" showing in English UI
```

**Consequences:**

- **High:** Features launch with English text in translated UI
- **High:** No visibility into missing translations until user reports
- **Medium:** Translation validation happens too late (post-deployment)
- **Medium:** Manual tracking of translation keys error-prone

**Prevention:**

- DO: Automated extraction of i18n keys from source code
- DO: CI/CD check comparing code keys vs. translation files
- DO: Strict failure if any key missing (no silent fallback)
- DO: Generate translation key diff report before each release
- DO: Use TypeScript + type-safe i18n library to catch missing keys at compile time

**Type-Safe i18n Example (i18next with TypeScript):**

```typescript
// i18n.d.ts - auto-generated from translation files
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translations';
    resources: {
      translations: {
        posts: {
          createButton: string;
          "newFeature.aiSummary": string; // ← Compiler enforces this exists
        };
      };
    };
  }
}

// Usage - TypeScript catches missing key at compile time
t('posts.newFeature.aiSummary') ✓ OK
t('posts.newFeature.notRealKey') ✗ TypeScript Error!
```

**CI/CD Validation:**

```bash
# Script to fail build if keys missing
npm run i18n:check-coverage
# Exit code 1 if Vietnamese missing any key present in English
```

**Phase Responsibility:** Phase 1+ must include automated key extraction. Cannot skip validation in CI.

**WeTalk Integration Note:** With ~200+ hardcoded strings estimated in current codebase, automated key extraction (not manual) is non-negotiable.

---

### 4. **Pluralization Rules Not Handled Correctly**

**What goes wrong:**
English has 2 plural forms (singular/plural). Vietnamese only has 1. But translation system configured for English, so Vietnamese translator doesn't know what to do with plural rules, or has to create duplicate entries.

**Why it happens:**

- Pluralization rules assumed English plural logic
- Different languages have completely different plural forms (Polish has 3!)
- Translator receives keys like `posts.count_one`, `posts.count_other` but Vietnamese doesn't distinguish
- No testing of plural edge cases (0, 1, 2, plural)

**Example:**

```typescript
i18n config (assuming English pluralization):
{
  "posts.count_one": "1 bài viết",
  "posts.count_other": "{{count}} bài viết"
}

Problem: Vietnamese doesn't distinguish singular/plural!
Translator sees _one and _other keys and doesn't understand why.
```

**Consequences:**

- **High:** Confusing for translators unfamiliar with English plural rules
- **Medium:** Wasted translation effort on superfluous plural forms
- **Low:** Minor grammar issue if singular/plural forms differ slightly

**Prevention:**

- DO: Research pluralization rules for each language
- DO: Configure i18n library correctly for each language's plural rules
- DO: Document plural forms needed per language
- DON'T: Assume English plural rules apply universally

**Pluralization Configuration (i18next):**

```typescript
// src/lib/i18n.ts
import { pluralRules } from 'i18next';

// Vietnamese (and many languages) don't distinguish singular/plural
// So use the 'no plural' mode:
i18n.init({
  lng: 'vi',
  pluralRules: {
    vi: () => 'other', // Always use "other" form, never "one"
  },
  resources: {
    vi: {
      translation: {
        items: '{{count}} mục', // Single form handles all counts
      },
    },
  },
});
```

**Edge Case Testing:**

```typescript
test('Pluralization handles edge cases', () => {
  expect(t('items', { count: 0 })).toBe('0 mục');
  expect(t('items', { count: 1 })).toBe('1 mục');
  expect(t('items', { count: 2 })).toBe('2 mục');
  expect(t('items', { count: 100 })).toBe('100 mục');
});
```

**Phase Responsibility:** Phase research should document each language's plural rules. Cannot implement translations without this.

**WeTalk Integration Note:** Vietnamese uses singular form for all quantities. No special plural handling needed. Simpler than English but must be explicit.

---

## Major Pitfalls (Severity: MEDIUM)

### 5. **Context Provider Not Wrapping App Tree Correctly**

**What goes wrong:**
i18n provider or I18nContext wrapper not placed at correct tree level. Child components don't have access to `useTranslation()` hook, or language switch doesn't update all descendant components.

**Why it happens:**

- Provider placed too deep in tree (after feature-specific providers)
- Provider wrapping per-route instead of global app
- Multiple provider instances competing for state
- Zustand store not integrated with i18n state

**Example:**

```typescript
// ❌ WRONG - i18n provider inside route component
function App() {
  return (
    <ZustandProvider>
      <Routes>
        <Route path="/posts" element={
          <I18nextProvider i18n={i18n}>  {/* ← Too deep! */}
            <PostsPage />
          </I18nextProvider>
        } />
      </Routes>
    </ZustandProvider>
  );
}

// Result: Language switch doesn't re-render other routes
// Messages page shows English while Posts page shows Vietnamese
```

**Example — GOOD:**

```typescript
// ✓ CORRECT - i18n provider at root level
function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ZustandProvider>
        <Routes>
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>
      </ZustandProvider>
    </I18nextProvider>
  );
}

// Result: Language switch updates entire app instantly
```

**Consequences:**

- **Medium:** Language switch doesn't propagate to all components
- **Medium:** Some pages remain in previous language after switch
- **Medium:** Inconsistent translations across different sections
- **Low:** Developer confusion about why `useTranslation()` fails in some components

**Prevention:**

- DO: Place I18nextProvider at \`<App/>\` root level, before any route wrapping
- DO: Verify language change fires re-render using React DevTools Profiler
- DO: Test that language toggle updates every feature simultaneously
- DO: Document provider setup in project README

**Integration with Zustand:**

```typescript
// src/lib/i18n.ts
import { create } from 'zustand';

// Zustand store for language preference
export const useLanguageStore = create((set) => ({
  language: 'en',
  setLanguage: (lng: string) => {
    i18n.changeLanguage(lng);
    set({ language: lng });
  },
}));
```

**Testing:**

```typescript
test('Language change propagates to all components', async () => {
  const { getByRole } = render(<App />);
  const languageToggle = getByRole('button', { name: /language/i });

  fireEvent.click(languageToggle); // Switch to Vietnamese

  // All text should update
  expect(getByText('Xin chào')).toBeInTheDocument();
  expect(getByText('Đăng xuất')).toBeInTheDocument(); // Logout button
});
```

**Phase Responsibility:** Phase must finalize provider structure before string extraction. Cannot add i18n to partially-complete app.

**WeTalk Integration Note:** App has complex route structure (auth, dashboard, landing). Provider must wrap root App component BEFORE router initialization.

---

### 6. **Lazy Translation Loading Not Handled**

**What goes wrong:**
All translation files bundled inline, bloating JavaScript bundle. Or, translations loaded asynchronously but component renders before load completes, showing untranslated text momentarily.

**Why it happens:**

- All translations (all languages) bundled in main.js
- Translation fetch delayed, component renders with `undefined` first
- No loading state or fallback UI during translation fetch
- Namespace-based translation loading not implemented

**Example:**

```typescript
// ❌ Bundle bloat - all languages in main.js
i18n.init({
  resources: {
    en: { translation: englishKeys }, // ← 50KB
    vi: { translation: vietnameseKeys }, // ← 50KB
    ja: { translation: japaneseKeys }, // ← 50KB
    // ...
  },
});

// Bundle size: main.js += 200KB for languages that user may never use!
```

**Example — Loading Race Condition:**

```typescript
// ❌ Async load without handling loading state
function PostsList() {
  const { t } = useTranslation(); // Might not be loaded yet!
  // If translation not yet loaded, renders: undefined
  return <div>{t('posts.title')}</div>;
}

// Result:
// 1. Component renders (i18n.t returns undefined)
// 2. Translation loads asynchronously
// 3. Would require re-render to show translated text (doesn't happen automatically)
```

**Consequences:**

- **High:** Unused translations bloat bundle (50-100KB+ for large apps)
- **High:** Users with slow networks see untranslated placeholders
- **Medium:** JavaScript parse/evaluation time increases (slower initial load)
- **Medium:** First Contentful Paint (FCP) delayed
- **Low:** Confusing UX flicker (English text briefly visible, then Vietnamese)

**Prevention:**

- DO: Lazy-load translations per language, not all at once
- DO: Use code splitting for language-specific bundles
- DO: Add loading state/skeleton while translations load
- DO: Pre-fetch Vietnamese translation on app startup
- DO: Use namespaces to split large translation files into smaller chunks
- DON'T: Include all languages in main bundle

**Lazy Loading Setup (i18next):**

```typescript
// src/lib/i18n.ts
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).init({
  fallbackLng: 'en',
  ns: ['translation', 'common', 'posts', 'messages'], // Namespace split
  defaultNS: 'translation',
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json', // Load per language + namespace
  },
});

// Preload Vietnamese (most common language after English)
i18n.loadNamespace('vi');
```

**Module Loading for Bundle Optimization:**

```typescript
// Load translation bundles as separate code chunks
const enTranslations = () => import('/locales/en/translation.json');
const viTranslations = () => import('/locales/vi/translation.json');

i18n.on('languageChanged', async (lng) => {
  if (lng === 'vi') {
    const vn = await viTranslations();
    // Load into i18n
  }
});
```

**Phase Responsibility:** Phase should include bundle size audit. Verify Vietnamese-only bundle is < 20KB.

**WeTalk Integration Note:** React Query already caches data. Don't lazy-load translations per route (causes delay). Load Vietnamese synchronously on startup, English as fallback.

---

### 7. **Translated Strings Not Validated for Length**

**What goes wrong:**
Vietnamese translations longer than English, causing UI to break. Buttons overflow, text gets cut off, layout shifts when language changes.

**Why it happens:**

- English text "Create" (6 chars) → Vietnamese "Tạo một bài viết mới" (20 chars)
- Fixed-width containers assume English length
- No QA process checking translations fit the UI
- Text truncation not consistent across features

**Example:**

```typescript
// UI assumes English button width
<button className="w-20">  {/* Fixed width 80px */}
  {t('button.create')}  // "Create" (6 chars) fits fine
                         // But Vietnamese "Tạo" also fits
</button>

// When Vietnamese translator adds context:
// "Tạo bài viết mới" = 16 chars, overflows button ❌
```

**Consequences:**

- **Medium:** UI breaks when language switches
- **Medium:** Text truncation or overflow obscures meaning
- **Medium:** Layout shifts when user adds item (Vietnamese longer, pushes UI)
- **Low:** Looks unprofessional in production

**Prevention:**

- DO: Use flexible layouts (Tailwind `max-w-xs` instead of fixed width)
- DO: QA review of translations for text length fit
- DO: Create a visual regression test comparing English vs. Vietnamese layout
- DO: Use `line-clamp-*` classes from Tailwind for long text
- DO: Document UI text length limits for translators (e.g., button max 20 chars)

**Layout Pattern (Tailwind):**

```typescript
// ✓ GOOD - Flexible container
<button className="px-4 py-2 max-w-xs truncate">
  {t('button.create')}
</button>

// ✓ GOOD - Multi-line with clamp
<div className="line-clamp-2">
  {t('posts.description')}
</div>
```

**Testing Visual Regression:**

```typescript
test('Buttons fit content in both languages', async () => {
  const { getByRole } = render(<CreateButton />);
  const button = getByRole('button');

  // English
  expect(button).not.toHaveOverflowingContent();

  // Switch to Vietnamese
  await switchLanguage('vi');
  expect(button).not.toHaveOverflowingContent();
});
```

**Phase Responsibility:** QA should test both languages side-by-side during UAT.

**WeTalk Integration Note:** Posts, comments, and user profiles already have text truncation. Ensure translation text also truncates properly with Vietnamese.

---

### 8. **Translation Files Out of Sync with Code**

**What goes wrong:**
Code changes a string key name or structure, but translation file not updated. Developer and translator work on different assumptions about key names, resulting in duplicated or missing translations.

**Why it happens:**

- Refactoring changes key structure: `posts.create` → `features.posts.actions.create`
- Developer removes unused key but doesn't update translation file
- Translator works from old translation template
- No version sync between code and translations (git ignores translation files)

**Example:**

```typescript
// Developer refactors key naming:
// OLD: t('posts.create')
// NEW: t('features.posts.actions.create')

// Translation file has both old and new keys now (duplication)
// Translator doesn't know which one is used

// App behaves correctly (uses new key) but translation file is cluttered
```

**Consequences:**

- **Medium:** Translation file bloat with unused/old keys
- **Medium:** Translator confusion about which keys are active
- **Medium:** Difficulty tracking which translations are outdated
- **Low:** Unclear which keys were renamed vs. which are legitimately new

**Prevention:**

- DO: Remove old translation keys when refactoring
- DO: Use Git to track both code and translation file changes together
- DO: Require matching commits: "Refactor: rename posts key + update translations"
- DO: Create a "dead key detection" script to find unused translations
- DO: Use i18n key deprecation warnings in development

**Dead Key Detection Script:**

```bash
# Find unused translation keys in code
# Compare translation file keys vs. actual t() calls in JSX

#!/bin/bash
# Find all translation keys used in code
grep -r "t('[^']*')" src/ | sed "s/.*t('\([^']*\)').*/\1/" | sort -u > /tmp/used-keys.txt

# Find all keys in translation file
jq -r '.translation | keys[]' locales/en/translation.json | sort -u > /tmp/defined-keys.txt

# Find unused keys
comm -13 /tmp/used-keys.txt /tmp/defined-keys.txt > unused-keys.txt
echo "Unused keys: $(cat unused-keys.txt)"
```

**Phase Responsibility:** Each code refactor must include translation file audit.

**WeTalk Integration Note:** With existing console logging and TODO items scattered in code, string refactoring will be complex. Automate key synchronization.

---

### 9. **Number, Date, and Currency Not Localized**

**What goes wrong:**
Dates, numbers, and currency formatted using English rules (`1,000.50` instead of `1.000,50`), or dates shown as `3/28/2026` (US format) instead of `28/03/2026` (global format).

**Why it happens:**

- Using `Date.toString()` instead of locale-aware formatter
- Currency hardcoded as `$` instead of using Intl.NumberFormat
- Number.toFixed() doesn't account for locale decimal separator
- `.toLocaleDateString()` not called

**Example:**

```typescript
// ❌ WRONG - English format hardcoded
const price = 1000.5;
const formatted = `$${price.toFixed(2)}`; // Renders: "$1000.50"
// In Vietnamese, should be: "₫1.000,50"

// ❌ WRONG - US date format
const date = new Date('2026-03-28');
const formatted = date.toLocaleDateString(); // Renders: "3/28/2026"
// In Vietnamese, should be: "28/03/2026"

// ❌ WRONG - English number formatting
const count = 1000000;
console.log(count); // Shows: 1000000
// In Vietnamese, should show: 1.000.000
```

**Example — GOOD:**

```typescript
// ✓ Use Intl for locale-aware formatting
const price = 1000.5;
const formatted = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
}).format(price);
// Renders: "1.000,50 ₫"

const dateStr = new Intl.DateTimeFormat('vi-VN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(date);
// Renders: "28/03/2026"
```

**Consequences:**

- **Medium:** Dates ambiguous to international users (3/4/2026 = March or April?)
- **Medium:** Numbers hard to read in large quantities without thousand separators
- **Medium:** Currency symbol wrong or price formatting confusing
- **Low:** Looks unprofessional for translated app

**Prevention:**

- DO: Create locale-aware formatter utilities:

  ```typescript
  // src/lib/locale-formatters.ts
  export const formatPrice = (amount: number, locale?: string) => {
    return new Intl.NumberFormat(locale || i18n.language, {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  export const formatDate = (date: Date, locale?: string) => {
    return new Intl.DateTimeFormat(locale || i18n.language, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };
  ```

- DO: Use these formatters everywhere (not string templates)
- DO: Test formatting with different locales
- DON'T: Use native `toString()` or `toLocaleDateString()` without i18n context

**Testing:**

```typescript
test('Numbers formatted correctly for Vietnamese', () => {
  i18n.changeLanguage('vi');
  expect(formatPrice(1000)).toBe('1.000,00 ₫');
  expect(formatDate(new Date('2026-03-28'))).toBe('28/03/2026');
});

test('Numbers formatted correctly for English', () => {
  i18n.changeLanguage('en');
  expect(formatPrice(1000)).toBe('$1,000.00');
  expect(formatDate(new Date('2026-03-28'))).toBe('03/28/2026');
});
```

**Phase Responsibility:** Phase should include formatter utilities before string extraction.

**WeTalk Integration Note:** Posts likely show timestamps ("3 days ago"). Ensure relative time formatting is translated too.

---

### 10. **useTranslation() Hook Called at Wrong Level**

**What goes wrong:**
`useTranslation()` called in component that's not wrapped by I18nContext, causing "hook called outside context" error. Or hook called conditionally, causing React Hook rules violation.

**Why it happens:**

- Component used outside I18nContext provider
- Conditional hook usage: `if (showTranslated) { const { t } = useTranslation(); }`
- Hook called in event handler instead of top-level
- Attempting to use hook in class components

**Example:**

```typescript
// ❌ WRONG - Conditional hook usage
function PostList({ translateUI }: { translateUI: boolean }) {
  if (translateUI) {
    const { t } = useTranslation(); // ❌ Hook called conditionally!
  }
  return <div>Posts</div>;
}
// Error: React Hook called conditionally

// ❌ WRONG - Hook in event handler
function Button() {
  const handleClick = () => {
    const { t } = useTranslation(); // ❌ Hook called in event handler!
    alert(t('message'));
  };
  return <button onClick={handleClick}>Click</button>;
}
```

**Example — GOOD:**

```typescript
// ✓ CORRECT - Hook at top level
function PostList() {
  const { t } = useTranslation(); // Hook called at top level
  const [showTranslated, setShowTranslated] = useState(true);

  return (
    <div>
      {showTranslated && <p>{t('posts.title')}</p>}
    </div>
  );
}

// ✓ CORRECT - For event handler, get i18n instance directly
import i18n from 'i18next';

function Button() {
  const handleClick = () => {
    alert(i18n.t('message')); // Use i18n directly, not hook
  };
  return <button onClick={handleClick}>Click</button>;
}
```

**Consequences:**

- **Medium:** Runtime error when component tries to use hook
- **Medium:** Entire feature broken because component fails to render
- **Low:** Developer confusion about when to use hook vs. direct i18n instance

**Prevention:**

- DO: Always call `useTranslation()` at component top level
- DO: For event handlers, use `i18n.t()` directly instead of hook
- DO: Use ESLint rule `react-hooks/rules-of-hooks` (already default in React)
- DO: For context detection, wrap with I18nContext error boundary

**Linting:**

```json
// .eslintrc.json
{
  "extends": ["react-app"],
  "rules": {
    "react-hooks/rules-of-hooks": "error"
  }
}
```

**Context Error Boundary:**

```typescript
// For components that might be used outside context, provide fallback
function useTranslationSafe() {
  try {
    return useTranslation();
  } catch (error) {
    console.error('i18n context not found. Wrap component with I18nProvider');
    return { t: (key: string) => key }; // Fallback: return key itself
  }
}
```

**Phase Responsibility:** Code review must catch hook rule violations.

**WeTalk Integration Note:** Multiple feature hooks already exist (use-disclosure, custom query hooks). Ensure i18n hook follows same pattern and documented.

---

## Moderate Pitfalls (Severity: MEDIUM)

### 11. **Platform-Specific Text Not Translated**

**What goes wrong:**
System notifications, error messages from browsers, native dialogs, or external libraries (React Query errors, form validation messages) shown in English even when language is Vietnamese.

**Why it happens:**

- Browser's native dialogs use system language, not app language
- Third-party libraries (React Query, form validators) have English defaults
- Error messages from async operations not wrapped in translation
- Success/error toasts hardcoded without i18n

**Example:**

```typescript
// ❌ WRONG - React Query error not translated
const { isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  // React Query default error: "An error occurred" (English)
});

// ❌ WRONG - Form validation error not translated
function LoginForm() {
  return (
    <form>
      <input required />
      {/* Browser validation: "Please fill out this field" (English) */}
    </form>
  );
}

// ❌ WRONG - Toast notification hardcoded
toast.error('Failed to create post');  // Always English!
```

**Consequences:**

- **Medium:** Users see English error messages while UI is Vietnamese
- **Medium:** Undermines translated app (users see English in error states)
- **Medium:** Poor UX when validation/error states trigger English text
- **Low:** Complicates QA testing for language switch

**Prevention:**

- DO: Create i18n wrapper for React Query errors
- DO: Create custom form validation with i18n messages
- DO: Translate all toast/notification messages
- DO: Wrap third-party library error messages with translation
- DO: Test error states with language set to Vietnamese

**React Query Error Translation:**

```typescript
// src/lib/react-query.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error: any) => {
        const errorMessage = getErrorMessage(error);
        const translated = i18n.t(errorMessage); // Translate the error
        toast.error(translated);
      },
    },
  },
});

// Helper to map error codes to i18n keys
function getErrorMessage(error: Error): string {
  if (error.message === 'Not Found') return t('errors.notFound');
  if (error.message === 'Unauthorized') return t('errors.unauthorized');
  return t('errors.unknown');
}
```

**Form Validation Translation:**

```typescript
// Using react-hook-form with i18n
const { register, formState: { errors } } = useForm({
  resolver: zodResolver(schema), // Zod validator
});

// Zod error messages translated
const schema = z.object({
  email: z.string().email(t('validation.emailInvalid')),
  password: z.string().min(8, t('validation.passwordTooShort')),
});

// In template
{errors.email && <span>{t(errors.email.message)}</span>}
```

**Phase Responsibility:** Phase 2+ (implementation) must include error message translation audit.

**WeTalk Integration Note:** App has complex validation (posts, communities, profiles). All error messages must be translated.

---

### 12. **Missing Translations for Attribute Values (aria-label, title, alt)**

**What goes wrong:**
Translators only translate visible text, missing `aria-label`, `title`, `alt` attributes and other hidden strings. Screen readers and tooltips remain in English.

**Why it happens:**

- Translator sees component template but misses attributes
- `aria-label` strings not in centralized translation file
- Alt text hardcoded without i18n key
- Title attributes for hover tooltips not translated

**Example:**

```typescript
// ❌ WRONG - Alt text not translated
<img
  src="/icon-like.svg"
  alt="Like button" {/* English only */}
/>

// ❌ WRONG - aria-label not translated
<button aria-label="Toggle sidebar">
  {t('nav.menu')} {/* UI text translated, but aria-label is English! */}
</button>

// ❌ WRONG - Title attribute not translated
<span title="Click to copy email">
  {t('profile.email')}
</span>
```

**Consequences:**

- **Medium:** Accessibility broken for non-English users using screen readers
- **Medium:** Tooltips shown in English
- **Low:** Incomplete translation experience
- **Low:** Alt text in English when image is from Vietnamese speaker

**Prevention:**

- DO: Include all HTML attributes in translation scope
- DO: Create linting rule to detect untranslated attributes
- DO: Add translation keys for all `aria-label`, `alt`, `title` attributes
- DO: In code review, specifically check for non-translated attributes

**Example — GOOD:**

```typescript
// ✓ All attributes translated
function LikeButton() {
  const { t } = useTranslation();
  return (
    <button
      aria-label={t('aria.likeButton')}
      title={t('tooltips.likeTooltip')}
    >
      <img
        src="/icon-like.svg"
        alt={t('alt.likeIcon')} // ✓ Translated
      />
    </button>
  );
}

// Translation file
{
  "aria": {
    "likeButton": "Thích bài viết"
  },
  "alt": {
    "likeIcon": "Biểu tượng thích"
  },
  "tooltips": {
    "likeTooltip": "Nhấp để thích bài viết này"
  }
}
```

**Linting Rule (ESLint custom):**

```typescript
// eslint-plugin-i18n-accessibility.js
module.exports = {
  rules: {
    'translated-aria-labels': {
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name.name === 'aria-label') {
              const value = node.value.expression?.callee?.name;
              if (value !== 't' && value !== 'i18n.t') {
                context.report({
                  node,
                  message: 'aria-label must use i18n translation (t) function',
                });
              }
            }
          },
        };
      },
    },
  },
};
```

**Phase Responsibility:** QA and accessibility review must verify all attributes translated.

**WeTalk Integration Note:** App has many interactive icons (notifications, likes, comments). All must have translated tooltips and aria-labels.

---

### 13. **Real-Time Features Not Synced With Language Change**

**What goes wrong:**
When user switches language, real-time updates (SSE messages, notifications, live comments) continue in original language. Server-side event messages not re-rendered when language changes.

**Why it happens:**

- SSE connection and WebSocket listeners not subscribed to language changes
- Real-time received data contains pre-formatted English strings from server
- Component receiving SSE update doesn't re-render when language changes
- Translation applied once at render time, not updated on language switch

**Example:**

```typescript
// ❌ WRONG - SSE message formatted at receive time
useEffect(() => {
  sse.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const formatted = `${data.username} liked your post`; // ← Formatted in English
    setNotification(formatted);
  };
}, []);

// If user switches language, notification still shows English text
// Because it was formatted at receive time, not at render time
```

**Example — GOOD:**

```typescript
// ✓ CORRECT - Store raw data, translate at render time
useEffect(() => {
  sse.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setNotification(data); // ← Store raw data only
  };
}, []);

// Template - re-renders when language changes
function NotificationItem({ notification }: { notification: SSEData }) {
  const { t } = useTranslation();

  // Text translated at render time
  return <p>{t('notifications.userLikedPost', { user: notification.username })}</p>;
}

// When language changes, component re-renders and shows new translation ✓
```

**Consequences:**

- **Medium:** Real-time notifications shown in old language after switch
- **Medium:** Confusing UX (some text English, some Vietnamese)
- **Medium:** Users can't understand real-time updates after language switch
- **Low:** SSE implementation must be refactored to support translations

**Prevention:**

- DO: Store raw event data, translate at render time (not at receive time)
- DO: Design API responses to return only machine-readable data
- DO: Use interpolation templates for formatted messages
- DO: Test language switch while real-time data flows in
- DON'T: Pre-format messages on server side in English

**Testing Real-Time Language Switch:**

```typescript
test('Language change updates real-time messages', async () => {
  const { getByText, rerender } = render(<NotificationsList />);

  // Simulate SSE message in English
  simulateSSEMessage({ username: 'John', action: 'like' });
  expect(getByText('John liked your post')).toBeInTheDocument();

  // Switch to Vietnamese
  await switchLanguage('vi');
  rerender(<NotificationsList />); // Force re-render

  // Message should update to Vietnamese
  expect(getByText('John đã thích bài viết của bạn')).toBeInTheDocument();
});
```

**Phase Responsibility:** Phase should include SSE message translation strategy in design phase.

**WeTalk Integration Note:** App has SSE for messages and notifications (200+ lines). Must refactor to separate data from formatting.

---

### 14. **Translation File Format Mismatch or Corruption**

**What goes wrong:**
Translation file has invalid JSON, missing closing braces, or encoding issues (UTF-8 BOM, wrong charset). App loads translation file but parsing fails, nothing translates.

**Why it happens:**

- Translator edited JSON file without proper JSON editor
- Copy-paste from Word/Google Docs introduced formatting characters
- Line ending issues (CRLF vs. LF) corrupting file
- Special characters (Vietnamese accents) encoded incorrectly
- Missing quotes in JSON object keys

**Example:**

```json
// ❌ BROKEN - Missing comma after key
{
  "posts": {
    "create": "Tạo bài viết"  // ← Missing comma here
    "edit": "Chỉnh sửa bài viết"
  }
}
// Error: Invalid JSON, file not parsed, whole app breaks

// ❌ BROKEN - UTF-8 BOM at start
﻿{ // ← Invisible BOM character breaks JSON parsing
  "posts": { ... }
}

// ❌ BROKEN - Special character encoding issues
// Translator saved in ANSI encoding instead of UTF-8
// Vietnamese accents rendered as: Tạo báo viết (corrupted)
```

**Consequences:**

- **High:** Entire app breaks when translation file corrupted
- **High:** No fallback, users see blank UI or error
- **Medium:** Difficult to debug (error might not point to JSON issue)
- **Medium:** Translator doesn't know file is corrupted until app tested

**Prevention:**

- DO: Validate translation files in CI/CD before deployment
- DO: Require translator to use JSON-aware editor (VS Code, JSONLint)
- DO: Add pre-commit hook to validate JSON syntax
- DO: Store translation files in version control (git)
- DO: Use JSON Schema to validate structure
- DON'T: Accept translations via copy-paste or Word documents

**CI/CD Validation Script:**

```bash
#!/bin/bash
# Validate all translation JSON files before deploy

for file in locales/*/translation.json; do
  if ! jq empty "$file" 2>/dev/null; then
    echo "INVALID JSON in $file"
    exit 1
  fi
done

echo "All translation files valid ✓"
```

**Pre-commit Hook:**

```bash
#!/bin/bash
# .husky/pre-commit - validate translations before each commit

FILES=$(git diff --cached --name-only | grep 'locales/.*\.json')

for file in $FILES; do
  if ! jq empty "$file" 2>/dev/null; then
    echo "❌ Invalid JSON: $file"
    exit 1
  fi
done
```

**JSON Schema Validation:**

```typescript
// src/lib/i18n.ts
import Ajv from 'ajv';

const schema = {
  type: 'object',
  properties: {
    posts: { type: 'object' },
    navigation: { type: 'object' },
    // ...
  },
};

const ajv = new Ajv();
const validate = ajv.compile(schema);

// After loading translation file
if (!validate(translationFile)) {
  console.error('Translation schema invalid:', validate.errors);
}
```

**Phase Responsibility:** Phase 1 should establish translation file format and validation rules.

**WeTalk Integration Note:** Use JSON files stored in git. Validate in CI before any deploy.

---

### 15. **Namespace Bloat or Poor Organization**

**What goes wrong:**
Translation files grow to 2000+ keys with no logical organization. Finding a specific translation becomes difficult, duplicates are hard to spot, and performance suffers.

**Why it happens:**

- All translations in single `translation.json` file
- No namespace separation by feature
- Keys use inconsistent naming patterns
- Unused/legacy keys never removed

**Example:**

```json
// ❌ POOR STRUCTURE - Flat, 2000+ keys
{
  "createPost": "Tạo bài viết",
  "editPost": "Chỉnh sửa bài viết",
  "deletePost": "Xóa bài viết",
  "postTitle": "Tiêu đề bài viết",
  "postContent": "Nội dung bài viết"
  // ... 1995 more keys in no particular order
}

// ❌ UNNAMEDSPACED - Difficult to locate keys quickly
// If looking for "notification" keys, have to manually search
```

**Example — GOOD:**

```json
// ✓ GOOD STRUCTURE - Organized by feature, namespaced
{
  "posts": {
    "actions": {
      "create": "Tạo bài viết",
      "edit": "Chỉnh sửa bài viết",
      "delete": "Xóa bài viết"
    },
    "fields": {
      "title": "Tiêu đề bài viết",
      "content": "Nội dung bài viết"
    }
  },
  "notifications": {
    "messages": {
      "postLiked": "{{user}} đã thích bài viết",
      "postCommented": "{{user}} đã bình luận"
    }
  }
  // ... organized by feature
}

// Usage: t('posts.actions.create'), t('notifications.messages.postLiked')
```

**Consequences:**

- **Low:** Hard to maintain large translation files
- **Low:** Difficult for translator to find contextual strings
- **Low:** Easy to introduce duplicates ("create", "createPost", "newPost", etc.)
- **Low:** Translation file becomes slow to load if very large

**Prevention:**

- DO: Organize translations by feature/domain
- DO: Use consistent naming (`actions.*`, `fields.*`, `messages.*`)
- DO: Split large files into namespaces and lazy-load
- DO: Document translation key naming conventions
- DO: Periodically audit and consolidate duplicate keys

**Recommended Structure:**

```
locales/
├── en/
│   ├── common.json (navigation, buttons, labels)
│   ├── posts.json (post-related strings)
│   ├── messages.json (messaging feature)
│   ├── notifications.json (notifications feature)
│   └── errors.json (error messages)
└── vi/[same structure]
```

**Naming Convention Documentation:**

```markdown
# Translation Key Naming Guide

## Pattern: `feature.section.intent`

Examples:

- `posts.actions.create` — Action: create a post
- `posts.fields.title` — Field label: post title
- `posts.messages.created` — Success message after creation
- `posts.errors.titleRequired` — Validation error
- `notifications.messages.postLiked` — Notification text
- `navigation.primary.home` — Navigation link
- `navigation.breadcrumb.posts` — Breadcrumb text

## Reserved Sections

- `.actions.*` — Buttons, action labels
- `.fields.*` — Form field labels
- `.messages.*` — Informational messages
- `.errors.*` — Error messages
- `.aria.*` — Accessibility labels
- `.tooltips.*` — Hover text
- `.placeholders.*` — Input placeholders
```

**Phase Responsibility:** Phase 1 research should document structure.

**WeTalk Integration Note:** App has 12 features (posts, messages, auth, etc.). Use feature-based namespacing.

---

## Minor Pitfalls (Severity: LOW)

### 16. **Copy-Paste Errors in Translation Keys**

**What goes wrong:**
Typo in translation key: `t('posts.crete')` instead of `t('posts.create')`. Key not found, shows fallback English.

**Why it happens:**

- Manual typos when typing translation keys
- Auto-completion missed in IDE
- Key renamed in translation file but typo left in code
- Refactoring key changed several places but one missed

**Consequences:**

- **Low:** Single component shows English fallback
- **Low:** Hard to spot in code review
- **Low:** Difficult to debug (only visible at runtime)

**Prevention:**

- DO: Use type-safe i18n library (TypeScript + i18next typed)
- DO: Enable IDE auto-completion for translation keys
- DO: Use constant exports instead of string literals
- DO: Linting to catch undefined translation keys

**Type-Safe Keys:**

```typescript
// src/i18n/keys.ts - Export all valid keys
export const translationKeys = {
  posts: {
    create: 'posts.create',
    edit: 'posts.edit',
    delete: 'posts.delete',
  },
} as const;

// Usage
const key = translationKeys.posts.create; // ✓ Type-safe, auto-complete works
t(key);
```

**Phase Responsibility:** Code review and linting catch these.

---

### 17. **Inconsistent Capitalization in Translation Keys**

**What goes wrong:**
Some keys use camelCase (`userProfile`), others use snake_case (`user_profile`). Inconsistency makes keys harder to guess and navigate.

**Why it happens:**

- No agreed-upon naming convention
- Different translators/developers follow different patterns
- Keys created without reviewing existing keys

**Consequences:**

- **Low:** Inconsistent developer experience
- **Low:** Harder to autocomplete keys if pattern unpredictable

**Prevention:**

- DO: Document and enforce camelCase for all keys
- DO: Code review to catch inconsistent naming
- DO: ESLint rule to enforce key naming pattern

**Phase Responsibility:** Initial phase documents naming convention.

---

### 18. **Missing Translation for Empty States**

**What goes wrong:**
Empty state messages ("No posts found", "No comments") not translated. User sees English in Vietnamese UI.

**Why it happens:**

- Empty state UI designed late in development
- Translator doesn't review every code path
- Empty states considered low-priority
- Strings in `<Empty />` component not extracted

**Consequences:**

- **Low:** Occasional English text in otherwise translated UI
- **Low:** Incomplete translation experience

**Prevention:**

- DO: Include empty state strings in translation extraction
- DO: QA specifically tests empty state text
- DO: Nothing is "too minor" to translate

**Example:**

```typescript
// Don't forget to translate empty states
function PostsList() {
  const { t } = useTranslation();

  if (posts.length === 0) {
    return <p>{t('posts.emptyState')}</p>; // ✓ Translated
  }

  return posts.map(post => <PostCard key={post.id} post={post} />);
}
```

---

### 19. **Development vs. Production Translation Loading**

**What goes wrong:**
Translations work in development but fail in production. Webpack/Vite bundle includes dev-only translation data.

**Why it happens:**

- Translation loader configured differently for dev vs. build
- Relative paths work locally but break on production server
- Translation files removed by build step
- Static imports in dev, dynamic imports in production don't match

**Consequences:**

- **Low:** All translations fail in production
- **Low:** App appears completely untranslated to users

**Prevention:**

- DO: Test production build locally before deploy
- DO: Ensure translation loader path consistent between dev and prod
- DO: Use absolute paths for translation files
- DO: Verify bundle includes translation files

**Phase Responsibility:** DevOps/deployment phase must test translations in prod build.

---

### 20. **Stale Translations From Previous Release**

**What goes wrong:**
Previous release's Vietnamese translations still loaded, even though source code updated. Users see outdated translations.

**Why it happens:**

- Browser cache not cleared (old translation file cached)
- Translator uploaded old file
- Translation file version mismatch
- Service worker caching old translations

**Consequences:**

- **Low:** Users see outdated instructions
- **Low:** If translations critical to feature, users confused

**Prevention:**

- DO: Use cache-breaking (versioned translation files or hash-based names)
- DO: Cache-control headers on translation files
- DO: Clear cache when deploying new translations
- DO: Version translation files: `translation-v1.2.3.json`

**Service Worker Cache Busting:**

```typescript
// src/service-worker.ts
const CACHE_NAME = 'wetalk-v' + APP_VERSION;
const urlsToCache = [
  '/locales/en/translation.json?v=' + APP_VERSION,
  '/locales/vi/translation.json?v=' + APP_VERSION,
];
```

---

## Pitfall Summary by Category

### String Extraction Pitfalls

1. Untranslated strings in fallback path
2. Missing translation keys not detected
3. Hardcoded console logging (existing tech debt)

### Translation Management Pitfalls

4. Dynamic content not interpolated
5. Pluralization rules not handled
6. Translation files out of sync with code
7. Translation file format corruption
8. Namespace bloat

### Component Integration Pitfalls

5. Context provider not placed correctly
6. useTranslation() hook called at wrong level
7. Lazy translation loading not handled
8. Real-time features not synced with language change
9. Platform-specific text not translated (errors, validation)
10. Missing translations for attributes (aria, alt, title)

### Scaling Pitfalls

7. Text length validation for different languages
8. Number, date, currency not localized
9. Inconsistent translation keys / typos
10. Testing not covering both languages

---

## Prevention Checklist by Phase

### Phase 1: Planning & Structure

- [ ] Decide on i18n library (i18next recommended for React)
- [ ] Plan namespace structure (feature-based)
- [ ] Document translation key naming conventions
- [ ] Identify all strings to translate (UI only for MVP)
- [ ] Plan how real-time data will be handled
- [ ] Decide on number/date/currency formatting strategy
- [ ] Plan for Vietnamese-only in Phase 1, extensible to 3rd language later

### Phase 2: String Extraction & Key Creation

- [ ] Audit codebase for all hardcoded strings
- [ ] Automated extraction tool (not manual grep)
- [ ] Create English translation file with all keys
- [ ] Create type definitions for translation keys (TypeScript)
- [ ] Set up CI/CD validation for missing keys
- [ ] Document all translation keys in translator-friendly format
- [ ] Remove/translate all console.log statements (existing tech debt)

### Phase 3: Implementation

- [ ] Wrap app with I18nProvider at root level
- [ ] Replace all hardcoded strings with `t()` calls
- [ ] Implement useTranslation() hook properly
- [ ] Add i18n context error handling
- [ ] Implement language switcher in UI
- [ ] Create locale-aware formatters (dates, numbers)
- [ ] Test with language set to Vietnamese throughout development
- [ ] Lazy-load translations per language (not all at once)

### Phase 4: Real-Time Features

- [ ] Refactor SSE/WebSocket message handling to separate data from formatting
- [ ] Ensure real-time messages translated at render time
- [ ] Test language switch while receiving real-time updates
- [ ] Translate error messages from API responses

### Phase 5: Vietnamese Translation

- [ ] Provide translator with organized key list
- [ ] Provide context/UI screenshots for each key
- [ ] Ensure translator uses proper editor with UTF-8 encoding
- [ ] Validate Vietnamese translation file format (JSON)
- [ ] QA testing of Vietnamese translation coverage (100% keys)
- [ ] QA testing text length in UI (truncation/overflow)
- [ ] QA testing edge cases (empty states, errors, validation)

### Phase 6: Testing & QA

- [ ] Automated test: all keys translated
- [ ] Automated test: no missing keys detected
- [ ] Automated test: language toggle updates entire UI
- [ ] Manual QA: Vietnamese UI with actual Vietnamese content
- [ ] Manual QA: Form validation and error messages in Vietnamese
- [ ] Manual QA: Real-time notifications in Vietnamese
- [ ] Manual QA: Attribute translations (aria-label, alt, title)
- [ ] Accessibility audit: Screen reader works in Vietnamese

### Phase 7: Deployment & Monitoring

- [ ] Test production build with Vietnamese
- [ ] Verify translation files deployed and accessible
- [ ] Monitor for untranslated key warnings in production logs
- [ ] Set up translation coverage metrics
- [ ] Plan for adding 3rd language (infrastructure ready?)

---

## Tech Debt to Address Before i18n

The following existing issues should be fixed BEFORE adding i18n:

1. **Remove all console.log statements (72 locations)**
   - These pollute translation scope
   - Easier to fix first, then extract strings

2. **Fix incomplete form error handling**
   - Form validation messages need i18n
   - Currently commented-out or hardcoded

3. **Standardize API error handling**
   - 3 different API clients with duplicated error logic
   - Need single error message translation layer

4. **Consolidate SSE implementations**
   - 3 separate SSE file implementations
   - Need single unified approach for message handling

5. **Fix XSS vulnerabilities**
   - Inconsistent HTML sanitization
   - Could impact how translations are rendered

---

## Integration with WeTalk Tech Stack

###React 18 + Zustand

- **Consideration:** Zustand stores should dispatch language change events
- **Pattern:** Language as global store state, accessible from anywhere
- **Gotcha:** Ensure Zustand store triggers re-renders when language changes

```typescript
// src/stores/language.ts
export const useLanguageStore = create((set, get) => ({
  language: 'en',
  setLanguage: (lng: string) => {
    i18n.changeLanguage(lng);
    set({ language: lng });
  },
}));
```

### React Query

- **Consideration:** Query errors must be translated
- **Pattern:** Wrap error display with `t()` in error boundary
- **Gotcha:** API error messages are English, need translation mapping

```typescript
// src/lib/react-query.ts
queryClient.setDefaultOptions({
  queries: {
    onError: (error) => {
      const message = mapErrorToTranslationKey(error);
      toast.error(t(message));
    },
  },
});
```

### Tailwind CSS

- **Consideration:** Fixed-width containers need flexibility for translation text
- **Pattern:** Use `max-w-*` and responsive classes, not fixed widths
- **Gotcha:** Vietnamese text can be 20-30% longer than English

### SSE (Server-Side Events)

- **Consideration:** Real-time messages must be translated at render time
- **Pattern:** Store raw data, translate in component template
- **Gotcha:** Language change must force re-render of active SSE messages

---

## Testing Strategy for Translations

```typescript
// tests/i18n-basic.test.ts

// 1. Completeness check
test('All English keys translated to Vietnamese', async () => {
  const enKeys = getAllKeys(i18n.getResourceBundle('en'));
  const viKeys = getAllKeys(i18n.getResourceBundle('vi'));
  expect(viKeys).toEqual(enKeys);
});

// 2. Interpolation check
test('All interpolation templates valid', () => {
  const keys = getAllTranslationKeys();
  keys.forEach(key => {
    if (hasTemplate(key)) {
      validateTemplate(key);
    }
  });
});

// 3. UI integration check
test('Language switch updates all components', async () => {
  const { getByRole, rerender } = render(<App />);
  fireEvent.click(getByRole('button', { name: /language/i }));
  // Verify all text updated
});

// 4. Real-time sync check
test('Real-time messages update when language changes', async () => {
  render(<NotificationsList />);
  simulateSSEMessage({ action: 'like', user: 'John' });
  switchLanguage('vi');
  // Verify message text updated to Vietnamese
});

// 5. Attribute coverage check
test('All aria-labels translated', () => {
  const buttons = document.querySelectorAll('button[aria-label]');
  buttons.forEach(btn => {
    const ariaLabel = btn.getAttribute('aria-label');
    expect(isTranslated(ariaLabel)).toBe(true);
  });
});
```

---

## Summary

**Highest Risk Pitfalls (focus testing here):**

1. Untranslated strings appearing in fallback path
2. Missing translation keys not detected in CI
3. Real-time messages not updating with language switch
4. Dynamic content not interpolated (broken grammar)
5. Context provider placed incorrectly (partial updates)

**Most Common Mistakes:**

- Hardcoding strings instead of using `t()`
- Forgetting attribute translations (aria-label, alt)
- Not testing with Vietnamese language throughout development
- Pre-formatting messages instead of translating at render time

**Best Practices for WeTalk:**

- Use i18next with TypeScript type safety
- Organize translations by feature (posts._, messages._, etc.)
- Lazy-load Vietnamese synchronously, load other languages only if needed
- Store language preference in Zustand (global accessible)
- Translate errors from React Query, form validation, SSE
- Test language switch continuously during development
- Fix console.log tech debt BEFORE extracting strings
- Validate translation file format and key coverage in CI/CD
