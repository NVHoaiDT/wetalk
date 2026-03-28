# Phase 2: String Extraction & Audit - Context

**Gathered:** 2026-03-28  
**Status:** Ready for planning

---

<domain>

## Phase Boundary

Comprehensive audit of all hardcoded English UI strings across 339 TypeScript/TSX files. Extract into structured JSON files with semantic naming conventions, organized by feature and element type. Prepare the complete English string inventory for Phase 3 component integration and Phase 5 Vietnamese translation.

**Scope:**
- All user-facing UI strings (buttons, labels, placeholders, help text, error messages, validation messages, form labels, modal titles/descriptions)
- Organized across 13 JSON files (1 common + 12 feature-specific)
- Apply consistent naming convention and document for translators

**Out of scope:**
- Component integration (Phase 3)
- Vietnamese translation (Phase 5)
- User-generated content (posts, comments, community descriptions stay untranslated)

</domain>

---

<decisions>

## Implementation Decisions

### Namespace File Structure
- **Mixed approach:** Common/shared strings in `common.json`, feature-specific strings in individual feature files
- **Common strings:** Truly reusable UI elements (buttons: Confirm, Cancel, Save, Delete, Close, Back; generic labels; standard field names)
- **Feature files:** One JSON per feature matching WeTalk's folder structure
  - List: `post.json`, `message.json`, `community.json`, `auth.json`, `dashboard.json`, `notifications.json`, `search.json`, `profiles.json`, `users.json`, `chatbot.json`, `settings.json`, `postComments.json`
  - Location: `public/locales/en/{filename}.json`
- **Components namespace:** Reusable component-level UI (Card titles, modal headers, dialog labels) → keep in feature files where used; don't create separate components.json yet
- **Rationale:** Reduces duplication, makes translation easier (translator works on feature as a unit), aligns with WeTalk's feature folder organization

### Key Naming Convention Pattern
- **Structure:** Nested objects (hierarchical, semantic)
- **Format:** PascalCase for namespace prefix + camelCase for property chain
- **Example notation:** 
  - `Post.modal.deleteConfirmation.title` (shown as namespace prefix notation; implements as `modal.deleteConfirmation.title` in post.json)
  - `Common.button.confirm` (shown as namespace prefix notation; implements as `button.confirm` in common.json)
  - `Message.label.senderName` (implements as `label.senderName` in message.json)

### Element Type Organization (within each JSON)
Organize nested keys by semantic category within each feature file:

```json
{
  "action": {
    "create": "Create Post",
    "delete": "Delete Post",
    "edit": "Edit Post"
  },
  "label": {
    "title": "Post Title",
    "content": "Post Content",
    "author": "Posted by"
  },
  "placeholder": {
    "titleInput": "Enter post title...",
    "contentInput": "What's on your mind?"
  },
  "error": {
    "titleRequired": "Post title is required",
    "contentTooShort": "Post content must be at least 10 characters"
  },
  "validation": {
    "pendingApproval": "Your post is pending community approval"
  },
  "modal": {
    "deleteConfirmation": {
      "title": "Delete Post?",
      "description": "This action cannot be undone.",
      "confirmButton": "Delete Permanently",
      "cancelButton": "Keep Post"
    }
  },
  "help": {
    "postVisibility": "Choose who can see this post"
  }
}
```

**Rationale:**
- Semantic grouping by element type (action, label, placeholder, error, etc.) makes scanning translation files easier
- camelCase for compound words is i18n standard and JS-friendly
- Supports i18next nesting via `t('action.create')` or `t('post:action.create')` syntax
- Scales well (each feature file stays <300 keys; largest predicted: ~150 keys)

### Naming Case Style (locked)
- All camelCase (namespace + property chains)
- Format: `featureName.elementType.property` with camelCase throughout
- Examples:
  - `post.action.create` → button text "Create Post"
  - `common.button.confirm` → button text "Confirm"
  - `post.modal.deleteConfirmation.title` → modal heading "Delete Post?"

### Extraction Order & Approach
- **Phase 2a (Task 1):** Manual audit + codebase grep to identify all strings
- **Phase 2b (Task 2):** Create initial common.json and feature JSON files with extracted strings
- **Phase 2c (Task 3):** Configure and run i18next-scanner to validate coverage
- **Phase 2d (Task 4):** Generate audit report with key counts, locations, terminology notes for translator
- **Rationale:** Manual-first approach ensures no strings are missed; i18next-scanner validates completeness

