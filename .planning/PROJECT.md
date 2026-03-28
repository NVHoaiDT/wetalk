# WeTalk Project Context

## What This Is

WeTalk is a social media platform for developers, built with React 18+, TypeScript, Tailwind CSS, React Query, and Zustand. It enables developers to connect, share knowledge, post discussions, participate in communities, and engage in real-time conversations.

**Core Value:** Community-driven knowledge sharing with real-time interaction, built by developers for developers.

## Current Milestone: v1.0 Internationalization

**Goal:** Make WeTalk accessible to Vietnamese speakers by adding Vietnamese language support, while building scalable i18n infrastructure to support expansion to 5-10 languages in the future.

**Target features:**
- i18next integration with language auto-detection (browser locale)
- Manual language override in user settings (English ↔ Vietnamese)
- Complete UI string translation (buttons, labels, forms, messages, modals)
- Translation file structure designed for scaling (feature-based namespaces)
- Language preference persistence (localStorage + future API sync)
- Vietnamese translations matching WeTalk's social media tone

**Scope boundaries:**
- ✅ UI/interface strings only (buttons, labels, help text, error messages)
- ✅ Design for future language expansion (5-10 languages)
- ❌ User-generated content translation (posts, comments stay original language)
- ❌ Real-time message translation (not in MVP scope)
- ❌ RTL support (English + Vietnamese are LTR; can add RTL later)

## Technology Stack

- **i18n Library:** i18next v26.0.1 + react-i18next v17.0.1
- **Key Dependencies:** React 18.3.1, TypeScript, React Router 7.0.2, Zustand 4.5.2
- **Message Format:** JSON with feature-based namespaces (`locales/{en,vi}/posts.json`, `locales/{en,vi}/messages.json`, etc.)
- **Language Storage:** localStorage (primary), Zustand store (runtime state)
- **Detection Method:** Auto-detect browser language, allow manual override in settings

## Key Decisions

1. **i18next over alternatives** — Industry standard (8.5k GitHub stars, 266 releases), excellent TypeScript support, true i18n not just translation
2. **Feature-based namespaces** — Align with WeTalk's `src/features/` structure (posts.json, messages.json, auth.json, etc.)
3. **localStorage for MVP** — Simple persistence; API sync can be added later for cross-device preference
4. **Vietnamese manual translation** — Ensure tone matches social media platform (conversational, community-focused, genuine)
5. **String extraction before translation** — Use i18next-scanner to audit and extract all English strings; prevents untranslated fallback bugs

## Success Criteria

- [ ] All UI strings (>500 keys) extracted into i18next JSON structure
- [ ] Vietnamese translations complete with reviewed tone/terminology
- [ ] Language detection working (browser auto-detect + manual toggle)
- [ ] User language preference persists across sessions
- [ ] Settings UI provides language switcher
- [ ] Component unit tests pass with i18n provider mocked
- [ ] E2E tests pass for critical flows in both EN and VI
- [ ] No untranslated strings appear in production builds

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

## Last Updated

March 28, 2026 — Milestone v1.0 started (Internationalization)
