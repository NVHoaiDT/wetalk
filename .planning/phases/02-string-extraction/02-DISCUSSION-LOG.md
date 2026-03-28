# Phase 2: String Extraction & Audit - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.  
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered and the selection process.

**Date:** 2026-03-28  
**Phase:** 02-string-extraction  
**Areas discussed:** Namespace structure depth, Key naming convention pattern  
**Mode:** Interactive discussion (user made two selections from gray areas)

---

## Area 1: Namespace Structure Depth

**Options presented (from workflow):**

| Option           | Description                                                                                       | Selected |
| ---------------- | ------------------------------------------------------------------------------------------------- | -------- |
| Breadth Approach | One JSON file per feature (posts.json, messages.json, etc.), flat or minimal nesting              |          |
| Depth Approach   | Multiple files per feature by category (posts/actions.json, posts/labels.json, posts/errors.json) |          |
| Mixed Approach   | Common/shared buttons in common.json, feature-specific content in individual feature files        | ✓        |

**User's choice:** Mixed approach

**Supporting questions asked and answered:**

1. **Feature-level grouping:** One JSON per feature or subdivided by category?
   - **Answer:** One JSON file per feature, subdivided by semantic element type (action, label, error, etc.) within the file using nested objects
   - **Note:** The 12 features map to 12 JSON files: post.json, message.json, community.json, auth.json, dashboard.json, notifications.json, search.json, profiles.json, users.json, chatbot.json, settings.json, postComments.json

2. **Shared/common strings:** Where should truly reusable buttons (Save, Cancel, Delete, Close) live?
   - **Answer:** One dedicated `common.json` file for truly shared UI elements
   - **Scope of common.json:** Generic buttons, standard field names, common labels (Loading, No Results, Empty State), generic errors (Network Error, Unauthorized, Not Found), validation messages (Required, Email Invalid, Password Too Weak), pagination
   - **Feature-specific variants:** If a feature needs a custom variant, keep it in the feature file (e.g., "Create Post" in posts.json, not "Create" in common.json)

3. **Components namespace:** Reusable component labels (Card titles, Modal headers, Dialog labels)?
   - **Answer:** Don't create a separate components.json yet; keep component-level UI strings in the feature files where they're used
   - **Rationale:** Simpler mental model, matches code organization

**Final file structure:** 13 JSON files total

- `public/locales/en/common.json` — Shared buttons, generic UI, validation messages
- `public/locales/en/{feature}.json` × 12 — Feature-specific strings (post, message, community, auth, dashboard, notifications, search, profiles, users, chatbot, settings, postComments)

**Rationale captured:** Reduces duplication, makes translation easier (translator works on feature as a unit), aligns with WeTalk's feature folder organization.

---

## Area 2: Key Naming Convention Pattern

**Options presented (from workflow):**

| Option             | Description                                                                            | Selected |
| ------------------ | -------------------------------------------------------------------------------------- | -------- |
| Nested Objects (A) | Semantic/readable structure with nesting: `posts.actions.create`, `posts.labels.title` | ✓        |
| Flat Keys (B)      | Simple prefixed keys without nesting: `posts_action_create`, `posts_label_title`       |          |
| Hybrid (C)         | Flexible approach: mix nesting and flat keys based on context                          |          |

**User's choice:** Nested objects (Option A)

**Supporting questions asked and answered:**

1. **Primary pattern:** Nested objects, flat prefixes, or hybrid?
   - **Answer:** Nested objects — semantic structure mirrors code organization
   - **Implementation:** Within each JSON file, use element-type categories as top-level keys (action, label, placeholder, error, validation, modal, help)
   - **Example structure:**
     ```json
     {
       "action": { "create": "Create Post", "delete": "Delete Post" },
       "label": { "title": "Post Title", "content": "Post Content" },
       "error": { "titleRequired": "Post title is required" },
       "modal": {
         "deleteConfirmation": { "title": "Delete Post?", "description": "..." }
       }
     }
     ```

2. **Element-type prefixes:** How to organize different kinds of strings?
   - **Answer:** Use semantic categories as top-level nested keys:
     - `action` — actionable buttons and commands (Create, Edit, Delete)
     - `label` — static labels and headings
     - `placeholder` — form field placeholders
     - `error` — error messages
     - `validation` — validation feedback messages
     - `modal` — modal titles, descriptions, buttons (nested further by modal type)
     - `help` — help text, tooltips, descriptions
   - **Rationale:** Clear semantic grouping makes translation files scannable

3. **Naming case style:** camelCase, kebab-case, or PascalCase?
   - **Answer:** All camelCase (no PascalCase)
   - **Format:** `featureName.elementType.property` with camelCase throughout
   - **Examples:**
     - `post.action.create` → "Create Post"
     - `common.button.confirm` → "Confirm"
     - `post.modal.deleteConfirmation.title` → "Delete Post?"
     - `message.label.senderName` → "Sent by"

4. **Compound key naming:** Specific/literal keys or generic/reusable keys?
   - **Answer:** Specific keys that map 1:1 to UI components/modals
   - **Example:** `post.modal.deleteConfirmation.title`, `post.modal.deleteConfirmation.description`, `post.modal.deleteConfirmation.confirmButton`
   - **Rationale:** Easier for developers to find the right key when integrating components; easier for translator to understand context

**Final naming convention:** All camelCase (`featureName.elementType.property`), organized by semantic element type

---

## the agent's Discretion

The following areas were not explicitly discussed (agent has flexibility):

- **Extraction granularity:** How specific to make keys (e.g., can "Delete Post?" be one key or split into title/description/buttons separately?) — agent determines at component/task boundary level
- **Terminology notes:** What contextual information per string is useful for the translator (location, variations, tone guidance) — agent uses judgment
- **File organization refinements:** If a feature file grows large (200+ keys), agent can propose splitting into subcategories

---

## Deferred Ideas

None mentioned during discussion.

---

## Summary

User locked in two major decisions:

1. **File Structure: Mixed approach** — `common.json` + 12 feature files, with element-type nesting within each file
2. **Key Naming: Nested objects with all camelCase** (`featureName.elementType.property`) — organized by semantic element type (action, label, error, modal, etc.)

These decisions ensure:

- Clear semantic organization (aligns with code structure)
- Translator-friendly (organize by feature/element type)
- i18next-compatible (supports nested objects and namespace references)
- Scales to 500-700 keys across 13 files

Ready for Phase 2 planning with `/gsd-plan-phase 2`.
