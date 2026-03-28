# Milestone v1.0 Roadmap — Internationalization

**Project:** WeTalk (React social media platform)  
**Milestone:** v1.0 — Internationalization  
**Scope:** Vietnamese language support + i18n infrastructure for 5-10 languages  
**Target:** 7 phases, 30 requirements, ~6-8 weeks  
**Confidence:** HIGH (mature i18n ecosystem, clear extraction/translation workflow)

---

## Phases

- [x] **Phase 1: Foundation & Infrastructure** - i18next setup, providers, language detection, persistence
- [x] **Phase 2: String Extraction & Audit** - Complete UI string inventory and JSON structure
- [ ] **Phase 3: Component Integration** - Wire all components with useTranslation hooks
- [ ] **Phase 4: Language Switching & Settings UI** - User language preference UI and persistence
- [ ] **Phase 5: Vietnamese Translations** - Complete Vietnamese translation of all UI strings
- [ ] **Phase 6: Testing & Validation** - Translation coverage, E2E, and real-time testing
- [ ] **Phase 7: Documentation & Handoff** - Developer guides and maintenance checklists

---

## Phase Details

### Phase 1: Foundation & Infrastructure

**Goal:**  
Establish i18next/react-i18next infrastructure with automatic language detection, persistence mechanism, and TypeScript type safety. Enable all downstream phases to integrate with translation system.

**Depends on:**  
Nothing (foundation phase)

**Requirements:**  
I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, I18N-06

**Success Criteria (what must be TRUE):**

1. i18next v26.0.1 and react-i18next v17.0.1 installed and configured
2. i18n provider wraps entire app component tree (after Auth, before Routes)
3. Language detection works: browser locale auto-detected on first visit
4. Language preference persists in localStorage and Zustand store
5. TypeScript types prevent missing translation key errors at compile-time
6. Namespace structure initialized matching feature folders (posts, messages, auth, etc.)
7. Dev server runs without errors; no i18n-related warnings in console

**Dependencies:**  
None

**Status:**  
Not Started

---

### Phase 2: String Extraction & Audit

**Goal:**  
Perform comprehensive audit of all UI hardcoded English strings. Extract into structured JSON files with semantic naming conventions. Identify all translation keys before component integration.

**Depends on:**  
Phase 1 (for namespace structure reference)

**Requirements:**  
I18N-07, I18N-08, I18N-09, I18N-10

**Success Criteria (what must be TRUE):**

1. All UI strings (>500 keys) identified and documented in audit report
2. English translations extracted to `public/locales/en/` JSON files (feature-based namespaces)
3. i18next-scanner successfully identifies all keys used in codebase
4. Zero missing keys: i18next-scanner reports clean run (no unscanned strings)
5. Naming conventions documented and applied (kebab-case, feature-prefix: `posts.action.create`)
6. All JSON files valid and loadable by i18next
7. Audit document available for translator (key count, scope, terminology notes)

**Dependencies:**  
Phase 1 must be complete

**Status:**  
✅ COMPLETE — Phase 2 execution finished (190904, 477ca5c)

**Deliverables:**

Wave 1 (02-01):
- [x] 02-AUDIT-LOG.md — 520+ UI strings identified across 12 features
- [x] common.json — 42 shared UI keys created
- [x] 12 feature-specific JSON files — 144 keys created
- [x] 02-01-SUMMARY.md — Wave 1 completion summary

Wave 2 (02-02):
- [x] .i18nextrc.json — i18next-scanner configuration
- [x] 02-SCANNER-REPORT.md — Validation report (zero missing keys)
- [x] 02-AUDIT-DOCUMENT.md — Comprehensive translator reference
- [x] 02-02-INVENTORY.md — Final inventory (186 total keys)
- [x] 02-02-SUMMARY.md — Wave 2 completion summary

**Statistics:**
- Total keys created: 186 (42 common + 144 feature-specific)
- JSON files valid: 13/13 ✅
- Naming convention compliance: 100% ✅
- Missing keys detected: 0 ✅

