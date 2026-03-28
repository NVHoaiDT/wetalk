# Milestone v1.0 Requirements — Internationalization

## Active Requirements

### I18n Infrastructure
- [ ] **I18N-01:** Integrate i18next library (v26.0.1) and react-i18next (v17.0.1) into app initialization
- [ ] **I18N-02:** Create i18n provider and wrap root app component after auth/layout providers
- [ ] **I18N-03:** Configure i18next with namespace structure matching feature folders (posts, messages, auth, etc.)
- [ ] **I18N-04:** Setup language auto-detection using browser locale (navigator.language)
- [ ] **I18N-05:** Implement language persistence in localStorage with Zustand store pattern
- [ ] **I18N-06:** Create TypeScript types for translation keys to prevent runtime errors

### String Extraction & Audit
- [ ] **I18N-07:** Audit codebase for all UI strings (buttons, labels, help text, error messages, form validation, modals)
- [ ] **I18N-08:** Extract English strings into JSON files (feature-based structure: `public/locales/en/posts.json`, `public/locales/en/messages.json`, etc.)
- [ ] **I18N-09:** Run i18next-scanner to identify all missing translation keys
- [ ] **I18N-10:** Document translation key naming conventions (kebab-case, feature-prefix: `posts.action.create`, `messages.label.send`, etc.)

### Component Integration
- [ ] **I18N-11:** Wire all UI components with `useTranslation()` hook from react-i18next
- [ ] **I18N-12:** Replace all hardcoded English strings with `t('key')` calls in components
- [ ] **I18N-13:** Setup i18n mocking in Vitest test setup for component tests
- [ ] **I18N-14:** Add provider wrapper to component test utilities

### Language Switching & Settings UI
- [ ] **I18N-15:** Create language switcher UI component (or UI section in Settings) showing "English" and "Tiếng Việt"
- [ ] **I18N-16:** User can toggle between English and Vietnamese; change takes effect immediately
- [ ] **I18N-17:** Language preference persists across session refreshes (stored in localStorage)
- [ ] **I18N-18:** Display current language in settings/account section

### Vietnamese Translations
- [ ] **I18N-19:** Provide complete Vietnamese translations for all extracted UI strings (>500 keys)
- [ ] **I18N-20:** Vietnamese tone matches WeTalk platform (conversational, community-focused, genuine)
- [ ] **I18N-21:** Ensure Vietnamese terminology is consistent across features
- [ ] **I18N-22:** Account for Vietnamese text length variance (typically 20-30% longer than English)

### Testing & Validation
- [ ] **I18N-23:** Create test suite validating all translation keys have both English and Vietnamese values
- [ ] **I18N-24:** Verify language switching works end-to-end (settings change → UI updates in both languages)
- [ ] **I18N-25:** Add E2E tests for critical user flows in both English and Vietnamese (auth, post creation, messaging)
- [ ] **I18N-26:** Validate no untranslated strings appear in either language (fallback detection)
- [ ] **I18N-27:** Test real-time components (notifications, chat) update UI text when language changes

### Documentation & Handoff
- [ ] **I18N-28:** Document i18n setup for developers (how to add translations to new features)
- [ ] **I18N-29:** Provide translation key checklist for future features (prevent incomplete i18n)
- [ ] **I18N-30:** Document namespace structure and naming conventions in project wiki/docs

---

## Deferred to Future Milestones

### Additional Languages
- [ ] **I18N-L-01:** Support for Spanish (es)
- [ ] **I18N-L-02:** Support for Japanese (ja)
- [ ] **I18N-L-03:** Support for Portuguese (pt-BR)
- [ ] **I18N-L-04:** Support for German (de)

### Advanced i18n Features
- [ ] **I18N-ADV-01:** API-synced language preference (persist across devices via `/users/me` PATCH)
- [ ] **I18N-ADV-02:** Plural rules handling for Vietnamese edge cases
- [ ] **I18N-ADV-03:** Date/time formatting by locale (e.g., dd/mm/yyyy vs mm/dd/yyyy)
- [ ] **I18N-ADV-04:** Number formatting by locale
- [ ] **I18N-ADV-05:** Locize integration for collaborative translation management
- [ ] **I18N-ADV-06:** RTL support for Arabic, Hebrew (requires CSS adjustments)
- [ ] **I18N-ADV-07:** SEO hreflang tags for multi-language discovery
- [ ] **I18N-ADV-08:** URL-based language routing (`/en/...`, `/vi/...`)

### Automation & Scaling
- [ ] **I18N-AUTO-01:** Real-time message translation service (socket events → translated notifications)
- [ ] **I18N-AUTO-02:** User-generated content translation API (optional, non-blocking)
- [ ] **I18N-AUTO-03:** Automated translation key extraction in CI/CD
- [ ] **I18N-AUTO-04:** Translation coverage monitoring and alerts

---

## Out of Scope

### NOT Included in v1.0
- **User-generated content translation** — Posts, comments, community descriptions remain in original language. This is intentional: preserves author voice, avoids over-scoping, and keeps focus on UI i18n.
- **Real-time message translation** — Would require significant SSE refactoring; deferred to v1.1+ after MVP stabilizes.
- **RTL language support** — Vietnamese and English are LTR. RTL can be designed and added later if needed.
- **Plural rules beyond English** — Simplified pluralization; Vietnamese has different rules (can be added later).
- **Localization beyond translation** — Date/time/number formatting by locale deferred to v1.1+.
- **API error message translation** — Backend errors currently in English; i18n at API error handling layer deferred.

---

## Requirement Quality Checklist

- [x] All requirements are user-centric ("User can X" format mostly, infrastructure marked explicitly)
- [x] Requirements are testable (success criteria are observable)
- [x] No duplicate requirements
- [x] Atomic requirements (not bundled)
- [x] REQ-ID format consistent (I18N-##)
- [x] Traceability will be mapped by roadmap phase

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| I18N-01 | Phase 1 | Pending |
| I18N-02 | Phase 1 | Pending |
| I18N-03 | Phase 1 | Pending |
| I18N-04 | Phase 1 | Pending |
| I18N-05 | Phase 1 | Pending |
| I18N-06 | Phase 1 | Pending |
| I18N-07 | Phase 2 | Pending |
| I18N-08 | Phase 2 | Pending |
| I18N-09 | Phase 2 | Pending |
| I18N-10 | Phase 2 | Pending |
| I18N-11 | Phase 3 | Pending |
| I18N-12 | Phase 3 | Pending |
| I18N-13 | Phase 3 | Pending |
| I18N-14 | Phase 3 | Pending |
| I18N-15 | Phase 4 | Pending |
| I18N-16 | Phase 4 | Pending |
| I18N-17 | Phase 4 | Pending |
| I18N-18 | Phase 4 | Pending |
| I18N-19 | Phase 5 | Pending |
| I18N-20 | Phase 5 | Pending |
| I18N-21 | Phase 5 | Pending |
| I18N-22 | Phase 5 | Pending |
| I18N-23 | Phase 6 | Pending |
| I18N-24 | Phase 6 | Pending |
| I18N-25 | Phase 6 | Pending |
| I18N-26 | Phase 6 | Pending |
| I18N-27 | Phase 6 | Pending |
| I18N-28 | Phase 7 | Pending |
| I18N-29 | Phase 7 | Pending |
| I18N-30 | Phase 7 | Pending |

---

## Last Updated

2026-03-28 — v1.0 roadmap created; all 30 requirements mapped to phases 1-7
