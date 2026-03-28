---
phase: 03-component-integration
created: 2026-03-29
scope: 140+ components across 12 features
total_keys: 186 (42 common + 144 feature-specific)
---

# Phase 3: Complete Component Inventory & Audit

**Objective:** Comprehensive catalog of all React components that require i18n integration. Lists component locations, estimated translation keys per component, feature grouping, priority tier, and execution roadmap for Waves 2-4.

**Scope:** All components in src/components/ (UI primitives, layouts) and src/features/*/components/ (feature-specific)

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Components** | 140+ |
| **Total Translation Keys** | 186 |
| **Features** | 12 |
| **UI Primitives** | 40 components, 42 keys (common namespace) |
| **Feature Components** | 100+ components, 144 keys (feature-specific namespaces) |
| **Total LOC (est)** | ~15,000-20,000 lines of component code |
| **Effort Estimate** | 4-6 hours (Waves 2-4: 3 days focused work) |
| **Priority Tiers** | P1 (core), P2a/2b (critical UX), P3 (secondary), P4 (tertiary), P5 (infra) |

---

## Component Distribution by Priority

### Priority Tier 1 — Foundational (Core Auth)

**Auth Feature** (5 components, 18 keys)  
Foundation to entire user journey — must be first

| Component | Path | Est. Keys | LOC | Deps |
|-----------|------|-----------|-----|------|
| login-form.tsx | src/features/auth/components/ | 8 | 120 | form, button |
| register-form.tsx | src/features/auth/components/ | 8 | 140 | form, button, link |
| forgot-password-form.tsx | src/features/auth/components/ | 4 | 80 | form, button |
| reset-password-form.tsx | src/features/auth/components/ | 5 | 100 | form, button |
| login-google-form.tsx | src/features/auth/components/ | 3 | 50 | button |

**Wave 2 Execution:** Task 1

---

### Priority Tier 2a — Critical UX (Messaging)

**Messages Feature** (6 components, 13 keys)  
Core user communication feature — high engagement

| Component | Path | Est. Keys | LOC | Deps |
|-----------|------|-----------|-----|------|
| message-input.tsx | src/features/messages/components/ | 3 | 100 | input, button |
| message-item.tsx | src/features/messages/components/ | 3 | 110 | typography, status |
| chat-panel.tsx | src/features/messages/components/ | 2 | 90 | panel, message-item |
| conversations-panel.tsx | src/features/messages/components/ | 2 | 85 | panel, list |
| conversation-item.tsx | src/features/messages/components/ | 2 | 80 | button, avatar |
| messages-popup.tsx | src/features/messages/components/ | 1 | 60 | popup, chat-panel |

**Wave 2 Execution:** Task 2

---

### Priority Tier 2b — Critical UX (Posts Core Path)

**Posts Feature — Critical Components Only** (5 components, ~15 keys from 26 total)  
Essential for user feed and post creation experience

| Component | Path | Est. Keys | LOC | Deps |
|-----------|------|-----------|-----|------|
| create-post.tsx | src/features/posts/components/ | 4 | 180 | form, input, button, media-uploader |
| edit-post.tsx | src/features/posts/components/ | 3 | 150 | form, button, modal |
| post-view.tsx | src/features/posts/components/ | 4 | 200 | comment, vote, share, card |
| share-post.tsx | src/features/posts/components/ | 2 | 90 | button, dialog, link |
| sort-posts.tsx | src/features/posts/components/ | 2 | 60 | select, button |

**Wave 2 Execution:** Task 3

---

### Priority Tier 3 — Secondary Features (Large Scope)

#### Posts Remaining Components (13 files, 11 additional keys from 26 total)

| Component | Path | Est. Keys | LOC | Type |
|-----------|------|-----------|-----|------|
| delete-post.tsx | src/features/posts/components/ | 1 | 50 | action |
| report-post.tsx | src/features/posts/components/ | 2 | 85 | form |
| upvote-post.tsx | src/features/posts/components/ | 1 | 40 | action |
| downvote-post.tsx | src/features/posts/components/ | 1 | 40 | action |
| create-poll.tsx | src/features/posts/components/ | 2 | 130 | form |
| edit-poll.tsx | src/features/posts/components/ | 2 | 120 | form |
| edit-media-uploader.tsx | src/features/posts/components/ | 1 | 100 | uploader |
| ai-chatbox.tsx | src/features/posts/components/ | 1 | 90 | chat |
| follow-post.tsx | src/features/posts/components/ | 1 | 45 | action |
| save-post.tsx | src/features/posts/components/ | 1 | 45 | action |
| select-post-tags.tsx | src/features/posts/components/ | 2 | 95 | form |
| create-link-post.tsx | src/features/posts/components/ | 1 | 85 | form |
| poll-view.tsx | src/features/posts/components/ | 1 | 110 | viewer |

**Wave 3 Execution:** Task 1

#### Communities Feature (25+ components, 24 keys)

Main components (10):
- create-community, community-view, community-card, community-grid, communities-list, join-community, unjoin-community, delete-community, community-sidebar, community-topics-section

Mod Tools (5):
- mod-tools-dialog, mod-sidebar, members-section, posts-section, reported-posts-section, reported-comments-section

Management (14):
- manage-members/: members-table, ban-member-button, approve-member-button, set-moderator-button, view-banned-history-button
- manage-posts/: posts-table, approve-post, reject-post, remove-post
- manage-reported-posts/: reported-posts-table, reported-comments-table, remove-report-button, remove-comment-report-button

**Wave 3 Execution:** Task 2

#### Profiles Feature (13 components, 10 keys)

- profile-header, profile-content, profile-overview, profile-tabs, profile-sidebar, profile-posts-list, profile-followed-posts-list, profile-saved-posts-list, profile-communities, profile-comments-list, update-profile, remove-user-collected-post, badge-history-dialog

**Wave 3 Execution:** Task 3a

#### Dashboard Feature (5 components, 7 keys)

- dashboard-posts-feed, dashboard-post-card, recent-posts-sidebar, community-hover-card, select-tags

**Wave 3 Execution:** Task 3b

---

### Priority Tier 4 — Tertiary Features (Wave 4)

#### Post-Comments Feature (8 components, 10 keys)

- create-post-comment, edit-post-comment, delete-post-comment, upvote-post-comment, downvote-post-comment, reply-comment, report-post-comment, post-comments-list

**Wave 4 Execution:** Task 1

#### Notifications Feature (3 components, 8 keys)

- notifications-list, notification-item, mark-notifications

**Wave 4 Execution:** Task 1

#### Search Feature (5 components, 6 keys)

- search, search-filters, search-posts-list, search-users-list, search-communities-list, search-all-list

**Wave 4 Execution:** Task 1

#### Settings Feature (3 components, 8 keys)

- setting-account, setting-notification, setting-preferences

**Wave 4 Execution:** Task 1

#### Minor Features (2 components)

- users: user-hover-card
- chatbot: ai-chatbox

**Wave 4 Execution:** Task 3

---

### Priority Tier 5 — Infrastructure (UI Primitives & Layouts)

**40 components, 42 keys (common namespace)**

#### Form Components (10)

- form.tsx, input.tsx, textarea.tsx, select.tsx, label.tsx, switch.tsx, error.tsx, field-wrapper.tsx, form-drawer.tsx

#### Navigation & Interaction (5)

- button.tsx, link.tsx, dropdown.tsx, drawer.tsx, dialog.tsx, confirmation-dialog.tsx

#### Display Components (10)

- card.tsx, spinner.tsx, hover-card.tsx, notifications.tsx, media-viewer.tsx, media-uploader.tsx, lightbox-media-viewer.tsx, link-preview.tsx, md-preview.tsx, message-media-viewer.tsx

#### Tables & Grids (5)

- table.tsx, grid.tsx, pagination (table), pagination (grid), text-editor.tsx

#### Layouts (3)

- dashboard-layout.tsx, content-layout.tsx, auth-layout.tsx

#### Other (2)

- seo/head.tsx, errors/main.tsx

**Wave 4 Execution:** Task 2

---

## Execution Roadmap for Waves 2-4

### Wave 2: High-Priority Features (16 components, 53 keys)

**Effort:** 4-6 hours (2 parallel engineers)

| Task | Feature | Components | Keys | Est. Time |
|------|---------|-----------|------|-----------|
| Task 1 | Auth | 5 | 18 | 1-2 hours |
| Task 2 | Messages | 6 | 13 | 1-1.5 hours |
| Task 3 | Posts (critical) + Test Utils | 5 | 15 | 1.5-2 hours |

**Dependencies:** None (Phase 1 complete, all 186 keys in place)

---

### Wave 3: Major Features (60+ components, 67 keys)

**Effort:** 6-8 hours (can parallelize)

| Task | Feature | Components | Keys | Est. Time |
|------|---------|-----------|------|-----------|
| Task 1 | Posts (remaining) | 13 | 11 | 2 hours |
| Task 2 | Communities (main + mod tools + management) | 25+ | 24 | 3-4 hours |
| Task 3 | Profiles + Dashboard | 18 | 17 | 2-3 hours |

---

### Wave 4: Remaining + Verification (60+ components + scan)

**Effort:** 6-8 hours (includes final verification)

| Task | Components | Keys | Est. Time |
|------|-----------|------|-----------|
| Task 1 | Post-Comments, Notifications, Search, Settings | 19 | 32 | 3 hours |
| Task 2 | UI Primitives & Layouts | 40 | 42 | 3 hours |
| Task 3 | Minor features (2) + Hardcoded string scan | 2 | — | 1-2 hours |

**Total Wave 4 Effort:** 6-8 hours

---

## Component Dependencies & Wiring Order

### Dependency Graph (Simplified)

```
UI Primitives (common namespace)
  ↓
Layouts (dashboard, content, auth)
  ↓
Feature Components
  ├─ Auth (5) → foundational
  ├─ Messages (6) → core UX
  └─ Posts (18) → feed + creation
      ├─ Comments (8)
      └─ Upvote/Downvote actions
  ├─ Communities (25+) → social core
  ├─ Profiles (13) → user identity
  ├─ Dashboard (5) → home feed
  └─ Settings/Search/Notifications → auxiliary
```

Execution strategy: **Bottom-up** (infrastructure first) but we wire **top-down by priority** (auth→messages→posts first, UI primitives available as dependencies are needed).

---

## Key Linking Reference

All translation keys reference Phase 2 deliverables:

**public/locales/en/:**
- common.json (42 keys) — buttons, labels, errors, validation, pagination
- auth.json (18 keys)
- post.json (26 keys)
- message.json (13 keys)
- community.json (24 keys)
- profiles.json (10 keys)
- dashboard.json (7 keys)
- notifications.json (8 keys)
- search.json (6 keys)
- settings.json (8 keys)
- postComments.json (10 keys)
- users.json (estimated 0 keys — reuse common or profiles)
- chatbot.json (estimated 0 keys — reuse common)

**Total:** 186 keys across 13 namespace files

---

## Estimation Notes

**Lines of Code (LOC):**
- Auth components: 490 LOC (avg 98)
- Message components: 425 LOC (avg 71)
- Post components: 1800 LOC (avg 100)
- Community components: 2500+ LOC (avg 100)
- Profile components: 1300 LOC (avg 100)
- Dashboard components: 400 LOC (avg 80)
- UI Primitives: 4000+ LOC (avg 100)
- Other features: 1000+ LOC

**Total estimated component LOC: 15,000-20,000**

**Keys per Component:**
- Avg. 1-1.5 keys per small component (buttons, modals)
- Avg. 8-10 keys per medium component (forms, pages)
- Avg. 15-20 keys per large component (feature views)

---

## Execution Readiness Checklist

- [x] Phase 2 complete: All 186 keys extracted to public/locales/en/
- [x] Phase 1 complete: i18n infrastructure wired, providers in place
- [x] Component audit complete: 140+ components categorized and prioritized
- [x] Vitest setup updated: useTranslation() mock in place, component tests isolated
- [x] Execution roadmap defined: 4 waves, 140+ components, clear task breakdown
- [x] No blockers: Ready for Wave 2 execution

---

## Summary

**Phase 3 infrastructure complete.** All 140+ components inventoried, prioritized, and organized for parallel execution across 4 waves. Test infrastructure updated to mock i18next for isolated component testing. Ready for Wave 2 (auth, messages, posts) execution.

**Next Step:** Execute Wave 2 (03-02-PLAN.md) to wire auth, messages, and critical post components.

---

_Audit completed: 2026-03-29_  
_Scope: 140+ components, 186 keys, 12 features_  
_Status: Wave 1 infrastructure ready, ready for Wave 2 execution_
