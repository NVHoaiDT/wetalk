# Feature Landscape: Internationalization (i18n) for WeTalk

**Domain:** Social media platform with i18n support (MVP: Vietnamese + English, infrastructure for 5-10 languages)
**Researched:** 2026-03-28
**Primary Reference:** i18next v26+ ecosystem + react-i18next

## Table Stakes

Features users expect. Missing = product feels incomplete or unprofessional for international audience.

| Feature                               | Why Expected                                                    | Complexity | WeTalk Notes                                                                |
| ------------------------------------- | --------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------- |
| **Basic Translation System**          | All UI text must be translatable                                | Low        | i18next + react-i18next hooks (useTranslation) covers 90% of cases          |
| **Language Detection**                | App should detect user's browser/device language automatically  | Low        | i18next `detection` plugin with fallback to English                         |
| **Language Switching**                | User can change language and see updates immediately            | Low        | Language selector dropdown, persisted to localStorage/user settings         |
| **Persistence of Language Choice**    | User's language preference survives page refresh/logout-login   | Low        | Store in localStorage (anonymous) or user profile (authenticated)           |
| **Fallback Language**                 | When key missing, show English version instead of key name      | Low        | i18next `fallbackLng: 'en'` config                                          |
| **Namespace Organization**            | Large projects split translations into files by domain          | Medium     | Match WeTalk features: auth, posts, messages, notifications, profiles, etc. |
| **Pluralization**                     | "1 message" vs "5 messages" rendered correctly                  | Low        | i18next `plurals` feature handles English/Vietnamese rules                  |
| **Component Translation**             | React components can be translated with preserved JSX structure | Low        | `useTranslation` hook + `<Trans>` component with semantic keys              |
| **Date/Number Formatting**            | "2 hours ago", "1,234 followers", "€99.99" format by locale     | Medium     | date-fns already in stack, add locale modules for Vietnamese                |
| **Right-to-Left (RTL) Compatibility** | CSS/layout should support RTL languages later                   | High       | Document CSS variable approach for future Arabic/Hebrew support             |

## Differentiators

Features that set WeTalk apart. Not expected, but valued in competitive market.

| Feature                              | Value Proposition                                                                            | Complexity | WeTalk Fit | Notes                                                              |
| ------------------------------------ | -------------------------------------------------------------------------------------------- | ---------- | ---------- | ------------------------------------------------------------------ |
| **Smart Language Detection**         | Detect from: browser lang → IP geolocation → user account → redirect header                  | Medium     | HIGH       | Useful for developer audience spanning regions                     |
| **Translation UI in Admin Panel**    | Non-developer staff can add/edit translations without code                                   | High       | MEDIUM     | Deferred MVP; Locize handles this efficiently                      |
| **Real-time Translation Management** | Use Locize or similar service for live translation updates without redeploy                  | High       | MEDIUM     | Enables split-team workflows (devs code, translators update live)  |
| **Context-Aware Translations**       | Same word translates differently based on context (verb vs noun)                             | Low        | LOW        | Overkill for social platform; messages/posts mostly user-generated |
| **Advanced Pluralization Rules**     | Handle complex rules (0,1,2,5+) for languages with more than 2 forms                         | Low-Medium | HIGH       | Vietnamese has complex structures sometimes                        |
| **Machine Translation Fallback**     | Missing translations auto-translated via Google Translate API                                | Medium     | MEDIUM     | Useful for scale, but requires API costs + quality assurance       |
| **Analytics Dashboard**              | Track: missing translations, language usage, translation freshness                           | High       | MEDIUM     | Locize provides this out-of-box with paid plan                     |
| **Namespace Code Splitting**         | Load only translation namespaces for active feature (performance optimization)               | High       | MEDIUM     | WeTalk has feature-based architecture; natural fit later           |
| **Translation Versioning**           | Rollback to previous translation version if new translations break things                    | High       | LOW        | Complex for initial MVP; unnecessary initially                     |
| **Fancy Language Selector UI**       | Visual language picker with flags, native language names, regional variants                  | Low        | LOW        | Nice-to-have polish; dropdown sufficient for MVP                   |
| **User Language Override**           | Users can change language separately from UI (e.g., read posts in Vietnamese, UI in English) | Medium     | LOW        | Niche use case; implement later if requested                       |
| **SEO Optimization**                 | hreflang tags, language path prefixes (/vi/, /en/), metadata translation                     | High       | MEDIUM     | Important for organic reach; deferred MVP                          |
| **Right-to-Left (RTL) Full Support** | Complete RTL layout, form directions, text alignment for Arabic/Hebrew                       | High       | LOW        | Deferred; infrastructure only needed MVP                           |

