# Codebase Structure

**Analysis Date:** 2026-03-28

## Directory Layout

```
wetalk-client/
├── src/                          # Main source code
│   ├── index.css                 # Global styles + theme CSS variables
│   ├── main.tsx                  # App entry point
│   ├── vite-env.d.ts             # Vite type definitions
│   │
│   ├── app/                      # Application providers and routing
│   │   ├── index.tsx             # Root App component
│   │   ├── provider.tsx          # AppProvider with React Query, error boundaries
│   │   ├── router.tsx            # Router definition with all routes
│   │   └── routes/               # Page components
│   │       ├── landing.tsx       # Public landing page
│   │       ├── not-found.tsx     # 404 page
│   │       ├── auth/             # Authentication pages
│   │       │   ├── login.tsx
│   │       │   ├── register.tsx
│   │       │   ├── forgot-password.tsx
│   │       │   └── reset-password.tsx
│   │       └── app/              # Protected app routes
│   │           ├── root.tsx      # App shell + SSE setup
│   │           ├── dashboard.tsx
│   │           ├── communites/   # (typo: should be 'communities')
│   │           ├── posts/
│   │           ├── profiles/
│   │           └── notifications/
│   │
│   ├── components/               # Reusable UI components
│   │   ├── errors/               # Error UI
│   │   │   └── main.tsx          # Root error fallback
│   │   ├── layouts/              # Page layouts
│   │   │   ├── dashboard-layout.tsx   # Sidebar + main content
│   │   │   ├── auth-layout.tsx        # Login/register layout
│   │   │   └── [other layouts]
│   │   ├── seo/                  # SEO/metadata components
│   │   └── ui/                   # Primitive UI components
│   │       ├── button/           # Button component + variants
│   │       ├── form/             # Form input components
│   │       ├── dialog/           # Modal dialog
│   │       ├── card/             # Card container
│   │       ├── table/            # Data table
│   │       ├── [20+ other primitives]
│   │       ├── notifications/    # Toast notification system
│   │       ├── spinner/          # Loading spinner
│   │       ├── media-viewer/     # Image/video viewer
│   │       ├── media-uploader/   # File upload component
│   │       ├── link-preview/     # URL preview component
│   │       ├── md-preview/       # Markdown preview
│   │       └── text-editor/      # Rich text editor (TipTap)
│   │
│   ├── features/                 # Feature modules (domain-driven)
│   │   ├── auth/                 # Authentication feature
│   │   │   └── components/
│   │   │       ├── login-form.tsx
│   │   │       ├── register-form.tsx
│   │   │       ├── forgot-password-form.tsx
│   │   │       └── [other forms]
│   │   │
│   │   ├── posts/                # Posts feature
│   │   │   ├── api/              # React Query hooks + mutations
│   │   │   │   ├── create-post.ts
│   │   │   │   ├── get-posts.ts          # Infinite query with pagination
│   │   │   │   ├── get-post.ts
│   │   │   │   ├── vote-post.ts
│   │   │   │   ├── save-post.ts
│   │   │   │   ├── delete-post.ts
│   │   │   │   ├── report-post.ts
│   │   │   │   └── [other mutations]
│   │   │   └── components/       # Post UI components
│   │   │       ├── create-post.tsx      # Post creation form
│   │   │       ├── posts-list.tsx       # Feed/paginated list
│   │   │       ├── post-view.tsx        # Single post display
│   │   │       ├── upvote-post.tsx      # Vote button
│   │   │       ├── share-post.tsx       # Share action
│   │   │       ├── edit-post.tsx        # Post editing
│   │   │       └── [20+ other components]
│   │   │
│   │   ├── communities/          # Communities feature
│   │   │   ├── api/
│   │   │   └── components/
│   │   │
│   │   ├── messages/             # Direct messaging
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   │   └── messages-popup.tsx
│   │   │   └── stores/
│   │   │       └── messages-store.ts    # Zustand: isOpen, unreadCount
│   │   │
│   │   ├── notifications/        # User notifications
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   └── stores/
│   │   │       └── notifications-store.ts   # Zustand: unread badge
│   │   │
│   │   ├── profiles/             # User profiles
│   │   │   ├── api/
│   │   │   └── components/
│   │   │
│   │   ├── users/                # User-related features
│   │   │   ├── api/
│   │   │   └── components/
│   │   │
│   │   ├── settings/             # Account settings
│   │   │   ├── api/
│   │   │   └── components/
│   │   │
│   │   ├── search/               # Search functionality
│   │   │   ├── api/
│   │   │   └── components/
│   │   │
│   │   ├── post-comments/        # Comment threads
│   │   │   ├── api/
│   │   │   └── components/
│   │   │
│   │   ├── chatbot/              # AI chatbox sidebar
│   │   │   └── components/
│   │   │       └── ai-chatbox.tsx
│   │   │
│   │   └── dashboard/            # Dashboard page content
│   │       ├── api/
│   │       └── components/
│   │
│   ├── lib/                      # Core library/utilities
│   │   ├── api-client.ts         # Axios instance + interceptors
│   │   ├── auth.tsx              # Auth hooks (login, logout, refresh)
│   │   ├── authorization.tsx     # RBAC policies + hooks
│   │   ├── react-query.ts        # Query client config + types
│   │   ├── server-side-event.ts  # SSE connection + event handling
│   │   ├── auth.tsx              # Auth state + mutations
│   │   ├── colors.ts             # Color utilities
│   │   ├── get-metadata.ts       # SEO metadata generation
│   │   └── upload.ts             # File upload helpers
│   │
│   ├── config/                   # Application configuration
│   │   ├── env.ts                # Environment variables (API_URL, etc.)
│   │   └── paths.ts              # Route path definitions
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── api.ts                # Backend API response types
│   │
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                 # classname merging (clsx wrapper)
│   │   └── format.ts             # Formatting helpers (dates, numbers)
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-disclosure.ts     # Modal open/close hook
│   │   └── __tests__/            # Hook tests
│   │
│   ├── helper/                   # Helper functions
│   │   └── fancy-log.ts          # Styled console logging
│   │
│   ├── assets/                   # Static assets
│   │   └── [images, svg, fonts]
│   │
│   └── testing/                  # Test utilities & setup
│       ├── setup-tests.ts        # Vitest configuration
│       ├── test-utils.tsx        # Test helpers
│       ├── data-generators.ts    # Fake data generators
│       └── mocks/
│           ├── server.ts         # MSW server setup
│           ├── db.ts             # MSW data store
│           └── handlers/         # MSW request handlers
│
├── e2e/                          # Playwright E2E tests
│   └── tests/
│       ├── auth.setup.ts
│       ├── smoke.spec.ts
│       └── profile.spec.ts
│
├── generators/                   # Code generation templates
│   └── component/
│       ├── component.tsx.hbs     # Component template
│       ├── component.stories.tsx.hbs
│       └── index.cjs
│
├── public/                       # Static files served directly
│   ├── robots.txt
│   ├── _redirects
│   ├── mockServiceWorker.js      # MSW service worker
│   └── show/
│
├── docs/                         # Project documentation
│   ├── project-structure.md
│   ├── api-layer.md
│   ├── state-management.md
│   ├── error-handling.md
│   ├── testing.md
│   ├── deployment.md
│   └── [other docs]
│
├── write-down/                   # Task planning and notes
│   ├── instruction.md
│   ├── notes/
│   ├── tasks/
│   └── bug-catching/
│
├── .planning/                    # GSD planning directory
│   └── codebase/
│       ├── ARCHITECTURE.md       # This file
│       └── STRUCTURE.md          # This file
│
├── Configuration Files:
│   ├── vite.config.ts            # Vite build config
│   ├── tsconfig.json             # TypeScript config (path aliases)
│   ├── tailwind.config.cjs       # Tailwind CSS config
│   ├── postcss.config.cjs        # PostCSS config for Tailwind
│   ├── playwright.config.ts      # E2E test config
│   ├── plopfile.cjs              # Code generator config
│   │
│   ├── package.json              # Dependencies + scripts
│   ├── pnpm-lock.yaml            # Lockfile
│   │
│   ├── index.html                # HTML entry point
│   ├── mock-server.ts            # Development mock API server
│   ├── vercel.json               # Vercel deployment config
│   │
│   └── .github/
│       ├── copilot-instructions.md
│       ├── skills/               # GSD skills
│       └── agents/               # GSD agents
```