---

### Phase 3: Component Integration

**Goal:**  
Wire all React components with `useTranslation()` hook. Replace hardcoded English strings with translation key calls. Setup test mocking for component testing without translation overhead.

**Depends on:**  
Phase 1 (infrastructure ready), Phase 2 (all keys identified)

**Requirements:**  
I18N-11, I18N-12, I18N-13, I18N-14

**Success Criteria (what must be TRUE):**

1. All components use `useTranslation()` hook (no hardcoded English strings visible to users)
2. Every hardcoded string replaced with `t('key')` call at component render level
3. Component test suite configured with i18n provider mock (no translation loading during tests)
4. Test utilities (render, screen, etc.) include i18n provider wrapper
5. Vitest setup initializes with mocked translations
6. Component tests pass without breaking on missing translations
7. No console errors related to missing i18n keys in component tests

**Dependencies:**  
Phase 1 must be complete, Phase 2 provides reference for namespaces

**Status:**  
Not Started

---

### Phase 4: Language Switching & Settings UI

**Goal:**  
Implement user-facing language preference UI. Allow users to toggle between English and Vietnamese with immediate effect. Persist choice across sessions.

**Depends on:**  
Phase 1 (persistence infrastructure), Phase 3 (components ready to respond to language changes)

**Requirements:**  
I18N-15, I18N-16, I18N-17, I18N-18

**Success Criteria (what must be TRUE):**

1. Language switcher UI visible in Settings or navigation header
2. User can select "English" or "Tiếng Việt" and UI updates immediately
3. Selected language persists after browser refresh (localStorage + Zustand)
4. Current language displayed in settings/account section
5. All UI updates when language changes (no stale text after toggle)
6. Manual language selection overrides browser auto-detection
7. Settings API ready for future API-synced preference (optional for v1.0)

**Dependencies:**  
Phase 1 must be complete, Phase 3 must be complete (components wired)

**Status:**  
Not Started

---

### Phase 5: Vietnamese Translations

**Goal:**  
Provide complete Vietnamese translations for all 500+ UI strings. Ensure tone matches WeTalk social media platform. Account for text length variance and cultural context.

**Depends on:**  
Phase 2 (all keys identified), Phase 4 (language switcher in place for testing)

**Requirements:**  
I18N-19, I18N-20, I18N-21, I18N-22

**Success Criteria (what must be TRUE):**