## Anti-Features

Features to explicitly NOT build or should defer.

| Anti-Feature                                 | Why Avoid                                                                      | What to Do Instead                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| **In-app Translation Editor**                | Security + UX nightmare; non-developers can't maintain translations accurately | Use Locize or similar paid TMS; restrict to dev environment during development  |
| **Manual Translation File Merging**          | Merge conflicts in JSON files break versioning; hard to review                 | Use Locize or i18next ecosystem tools; automate via CI/CD                       |
| **User-Generated Translation Contributions** | GitHub PRs for translations = messy workflow; poor quality control             | Use Locize community translation feature (paid plan) or manage internally first |
| **Translating User-Generated Content**       | Comments, posts, messages are user-created; no backend translation needed      | Users responsible for own language choice; UI translates, not content           |
| **Dynamic Language Lists**                   | Pulling language list from backend creates dependency, complexity              | Hardcode supported languages in code; easy to extend                            |
| **Per-Message Translation**                  | Translate individual message/post manually; labor-intensive                    | Impossible at scale; only translate UI/system messages                          |

## Feature Dependencies

Graph of what must come first:

```
Environment Setup
  ├── i18next + react-i18next + plugins
  └── Translation files structure (namespaces)
       ├── Language Detection
       ├── Language Switching UI
       └── Component Translation (useTranslation hook usage)
            ├── Persistence (localStorage/user profile)
            ├── Pluralization
            └── Date/Number Formatting
                 └── SEO (optional, later)
```

## MVP Feature Set

**Minimum to launch Vietnamese support with clean architecture:**

1. **Core (Week 1-2)**
   - [ ] i18next + react-i18next + language-detector plugin
   - [ ] `/public/locales/{en,vi}/` namespace structure
   - [ ] i18n instance config with fallback to English
   - [ ] AppProvider wraps app with i18n context

2. **Component Layer (Week 2-3)**
   - [ ] `useTranslation` hook wired into all components (colocated with features per WeTalk conventions)
   - [ ] `<Trans>` component for complex strings with JSX
   - [ ] Language detection on app load (browser → localStorage → English)
   - [ ] Language switcher dropdown (settings page + header)
   - [ ] Persistence to localStorage (anonymous) and user.language field (authenticated)

3. **Localization Content (Week 3)**
   - [ ] Audit all hardcoded English strings in UI
   - [ ] Extract to translation keys (semantic: `auth.loginTitle`, `posts.createButtonLabel`)
   - [ ] Create `en.json` reference file (English as source)
   - [ ] Translate to `vi.json` (human translator)

4. **Polish (Week 4)**
   - [ ] Plural forms for notifications ("1 message" / "5 messages")
   - [ ] Date formatting with locale (2 hours ago, posted on [localized date])
   - [ ] E2E tests for language switching
   - [ ] Documentation for adding new translation keys

**Not in MVP:**

- Locize integration (manage locally until product scales)
- RTL support (infrastructure now, implementation later)
- Machine translation fallback
- Analytics dashboard
- Language-specific SEO

## Typical Implementation Patterns

### 1. File Organization (Namespace Structure)

**Convention for WeTalk (matches feature-based architecture):**

```
public/locales/
├── en/
│   ├── common.json          # Shared: buttons, labels, errors
│   ├── auth.json            # Login, register, password reset
│   ├── posts.json           # Create post, feed, comments
│   ├── messages.json        # Direct messaging
│   ├── notifications.json   # System notifications
│   ├── profiles.json        # User profiles, bio
│   ├── communities.json     # Community management
│   └── settings.json        # User settings
└── vi/
    ├── common.json
    ├── auth.json
    └── [mirrors en/ structure]
```