### Common.json Reserved Strings (initial list)
Buttons and generic UI elements that appear across multiple features:
- `common.button.confirm`, `common.button.cancel`, `common.button.save`, `common.button.delete`, `common.button.close`, `common.button.back`, `common.button.next`, `common.button.submit`, `common.button.edit`, `common.button.view`
- `common.label.loading`, `common.label.noResults`, `common.label.emptyState`
- `common.error.networkError`, `common.error.unauthorized`, `common.error.notFound`, `common.error.serverError`
- `common.validation.required`, `common.validation.emailInvalid`, `common.validation.passwordTooWeak`
- `common.pagination.page`, `common.pagination.of`, `common.pagination.nextPage`, `common.pagination.previousPage`

**Note:** If a feature needs a variant (e.g., "Create Post" vs generic "Create"), use feature-specific key: `post.action.create` not `common.action.create`.

### the agent's Discretion
- **Extraction granularity:** How specific to make keys is left to extraction tasks. Example: "Delete Post?" can be one key (`modal.deleteConfirmation.title`) or split (title, description, buttons separately). Agent should extract at component/task boundary level.
- **Terminology notes:** Agent decides what context per string is useful for translator (location, variations, tone guidance).
- **File organization refinements:** If a feature file approaches 200+ keys during extraction, agent can propose splitting into subcategories (e.g., `post.json` + `post-comments.json` if comments are substantial).

</decisions>

---

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before extracting or planning Phase 2.**

### Project-Level
- `PROJECT.md` — WeTalk platform context, i18n goals, success criteria
- `REQUIREMENTS.md` — Phase 2 requirements I18N-07 to I18N-10 with acceptance criteria

### i18next Framework
- `src/i18n/config.ts` — Core i18next configuration (v26.0.1) with namespace structure; shows i18next.init() with resources structure
- `src/lib/i18n-store.ts` — Zustand store pattern for language state management
- Phase 1 completion artifacts in `.planning/phases/01-foundation/` — Infrastructure foundation

### Codebase Context
- Feature folder structure: `src/features/{auth, chatbot, communities, dashboard, messages, notifications, post-comments, posts, profiles, search, settings, users}`
- Component library: `src/components/ui/` (reusable Button, Card, Modal, Input, etc.)
- Testing setup: `src/testing/setup-tests.ts` with i18next mock (will be used for verification)

### Phase 2 Requirements
- **I18N-07:** Audit codebase for all UI strings (buttons, labels, help text, error messages, form validation, modals)
- **I18N-08:** Extract English strings into JSON files (feature-based structure)
- **I18N-09:** Run i18next-scanner to identify all missing translation keys
- **I18N-10:** Document translation key naming conventions

</canonical_refs>

---

<code_context>

## Existing Code Insights

### Reusable Assets
- **Component library (ui/):** Reusable components (Button, Card, Modal, Input, Select, etc.) that will need labels extracted
- **Feature structure:** 12 feature folders that map 1:1 to proposed JSON namespace files
- **useLanguageStore hook:** Already integrates Zustand + i18next; components will call `t('key')` once integrated

### Established Patterns
- **Feature-based organization:** WeTalk already structures code by feature (auth, posts, messages, etc.); proposed namespace structure matches this exactly
- **TypeScript strict mode:** All components are TypeScript; extraction will be precise with type information available
- **Vitest + React Query:** Testing framework already supports i18n mocking (set up in Phase 1)

### Integration Points
- **Locale files location:** `public/locales/en/` already created in Phase 1; will be expanded with feature-specific JSON files
- **i18next config:** Already initialized in `src/i18n/config.ts` with namespace structure; extractor will populate the resources
- **Component rendering:** Once keys are extracted, components will reference them via `useTranslation()` hook (Phase 3)

</code_context>

---

<specifics>

## Specific Ideas & Preferences

### Naming Convention Examples (locked)
- Feature-specific: `post.action.create` → button text "Create Post"
- Shared: `common.button.confirm` → button text "Confirm"
- Nested semantic: `post.modal.deleteConfirmation.title` → modal heading "Delete Post?"

### Extraction Target
- Estimate: **500-700 keys** total
- Breakdown by feature (estimated):
  - `common.json`: ~80-100 keys (buttons, generic labels, errors, pagination)
  - Large features (posts, messages, communities): ~80-120 keys each
  - Medium features (auth, notifications, search, profiles, dashboard): ~40-60 keys each
  - Small features (chatbot, settings, users, post-comments): ~20-40 keys each

### Audit Document (for translator)
Should include:
- Key count per file and total
- Feature descriptions (what each file contains)
- Sample key examples per feature
- Tone guidance (conversational, professional, etc.)
- Cultural/context notes for Vietnamese translator
- List of shared buttons/labels and where they're used

</specifics>

---

<deferred>

## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-string-extraction*  
*Context gathered: 2026-03-28*  
*Status: Locked and ready for planning*