## Directory Purposes

### `src/`
Main source code root. All application code.

### `src/app/`
**Purpose:** Application shell, routing, and provider wrapping
- `provider.tsx` - Provides React Query, error boundary, auth loading
- `router.tsx` - All route definitions for the SPA
- `routes/` - Page components (lazy-loaded by router)

### `src/components/`
**Purpose:** Reusable, presentational UI components
- `ui/` - Primitive/base components (Button, Input, Dialog, etc.)
  - Each component in its own directory with `index.ts` barrel export
  - Built on Radix UI primitives + Tailwind styling
- `layouts/` - Page structural layouts (headers, sidebars)
- `errors/` - Global error UI
- `seo/` - Metadata/SEO components

### `src/features/`
**Purpose:** Domain-specific, self-contained feature modules
- Each folder is a feature area (posts, messages, communities, etc.)
- `api/` - Data fetching logic (React Query hooks + mutations)
- `components/` - Feature UI components
- `stores/` - Zustand stores for transient UI state
- Features are loosely coupled through query invalidation and events

### `src/lib/`
**Purpose:** Core infrastructure and shared utilities
- `api-client.ts` - HTTP client with auth interceptors
- `auth.tsx` - Authentication logic and hooks
- `authorization.tsx` - Role-based access control
- `react-query.ts` - React Query configuration
- `server-side-event.ts` - Real-time event handling
- `colors.ts`, `upload.ts`, etc. - Specialized utilities

