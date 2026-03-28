# Phase 3: Component Integration — Context & Decisions

**Phase:** 03-component-integration  
**Date:** 2026-03-29  
**Decision Date:** Auto-locked (Phase 2 dependencies satisfied, no gray areas)

---

## Phase Goal

Wire all React components with `useTranslation()` hook. Replace hardcoded English strings with translation key calls (`t('key')`). Setup test mocking for component testing without translation overhead.

**Input Dependency:** Phase 2 (186 translation keys in public/locales/en/ JSON files)  
**Output:** All components integrated with i18n, tests mocking enabled, zero hardcoded strings visible to users

---

## Locked Decisions

### D-01: Component Integration Approach

**Decision:** Feature-first, sequential component wiring (not all-at-once refactoring)

**Rationale:**
- Phase 2 provides JSON keys organized by feature
- Each feature can be integrated independently
- Enables parallel team work (multiple features simultaneously)
- Reduces integration complexity (single feature per task)

**Implementation:**
- Task 1: Audit and identify all components in src/components/ and src/features/ (determine scope)
- Task 2: Create integration pattern (custom hook for mocking, provider wrapper for tests)
- Waves 1-4: Wire feature-by-feature (auth → messages → posts → communities → others)

**Impact:** All 12 features wired with i18n before Phase 4 starts

---

### D-02: useTranslation Hook Usage Pattern

**Decision:** Import `useTranslation()` at component level, use `t('key')` for all UI strings

**Rationale:**
- Standard React pattern (matches react-i18next conventions)
- Simple to audit (grep for `t(` finds all usages)
- Enables namespace scoping (e.g., `useTranslation('posts')`)

**Implementation:**
```typescript
// Pattern for all components
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t } = useTranslation('featureName');
  return <button>{t('action.create')}</button>;
}
```

**Impact:** Consistent pattern across all 100+ components

---

### D-03: Test Mocking Strategy

**Decision:** Mock translations in Vitest setup; no actual i18n loading in component tests

**Rationale:**
- Component tests should test UI logic, not translation system
- Mocking prevents test flakiness (no external file I/O)
- Simplifies test maintenance (no translation key tracking)

**Implementation:**
```typescript
// In setup-tests.ts, mock useTranslation before component tests run
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Return key as fallback
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));
```

**Impact:** All component tests pass without translation files; mocking enables isolation

---

### D-04: Component Audit & Wiring Scope

**Decision:** Include all UI components (src/components/) + all feature components (src/features/*/components/)

**Rationale:**
- Comprehensive coverage prevents "forgotten" components with hardcoded strings
- Phase 2 audit identified 520+ strings — all have corresponding JSON keys
- No component should be omitted

**Implementation:**
- Task 1: Scan src/components/ and src/features/ for all .tsx files (100+ components estimated)
- Create master list with component count per feature
- Wire in feature priority order (auth first, then messages, posts, communities, etc.)

**Impact:** 100% component coverage, zero hardcoded strings visible to users

---

### D-05: Hardcoded String Removal Verification

**Decision:** Post-wiring verification: scan codebase for remaining hardcoded English strings

**Rationale:**
- Ensures no strings were missed during manual wiring
- Automated check prevents regression
- Confidence that Phase 3 goal is truly achieved

**Implementation:**
- Task (Wave 4): Run regex scanner to find remaining hardcoded patterns
  - Pattern: `['"][A-Z][a-zA-Z ]+['"]` (capitalized English strings)
  - Exclude comments, errors, constants
  - Report zero matches = Phase 3 complete

**Impact:** Objective verification that hardcoded strings are eliminated

---

## Gray Areas (None — Auto-Locked)

All implementation decisions are derived from Phase 2 scope and standard React patterns. No user input required.

---

## Scope Boundaries

### In Scope ✅

- Wire 100+ components with useTranslation() hook
- Replace hardcoded strings with t('key') calls
- Create test mocking pattern (Vitest setup)
- Test utilities with provider wrapper
- Verify zero hardcoded strings remain (post-wiring scan)
- Documentation: component integration pattern guide

### Out of Scope ❌

- Creating new translation keys (Phase 2 already defined 186 keys)
- Vietnamese translations (Phase 5)
- Language switching UI (Phase 4)
- E2E testing of language switching (Phase 6)
- Theme-based i18n or special formatting (future feature)

---

## Estimated Scope

**Components to wire:** ~100-120 UI components across 12 features  
**Time estimate:** 3-4 days of focused work  
**Complexity:** Medium (high volume, low per-component complexity)  
**Risk:** None (Phase 2 provides complete key set, pattern is standardized)

---

## Next Steps

→ Execute `/gsd-plan-phase 3` to generate Phase 3 plans (PLAN.md files)  
→ Then execute `/gsd-execute-phase 3` to wire all components

---

_Locked: 2026-03-29_  
_All decisions auto-derived from Phase 2 scope._  
_No gray areas — proceed with planning._