**Rationale:**

- Aligns with `src/features/` organization → easier for developers to find what to translate
- Namespaces can be lazy-loaded per feature (performance future optimization)
- Easier to assign translation work to specialists (one person translates posts.json, another does messages.json)

### 2. Language Detection Strategy

**Recommended order (uses i18next-browser-language-detector plugin):**

1. **URL parameter** → `?lang=vi` (explicit user override)
2. **localStorage** → Persisted user choice from previous session
3. **Browser language** → `navigator.language` (first-time visitor)
4. **session storage** → If user changed mid-session
5. **Fallback** → English

**WeTalk implementation:**

```typescript
// src/lib/i18n.ts
import LanguageDetector from 'i18next-browser-language-detector';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'sessionStorage'],
      caches: ['localStorage', 'sessionStorage'],
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'vi'],
    // ...
  });
```

### 3. Component Translation Methods

**Pattern A: Simple strings (most common)**

```typescript
import { useTranslation } from 'react-i18next';

export const LoginForm = () => {
  const { t } = useTranslation('auth');  // namespace: auth.json

  return (
    <form>
      <label>{t('emailLabel')}</label>      {/* auth.json: "emailLabel": "Email Address" */}
      <input placeholder={t('emailPlaceholder')} />
      <button>{t('submitButton')}</button>   {/* auth.json: "submitButton": "Log In" */}
    </form>
  );
};
```

**Pattern B: With interpolation (variables)**

```typescript
export const PostHeader = ({ postCount }) => {
  const { t } = useTranslation('posts');

  // posts.json: "postCount": "You have {{count}} unread posts"
  return <h2>{t('postCount', { count: postCount })}</h2>;
  // Renders: "You have 5 unread posts"
};
```

**Pattern C: Plurals (automatic selection)**

```typescript
export const MessageBadge = ({ unreadCount }) => {
  const { t } = useTranslation('notifications');

  // notifications.json:
  // "unreadMessages": "You have 1 message | You have {{count}} messages"
  // i18next auto-picks singular/plural based on count
  return <span>{t('unreadMessages', { count: unreadCount })}</span>;
  // unreadCount=1  → "You have 1 message"
  // unreadCount=5  → "You have 5 messages"
};
```

**Pattern D: JSX content (using Trans component)**

```typescript
import { Trans } from 'react-i18next';

export const TermsAgreement = () => {
  return (
    <Trans i18nKey="auth.termsText">
      I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
    </Trans>
  );
  // auth.json: "termsText": "I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>."
};
```

### 4. Language Switching Implementation

**Recommended UI pattern for WeTalk (in Settings page + header):**

```typescript
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '@/lib/auth';  // WeTalk auth hook
import { useUpdateUser } from '@/features/users/api';  // Update user API

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { user } = useCurrentUser();
  const updateUser = useUpdateUser();

  const handleLanguageChange = async (newLang: 'en' | 'vi') => {
    // Switch UI language immediately
    await i18n.changeLanguage(newLang);

    // Persist to user profile if logged in
    if (user) {
      await updateUser({ language: newLang });
    } else {
      // For anonymous users, already persisted by i18next to localStorage
    }
  };

  return (
    <select value={i18n.language} onChange={(e) => handleLanguageChange(e.target.value as any)}>
      <option value="en">English</option>
      <option value="vi">Tiếng Việt</option>
    </select>
  );
};
```

### 5. Translation Key Naming Convention

**Semantic keys (recommended over full english strings):**

```json
{
  "common": {
    "buttons": {
      "submit": "Submit",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit"
    },
    "errors": {
      "required": "This field is required",
      "invalidEmail": "Please enter a valid email"
    }
  },
  "auth": {
    "loginTitle": "Log In to WeTalk",
    "registerTitle": "Create Your Account"
  },
  "posts": {
    "createButtonLabel": "Create Post",
    "postedXHoursAgo": "Posted {{hours}} hours ago"
  }
}
```