### `src/config/`
**Purpose:** Application configuration
- `env.ts` - Environment variables (API_URL, etc.)
- `paths.ts` - Route path definitions and href generators

### `src/types/`
**Purpose:** TypeScript type definitions
- `api.ts` - Backend API response types (User, Post, etc.)

### `src/utils/`
**Purpose:** Reusable utility functions
- `cn.ts` - Classname merging helper
- `format.ts` - Formatting helpers

### `src/hooks/`
**Purpose:** Custom React hooks
- `use-disclosure.ts` - Modal open/close logic
- `__tests__/` - Hook tests

### `src/testing/`
**Purpose:** Test infrastructure
- `setup-tests.ts` - Vitest global setup
- `test-utils.tsx` - Test helper components
- `data-generators.ts` - Fake data generators
- `mocks/` - Mock Service Worker setup

### `e2e/`
**Purpose:** Playwright end-to-end tests
- Real browser automation tests
- Tests authentication, critical user flows

### `generators/`
**Purpose:** Code generation templates
- Plop-based component/feature scaffolding
- `plopfile.cjs` defines generators

### `public/`
**Purpose:** Static assets served directly
- `mockServiceWorker.js` - MSW service worker (required)
- `robots.txt` - SEO directives
- `_redirects` - Vercel redirect rules

### `docs/`
**Purpose:** Project documentation
- Architecture decisions, patterns, standards
- API documentation, deployment guides

### `write-down/`
**Purpose:** Working notes and task planning
- Not code; reference material for task execution

### `.planning/`
**Purpose:** GSD project planning
- Roadmap, milestones, phase planning
- Codebase analysis documents (this file)

## Key File Locations