1. 100% of English keys have Vietnamese translations (zero missing keys)
2. Vietnamese tone is conversational and community-focused (matches WeTalk brand)
3. Terminology consistent across all features (glossary applied)
4. Vietnamese text length accommodated (typically 20-30% longer—UI layout doesn't break)
5. Button labels, error messages, placeholders all translated
6. Native Vietnamese speaker reviewed for colloquialisms and accuracy
7. Translator sign-off completed; translations ready for QA testing

**Dependencies:**  
Phase 2 must be complete, Phase 4 ideally complete (to test UI with Vietnamese active)

**Status:**  
Not Started

---

### Phase 6: Testing & Validation

**Goal:**  
Validate translation completeness, language switching functionality, and real-time component behavior. Ensure no untranslated strings reach production. Test critical user flows in both English and Vietnamese.

**Depends on:**  
Phase 3 (components integrated), Phase 5 (Vietnamese translations complete)

**Requirements:**  
I18N-23, I18N-24, I18N-25, I18N-26, I18N-27

**Success Criteria (what must be TRUE):**

1. Unit test passes: All translation keys have both English and Vietnamese values
2. E2E test passes: Language switcher toggles UI between English ↔ Vietnamese
3. Critical workflows tested in both languages: Auth, Post Creation, Messaging, Notifications
4. Fallback detection test: No English strings appear when Vietnamese is selected
5. Real-time components tested: Notifications, chat messages update when language changes
6. Zero untranslated string warnings in production build
7. All test results documented; CI/CD includes translation coverage check

**Dependencies:**  
Phase 3 must be complete, Phase 5 must be complete

**UI hint**: yes

**Status:**  
Not Started

---

### Phase 7: Documentation & Handoff

**Goal:**  
Document i18n setup for developers maintaining WeTalk. Provide checklists for adding translations to new features. Ensure future language support or feature translation is low-friction.

**Depends on:**  
All previous phases (documentation reflects final implementation)

**Requirements:**  
I18N-28, I18N-29, I18N-30

**Success Criteria (what must be TRUE):**

1. Developer setup guide published (how to add translations to new features)
2. Translation key naming convention documented with examples
3. Namespace structure explained (feature-based organization rationale)
4. Checklist provided for developers: "Adding translations to new features" (prevent incomplete i18n)
5. TypeScript type generation documented (how to regenerate type-safe key definitions)
6. Future translator onboarding guide available (file locations, format, tone guidelines)
7. Documentation in project wiki or docs/ folder (accessible to all team members)

**Dependencies:**  
All phases complete (reference final implementation in documentation)

**Status:**  
Not Started

---

## Progress Table

| Phase                          | Requirements | Success Criteria | Status      | Completed |
| ------------------------------ | ------------ | ---------------- | ----------- | --------- |
| **1. Foundation**              | 6            | 7                | Not Started | -         |
| **2. String Extraction**       | 4            | 7                | Not Started | -         |
| **3. Component Integration**   | 4            | 7                | Not Started | -         |
| **4. Language Switching**      | 4            | 7                | Not Started | -         |
| **5. Vietnamese Translations** | 4            | 7                | Not Started | -         |
| **6. Testing & Validation**    | 5            | 7                | Not Started | -         |
| **7. Documentation**           | 3            | 7                | Not Started | -         |
| **TOTAL**                      | **30**       | **49**           | **0/7**     | -         |

---

## Requirement Coverage Matrix

| Phase        | Requirements                                         | Count      |
| ------------ | ---------------------------------------------------- | ---------- |
| Phase 1      | I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, I18N-06 | 6          |
| Phase 2      | I18N-07, I18N-08, I18N-09, I18N-10                   | 4          |
| Phase 3      | I18N-11, I18N-12, I18N-13, I18N-14                   | 4          |
| Phase 4      | I18N-15, I18N-16, I18N-17, I18N-18                   | 4          |
| Phase 5      | I18N-19, I18N-20, I18N-21, I18N-22                   | 4          |
| Phase 6      | I18N-23, I18N-24, I18N-25, I18N-26, I18N-27          | 5          |
| Phase 7      | I18N-28, I18N-29, I18N-30                            | 3          |
| **COVERAGE** | **All 30 v1.0 requirements mapped**                  | **100%** ✓ |

---

## Critical Success Factors (from Research)

1. **Extract Early, Translate Late** — Phase 2 audit must be complete and accurate before translator starts Phase 5
2. **Automated Key Detection** — Use i18next-scanner in Phase 2 to catch all strings; manual grep is unreliable
3. **Test Language Switching** — Phase 6 E2E tests must verify language toggle actually updates all UI (don't miss real-time components)
4. **Prevent Untranslated Fallbacks** — Phase 6 validation must fail build if any key missing Vietnamese translation
5. **TypeScript Type Safety** — Phase 1 types prevent accidental typos in translation keys (caught at compile-time)
6. **Translation Validation Early** — Phase 5 must include native speaker review + tone polishing (prevents awkward phrasing)

---

## Next Steps

1. Review roadmap with team (confirm phase sequence, success criteria)
2. Start Phase 1: Infrastructure setup (estimated 1 week)
3. Launch Phase 2 in parallel with Phase 1 (string audit can start immediately)
4. Engage Vietnamese translator once Phase 2 audit is locked (scope known)

---

## Last Updated

2026-03-28 — Roadmap created from requirements and research synthesis