**Why semantic keys:**

- Stable: English text can change without breaking code
- Composable: `common.buttons.submit` used everywhere
- Clear ownership: Team knows which file to edit for which feature

### 6. Adding a New Language (Process)

**To add Japanese (ja) after Vietnamese MVP:**

1. Create namespace files:

   ```bash
   mkdir public/locales/ja
   cp public/locales/en/* public/locales/ja/
   ```

2. Update i18n config:

   ```typescript
   // src/lib/i18n.ts
   supportedLngs: ['en', 'vi', 'ja'],
   ```

3. Translation workflow (via Locize or manual):
   - [ ] Extract keys from `public/locales/en/`
   - [ ] Send to translator
   - [ ] Review translations
   - [ ] Place in `public/locales/ja/`
   - [ ] Test language switching

4. Deploy and monitor missing keys

## Complexity Notes

### Low Complexity (1-2 days each)

- Setting up i18next + react-i18next
- Basic useTranslation hook usage
- Simple language detection
- Language switching UI
- Basic pluralization

### Medium Complexity (3-5 days each)

- Extracting all hardcoded strings (audit effort)
- Creating namespace structure
- Translating all content (content effort, not code)
- Date/number formatting by locale
- Namespace-based code splitting (optional)

### High Complexity (1-2 weeks each)

- Locize integration (TMS workflow)
- SEO optimization (hreflang, language routing)
- RTL language support (CSS rewrite)
- Analytics dashboard (missing translation tracking)
- Real-time translation management without redeploy

## WeTalk-Specific Considerations

### Components That Need i18n

**Must translate:**

- ✅ All UI text (buttons, labels, placeholders, error messages)
- ✅ Form validation messages
- ✅ System notifications ("You have 1 new message")
- ✅ Date/time displays ("Posted 2 hours ago")
- ✅ Metadata (page titles, SEO descriptions)
- ✅ Loading states ("Loading...")
- ✅ Empty states ("No posts yet")

**Do NOT translate:**

- ❌ User-generated content (posts, comments, profile bios)
- ❌ Community names (user-created text)
- ❌ Usernames
- ❌ External links/URLs
- ❌ Code snippets or technical content (unless explicitly requested)

### Interaction with WeTalk Features

| Feature           | i18n Impact                                                       | Notes                                          |
| ----------------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| **Posts**         | Translate "Create Post" UI, date display                          | Post content is user-generated, not translated |
| **Comments**      | Translate "Add Comment" UI, timestamps                            | Comment content is user-generated              |
| **Messages**      | Translate "New message" notification, timestamps                  | Actual message text is user-generated          |
| **Communities**   | Translate UI labels; community name is user-set                   | Community descriptions are user-created        |
| **Notifications** | HIGH: System messages must be fully translated                    | "You have 5 new posts from X community"        |
| **Profiles**      | Translate UI ("Edit Profile", "Followers"); bio is user-generated | Profile customization UI needs i18n            |
| **Search**        | Translate placeholders, results UI                                | Search queries are freeform                    |
| **Settings**      | CRITICAL: Settings page 100% translated                           | Language selection here                        |

### Scalability to 5-10 Languages

**Current approach (MVP with 2 languages) scales to 10+ with:**

1. **Namespace organization is already set** → Easy to add new languages without restructuring
2. **Locize integration when paid** → Handles translation collaboration at scale
3. **CI/CD automation** → i18next-cli can validate missing keys before deploy
4. **Team assignment** → With namespaces, different teams can own different parts (posts team translates posts.json, etc.)

**Cost of adding language #3 through #10:** ~1 week each (translation + QA)

## Sources

- **i18next Documentation:** https://www.i18next.com/ (v26 as of 2026-03-28)
- **react-i18next:** https://react.i18next.com/
- **Locize (TMS):** https://locize.com/ (official translation management service)
- **i18next-browser-language-detector:** Language detection plugin documentation
- **WeTalk Codebase:** Feature architecture, component patterns, current tech stack