### Entry Points
| File | Purpose |
|------|---------|
| `src/main.tsx` | React app bootstrap |
| `src/app/index.tsx` | Root App component |
| `src/app/provider.tsx` | Global provider setup |
| `src/app/router.tsx` | Route configuration |
| `src/app/routes/app/root.tsx` | Protected app entry point |

### Configuration
| File | Purpose |
|------|---------|
| `src/config/env.ts` | Environment variables |
| `src/config/paths.ts` | Route paths + href functions |
| `tsconfig.json` | TypeScript with `@/*` path alias |
| `vite.config.ts` | Build config, test setup |
| `tailwind.config.cjs` | Tailwind theming |

### Core Logic
| File | Purpose |
|------|---------|
| `src/lib/api-client.ts` | HTTP client + auth interceptor |
| `src/lib/auth.tsx` | User auth state + mutations |
| `src/lib/authorization.tsx` | Role-based access control |
| `src/lib/react-query.ts` | Query client configuration |
| `src/lib/server-side-event.ts` | SSE real-time updates |

### Testing
| File | Purpose |
|------|---------|
| `src/testing/setup-tests.ts` | Vitest configuration |
| `src/testing/mocks/server.ts` | MSW server |
| `src/testing/mocks/db.ts` | Mock database |

### Types
| File | Purpose |
|------|---------|
| `src/types/api.ts` | Backend API types |
| `vite-env.d.ts` | Vite globals (import.meta.env) |

## Naming Conventions

### Files
- **Components:** PascalCase with `.tsx` (e.g., `LoginForm.tsx`)
- **Hooks:** camelCase starting with `use` (e.g., `useDisclosure.ts`)
- **Utilities:** camelCase with descriptive name (e.g., `api-client.ts`)
- **Types:** camelCase (e.g., `api.ts`)
- **Tests:** Same name as tested file + `.test.ts` or `.spec.ts`

### Directories
- **Feature dirs:** kebab-case, singular or plural based on content (e.g., `post-comments`, `profiles`)
- **Component dirs:** kebab-case (e.g., `logo-button`, `media-viewer`)
- **Standard dirs:** Single word, lowercase (e.g., `api`, `components`, `utils`)

### Functions/Variables
- **React components:** PascalCase (e.g., `LoginForm`, `DashboardLayout`)
- **Hooks:** camelCase with `use` prefix (e.g., `useMessages`, `useCurrentUser`)
- **Utilities:** camelCase (e.g., `formatDate`, `getMeta`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `ROLES`, `POLICIES`)

### Imports
- **Path alias:** Always use `@/*` for src imports (via tsconfig.json)
  ```typescript
  // Good
  import { Button } from '@/components/ui/button';
  import { useMessages } from '@/features/messages/stores/messages-store';
  
  // Avoid
  import { Button } from '../../../../../components/ui/button';
  ```

## Where to Add New Code

### New Feature
1. Create `src/features/feature-name/`
2. Add subdirectories:
   - `api/` - React Query hooks (useFeature(), useCreateFeature(), etc.)
   - `components/` - UI components
   - `stores/` (if needed) - Zustand stores for UI state
3. Follow the post feature as template

**Example structure:**
```
src/features/comments/
├── api/
│   ├── create-comment.ts    (POST /posts/:id/comments)
│   ├── get-comments.ts      (GET /posts/:id/comments)
│   ├── delete-comment.ts    (DELETE /comments/:id)
│   └── vote-comment.ts      (POST /comments/:id/vote)
├── components/
│   ├── comment-list.tsx
│   ├── comment-view.tsx
│   ├── create-comment-form.tsx
│   └── comment-vote.tsx
```

### New Reusable Component
1. Create `src/components/ui/component-name/`
2. Create `component.tsx` with component code
3. Create `index.ts` with barrel export
4. Add Tailwind styling (className or external CSS)
5. Build on Radix UI primitives for base behavior

**Example:**
```
src/components/ui/avatar/
├── avatar.tsx       # Component impl
├── index.ts         # export { Avatar } from './avatar';
└── avatar.test.tsx  # Tests
```

