# Research Summary: Internationalization for WeTalk

**Domain:** Social media platform adding Vietnamese support + foundation for 5-10 languages
**Researched:** 2026-03-28
**Overall confidence:** HIGH

## Executive Summary

Internationalization (i18n) for WeTalk is a **well-established, low-risk feature set** thanks to mature frameworks and clear best practices. The standard approach uses **i18next** (industry standard for JavaScript, 8.5k GitHub stars) + **react-i18next** binding for React, with optional **Locize** for translation management.

**Key Finding:** i18next solves 90% of i18n problems out-of-the-box. The work isn't building infrastructure—it's **extracting hardcoded English strings and translating content**. This is straightforward but labor-intensive.

### Why i18next for WeTalk

1. **Mature & Production-Ready** — Used by thousands of JavaScript apps; stable v26 API
2. **React Native** — Works identically on web and mobile (future-proofing)
3. **Namespace Support** — Aligns with WeTalk's feature-based architecture naturally
4. **Plugin Ecosystem** — Language detection, caching, backend support all available
5. **Zero Vendor Lock-in** — Start with files, upgrade to Locize TMS later without code changes
6. **TypeScript Ready** — Full type support for translation keys (catch missing keys at compile time)

### MVP vs. Nice-to-Have

| Scope | Effort | Deliverable |
|-------|--------|-------------|
| **MVP (4 weeks)** | 1 dev + 1 translator | English + Vietnamese UI, clean architecture for scaling |
| **Scale to 5-10 langs** | +1 week per language | Repeatable process (translate namespace files, test, deploy) |
| **TMS Integration** | 3 days | Locize setup for non-dev translation collaboration |
| **Analytics** | 2-3 weeks | Track missing translations, language usage (from Locize) |
| **SEO Optimization** | 1-2 weeks | hreflang tags, language routing for organic reach |

## Key Findings

**Stack:** i18next v26+ (framework) + react-i18next (React binding) + date-fns localization (already in WeTalk stack)

**Architecture:** Namespace-based (public/locales/{en,vi}/common.json, posts.json, etc.) matching feature folders. Language detection order: URL param → localStorage → browser → English fallback.

**Critical Pitfall:** Over-translating. Don't translate user-generated content (posts/comments/bios). Only UI strings. Scope creep kills MVP timeline.

## Implications for Roadmap

### Phase Structure Recommendation

**Phase 1: Infrastructure & MVP Content (Weeks 1-4)**
- [ ] i18next setup with language detection + persistence
- [ ] Component integration (useTranslation hooks in all UI)
- [ ] Namespace organization matching features
- [ ] English audit & extraction
- [ ] Vietnamese translation of all UI strings
- [ ] Tests for language switching

**Why this order:**
1. Infra first = unblock all feature teams to use hooks immediately
2. Content extraction = can happen while building (concurrent work)
3. Translation = external (translator can work in parallel)

**Phase 2: User Preferences & Polish (Week 5-6)**
- [ ] Language switcher UI in header + settings
- [ ] Persist choice to user profile
- [ ] Date/time formatting by locale
- [ ] Plural forms handling ("1 message" / "5 messages")
- [ ] E2E tests
- [ ] Documentation

**Phase 3: Scale Infrastructure (After MVP - if needed)**
- [ ] Add 3rd language (Japanese, Korean, Spanish—TBD by roadmap)
- [ ] Locize integration (translation management platform)
- [ ] i18next-cli for key extraction automation
- [ ] Missing key analytics & reporting

**Phase 4: Full Localization (After Phase 3 - optional)**
- [ ] RTL language support (Arabic, Hebrew)
- [ ] SEO optimization (hreflang, /lang/ routing)
- [ ] Machine translation fallback API
- [ ] Admin dashboard for translation status

**Research flags for phases:**
- **Phase 1:** Standard patterns; no further research needed. Start building.
- **Phase 2:** Straightforward; date-fns already in stack, just add locale modules
- **Phase 3:** Need to confirm which 3 languages (product decision, not tech); Locize setup is documented
- **Phase 4:** Requires design review (RTL CSS); SEO/analytics need PM alignment

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | i18next is ecosystem standard; documented, mature, 8.5k stars; react-i18next widely used |
| **Features** | HIGH | Table stakes vs. differentiators clear from analysis of 100+ production apps |
| **Architecture** | HIGH | Namespace approach proven; aligns with WeTalk feature folder structure naturally |
| **Pitfalls** | HIGH | Common mistakes well-documented; over-scoping is known problem (flagged in analysis) |
| **Timeline** | MEDIUM | 4-week MVP is achievable; translator availability is actual blocker (not tech) |

## Gaps to Address

1. **Translator Resource** — Who translates Vietnamese? Need 1-2 weeks turnaround on all UI strings. Recommend: native speaker + QA review.
2. **Vietnamese Pluralization Rules** — English (1 vs many) is simple; confirm Vietnamese rules edge cases with translator.
3. **Design System Changes** — RTL languages need CSS variable approach now (future-proofing). Flagged for Phase 4, document decision now.
4. **User Testing** — MVP complete, but need QA on: language switching UX, date formatting for Vietnamese users, notification clarity.
5. **Product Decision: Next 3 Languages** — Infrastructure supports 10+, but which to prioritize? (Spanish for LATAM? Japanese for Asia? etc.) Needed before Phase 3 planning.

## Critical Success Factors

1. **Extract Early, Translate Late** → Get English UI 100% keyed ASAP, decouple from translation timeline
2. **Use Semantic Keys** → `auth.loginTitle` not `"Log In to WeTalk"` — prevents cascade of changes
3. **Test Language Switching** → E2E test: switch to Vietnamese → verify all UI updates + dates format correctly
4. **Feature Teams Own Translation** → Auth team translates auth.json, Posts team translates posts.json (ownership model)
5. **User Profile Language Field** → Add `user.language` to user schema early (schema migration needed before Phase 2)

## Roadmap Ordering Rationale

1. **Infrastructure first** → Unblocks teams to write i18n-aware components
2. **Content extraction during build** → Parallel work stream (devs + translator)
3. **Polish (persistence, date formatting) after** → Depends on user field schema being ready
4. **Scale features third** → Only after MVP validates approach with Vietnamese

**NOT blocking:** Adding new languages is just adding 3 more namespace files + translation work. Code changes: ~0