### New Page Route
1. Create file in `src/app/routes/` matching URL structure
2. Export default: React component
3. Optional exports:
   - `ErrorBoundary` - Error UI for this route
   - Route loaders/actions (converted by router)
4. Use layout components from `src/components/layouts/`

**Example for `/app/discussions/:id`:**
```
src/app/routes/app/discussions/discussion.tsx
├── export default DiscussionPage
├── export const ErrorBoundary = DiscussionError
└── Add to router in src/app/router.tsx
```

### New Utility Function
- **API-related:** Add to `src/lib/` (e.g., `format-api-response.ts`)
- **Data formatting:** Add to `src/utils/` (e.g., `format.ts`)
- **UI helpers:** Add to `src/components/` or keep in component file
- **Feature-specific:** Keep in feature's api/ or component file

### New Store
1. Create in feature's `stores/` directory
2. Use Zustand: `create<StoreType>((set) => (...))`
3. Export hook: `export const useFeature = create(...)`
4. Use transient state only (modals, filters, selection)

**Example:**
```typescript
// src/features/comments/stores/comment-filter-store.ts
import { create } from 'zustand';

type CommentFilterStore = {
  sortBy: 'newest' | 'oldest' | 'mostVoted';
  setSortBy: (sort: string) => void;
};

export const useCommentFilter = create<CommentFilterStore>((set) => ({
  sortBy: 'newest',
  setSortBy: (sort) => set({ sortBy: sort as any }),
}));
```

### New API Mutation/Query
1. Create file in feature's `api/` directory
2. Define Zod input schema: `export const createXInput = z.object({...})`
3. Define async API function: `const createX = async (data) => api.post(...)`
4. Export React Query hook: `export const useCreateX = () => useMutation({...})`
5. Invalidate related queries on success

**Example:**
```typescript
// src/features/comments/api/create-comment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';
import { api } from '@/lib/api-client';

export const createCommentInput = z.object({
  postId: z.number(),
  content: z.string().min(1, 'Required'),
});

type CreateCommentDTO = z.infer<typeof createCommentInput>;

const createComment = async (data: CreateCommentDTO) => {
  return api.post(`/posts/${data.postId}/comments`, {
    content: data.content,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', (data as any).postId],
      });
    },
  });
};
```

### New Test
1. Create `.test.ts` or `.spec.ts` file next to tested file
2. Use Vitest + React Testing Library
3. Mock external dependencies (API, stores)
4. See `src/testing/` for utilities

**Example:**
```typescript
// src/features/comments/api/create-comment.test.ts
import { describe, it, expect, vi } from 'vitest';
import { useCreateComment } from './create-comment';
// ... test implementation
```

## Special Directories

### `.planning/`
**Purpose:** GSD project planning artifacts
- **Generated:** Yes (by GSD CLI)
- **Committed:** Yes (to git)
- **Contents:**
  - `roadmap.md` - Version roadmap with phases
  - `codebase/` - Analysis documents (ARCHITECTURE.md, etc.)
  - Phase planning directories for each phase number
  - Git log of planning decisions

### `__mocks__/`
**Purpose:** Vitest mock setup
- **Generated:** No (manual setup)
- **Committed:** Yes
- **Contents:**
  - `zustand.ts` - Mock Zustand stores for tests
  - `vitest-env.d.ts` - Type definitions

### `public/`
**Purpose:** Static assets served as-is by HTTP
- **Generated:** No (manual + MSW generates warmServiceWorkerjs)
- **Committed:** Yes
- **Note:** MSW service worker must be here for offline simulation

## Build Outputs

### Development
- Vite dev server on http://localhost:5173
- Generates no permanent artifacts

### Production Build
- `npm run build` → `vite build`
- Output: `dist/` (not shown in structure, .gitignored)
- Code-split chunks via Taildwind CSS class truncation and rollup config
- Vercel deployment via `vercel.json` config

---

*Structure analysis: 2026-03-28*
