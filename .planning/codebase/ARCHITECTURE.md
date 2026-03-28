# Architecture

**Analysis Date:** 2026-03-28

## Pattern Overview

**Overall:** Feature-based modular architecture with layered separation of concerns.

**Key Characteristics:**
- Domain-driven feature modules encapsulating related functionality
- Centralized routing and provider infrastructure at the app level
- Clean separation between UI components, business logic, and utilities
- Server-centric data management via React Query with Zustand for transient UI state
- Built on React Router for advanced client-side routing with lazy-loaded routes
- Real-time capabilities via Server-Sent Events (SSE) for messages and notifications

## Layers

### 1. Entry Point Layer
**Location:** `src/main.tsx`, `src/index.css`

**Purpose:** Application bootstrap with test environment setup and global styles.

**Contains:**
- React DOM root initialization with mock service worker integration
- Global CSS with Tailwind directives and CSS variable theme setup
- Error boundaries and suspense configuration

**Depends on:**
- `src/app` - Main App component
- `src/testing/mocks` - MSW for mocking HTTP in development

**Used by:** Browser/Node environment only

### 2. App/Provider Layer
**Location:** `src/app/provider.tsx`, `src/app/router.tsx`, `src/app/index.tsx`

**Purpose:** Application configuration, provider setup, and route definition.

**Contains:**
- `AppProvider`: Wraps children with React Query, error boundaries, auth loader, global UI components (notifications, messages popup, AI chatbox)
- `AppRouter`: Defines all routes with lazy-loaded components and React Router-compatible loaders/actions
- Root `App` component: Composes provider and router

**Depends on:**
- `@tanstack/react-query` - Query client and provider
- `react-router` - Browser router and route definitions
- `src/lib/auth` - Current user loading
- `src/components/errors` - Error fallback UI

**Used by:** `src/main.tsx` at startup

**Key Pattern:** Routes use `lazy()` for code splitting and `convert(queryClient)` function to inject QueryClient into route loaders/actions.

### 3. Core Library Layer
**Location:** `src/lib/`

**Purpose:** Shared utilities, integrations, and infrastructure code.

**Key modules:**

#### API Client (`src/lib/api-client.ts`)
- Axios instance with request/response interceptors
- Bearer token injection from localStorage
- 401 handling with automatic token refresh
- Request/response logging
- Centralized error notification via Zustand store

#### Authentication (`src/lib/auth.tsx`)
- `useCurrentUser()` - Fetches authenticated user from `/users/me`
- `useRefreshToken()` - Token refresh mutation
- `useLogout()` - Logout with query cache invalidation
- `useLoginWithEmailAndPassword()` - Email/password authentication
- Routes to login on 401 with access token expiry

#### Authorization (`src/lib/authorization.tsx`)
- Role-based access control with enum `ROLES` (superAdmin, moderator, user)
- Policy engine: `POLICIES` object with predicate functions
  - `comment:author` - Author or superAdmin can modify comments
  - `post:create` - Followers or superAdmin can create posts
  - `post:modify` - Only post author can modify
  - `community:moderate` - Moderators can manage community
  - `community:superAdmin` - Superadmin-only actions
- `useAuthorization()` - For authenticated-required components
- `useOptionalAuthorization()` - For optional auth contexts
- `<Authorization>` component - Declarative access control with fallback UI

#### React Query Configuration (`src/lib/react-query.ts`)
- Default options: no retry on failure, 60s staleTime, no window focus refetch
- Type utilities for query/mutation configuration
- Applied globally to QueryClientProvider

#### Server-Side Events (`src/lib/server-side-event.ts`)
- Unified SSE hook handling messages, conversations, notifications
- Real-time event types: `new_message`, `conversation_updated`, `new_notification`
- Automatic query invalidation on SSE events
- Unread count synchronization with server
- Mounted once at `AppRoot` level for authenticated users

**Depends on:** None (leaf layer)

**Used by:** Features, components, and routes

### 4. Feature Layer
**Location:** `src/features/`

**Purpose:** Domain-specific business logic organized by feature area.

**Organization:** Each feature is self-contained with:
- `api/` - Data fetching hooks and mutations using React Query
- `components/` - Feature-specific React components
- `stores/` - Zustand stores for transient UI state (e.g., modal open/close)

**Features:**
- `auth/` - Authentication forms, register/login/reset flows
- `users/` - User profile data, hover cards, achievements
- `profiles/` - User profile pages and editing
- `posts/` - Post creation, editing, voting, comments, sorting
- `communities/` - Community browsing, management, moderation
- `messages/` - Direct messaging, conversations, unread tracking
- `notifications/` - User notifications, unread badge
- `settings/` - Account, preferences, privacy settings
- `chatbot/` - AI chatbox sidebar component
- `search/` - Search results and filtering
- `post-comments/` - Comment threads and voting
- `dashboard/` - Dashboard page content and state

**Example Feature Structure (posts):**
```
src/features/posts/
├── api/
│   ├── create-post.ts        # POST /posts mutation + schema
│   ├── get-posts.ts          # GET /posts query with pagination
│   ├── get-post.ts           # GET /posts/:id single fetch
│   ├── vote-post.ts          # POST /posts/:id/vote mutation
│   ├── save-post.ts          # POST /posts/:id/save mutation
│   ├── delete-post.ts        # DELETE /posts/:id mutation
│   └── [other mutations]
├── components/
│   ├── create-post.tsx       # Post creation form
│   ├── post-view.tsx         # Single post render
│   ├── posts-list.tsx        # Feed/paginated list
│   ├── upvote-post.tsx       # Vote button component
│   └── [other components]
```

**API Pattern:** Each mutation/query file exports:
- Input schema (Zod validation)
- API function (async wrapper around `api` client)
- React Query hook (useMutation or useQuery)
- QueryKey factory for invalidation

**Component Pattern:** Components are presentation-focused with hooks pulled from feature's `api/` folder.

**Depends on:** `src/lib` and `src/components` for shared UI

**Used by:** Routes and other features

### 5. Component/UI Layer
**Location:** `src/components/`

**Purpose:** Reusable, presentational components shared across features.

**Organization:**
- `ui/` - Primitive UI components (Button, Input, Dialog, Card, etc.)
  - Built with Radix UI + CVA (class-variance-authority) for composition
  - Examples: `button/`, `form/`, `dialog/`, `table/`, `select/`, `dropdown/`
- `layouts/` - Page layout wrappers
  - `DashboardLayout` - Main app layout with sidebar
  - `AuthLayout` - Login/register page layout
- `errors/` - Error UI boundaries
  - `MainErrorFallback` - Root error boundary fallback
- `seo/` - SEO/metadata components

**Styling:** Tailwind CSS with CSS custom properties for theming (light/dark mode)

**Component Guidelines:**
- Unstyled primitives accept className overrides
- Exported as named exports with index.ts barrel files
- Props documented via TypeScript interfaces
- No business logic, purely presentational

**Depends on:** Radix UI, lucide-react icons, Tailwind CSS

**Used by:** All features and routes

### 6. Routes/Pages Layer
**Location:** `src/app/routes/`

**Purpose:** Page-level route components combining layouts, features, and hooks.

**Organization:**
```
src/app/routes/
├── landing.tsx                   # Home/landing page
├── auth/
│   ├── login.tsx
│   ├── register.tsx
│   ├── forgot-password.tsx
│   └── reset-password.tsx
├── app/
│   ├── root.tsx                  # App shell, SSE setup
│   ├── dashboard.tsx
│   ├── communites/
│   │   └── communites.tsx
│   ├── posts/
│   │   └── [...individual post routes]
│   └── [other app routes]
```

**Pattern:** Each route file exports:
- Default export: React component (lazy-loaded by router)
- Optional `ErrorBoundary` export: Error UI for this route
- Optional route loaders/actions (converted to React Router format)

**Example: `src/app/routes/app/root.tsx`**
- Mounts `DashboardLayout` wrapper
- Initializes SSE connection for real-time updates on `<Outlet />`
- Provides error boundary for entire `/app/*` subtree

**Depends on:** Features, components, layouts

**Used by:** AppRouter config

## Data Flow

### 1. Authentication Flow
```
User visits app
       ↓
main.tsx: enableMocking()
       ↓
AppProvider: <AuthLoader> → useCurrentUser()
       ↓
useCurrentUser() hits /users/me
       ↓
        ├─ Success → Store token in localStorage
        │  Children render normally
        │
        └─ 401 → Redirect to /auth/login
             (Token refresh attempted in api interceptor)
```

### 2. Post Creation Flow
```
User clicks "Create Post"
       ↓
features/posts/components/create-post.tsx
       ↓
Form submission → useCreatePost() mutation
       ↓
API: POST /posts with schema validation
       ↓
        ├─ Success → Invalidate posts queries
        │  Redirect to post detail
        │  Toast notification
        │
        └─ Error → Show form errors
             Toast with error message
```

### 3. Real-Time Updates (Messages)
```
User in messages-popup.tsx
       ↓
AppRoot.tsx: useServerSideEvents({ enabled: true })
       ↓
SSE endpoint: GET /events (streams)
       ↓
Server sends: new_message event
       ↓
handleSSEEvent() in server-side-event.ts
       ↓
queryClient.invalidateQueries(['messages', conversationId])
queryClient.invalidateQueries(['conversations'])
       ↓
React Query auto-refetch
       ↓
messages-popup updates with new message
Unread count syncs via useMessages store
```

### 4. State Management Strategy
```
Server State (React Query):
- Persistent data: Users, posts, comments, communities
- Fetched via api client
- Cached based on queryKey
- Invalidated on mutations or SSE events

Client/UI State (Zustand):
- Transient: Modal open/close, selected items, filters
- Examples:
  - useMessages: isOpen, selectedConversationId, unreadCount
  - useNotifications: isOpen, unreadCount
  - Features' stores for search filters, sorting preferences

Browser Storage (localStorage):
- accessToken for re-auth on page reload
- User preferences (theme, etc.)
```

## Component Boundaries

### Cross-Feature Communication
Features are loosely coupled through:
1. **Query Invalidation** - When feature A mutates data, it invalidates queries used by feature B
2. **Zustand Stores** - Global-but-scoped UI state (messages popup accessible from anywhere)
3. **SSE Events** - Real-time sync without direct coupling
4. **Props Drilling** - Routes compose features and pass needed props

### Example: Posting in a Community
```
routes/app/communities/community.tsx
       ↓
features/communities/components/community-view.tsx
       ↓
uses: features/posts/components/create-post.tsx
       ↓
calls: features/posts/api/create-post.ts
       ↓
API mutation includes communityId
       ↓
Success: Invalidates both:
- posts queries
- community queries (for post count update)
```

## Key Abstractions

### QueryKey Convention
Pattern: `[resource, filterCriteria, pagination]`
```typescript
// Examples:
['posts', { communityId: 5 }, { page: 1, limit: 20 }]
['conversations', { page: 1, limit: 20 }]
['user', userId]
['notifications']
```

### Input Validation
All mutations use Zod schemas defined in API files:
```typescript
// src/features/posts/api/create-post.ts
export const createPostInput = z.object({
  communityId: z.number().min(1, 'Required'),
  type: z.enum(['text', 'link', 'media', 'poll']),
  title: z.string().min(1, 'Required'),
  content: z.string().min(1, 'Required'),
  tags: z.array(z.string()),
  // ... conditional fields for link/media/poll types
});
```

### Authorization Patterns
1. **Role-based:** `@/lib/authorization.ROLES.superAdmin`
2. **Policy-based:** Predicate functions in `POLICIES` object
3. **Declarative:** `<Authorization allowedRoles={['moderator']}>` component
4. **Imperative:** `checkAccess()` from auth hook

### Error Handling
**Layers:**
1. **API Interceptor** (`src/lib/api-client.ts`) - Catches 401, refreshes token, retries
2. **Component Error Boundary** - `<Authorization forbiddenFallback={...}>`
3. **Route Error Boundary** - ErrorBoundary export from routes
4. **Global Error Boundary** - `<ErrorBoundary FallbackComponent={MainErrorFallback}>`
5. **Notifications** - Zustand store dispatches toast notifications on mutation errors

## Entry Points

### Browser Entry
**Location:** `src/main.tsx`
- Initializes MSW for development
- Creates React root
- Renders `<App />`

### App Entry
**Location:** `src/app/index.tsx`
- Delegates to `<AppProvider>` and `<AppRouter>`

### Protected App Entry
**Location:** `src/app/routes/app/root.tsx`
- Mounts `<DashboardLayout>`
- Initializes SSE for real-time updates
- Provides error boundary

### Route Entry Points (Lazy-Loaded)
- `/` - `src/app/routes/landing.tsx`
- `/auth/login` - `src/app/routes/auth/login.tsx`
- `/auth/register` - `src/app/routes/auth/register.tsx`
- `/app` (protected) - `src/app/routes/app/root.tsx`
  - `/app/dashboard` - `src/app/routes/app/dashboard.tsx`
  - `/app/communities` - `src/app/routes/app/communites/communites.tsx`
  - `/app/posts/:postId` - `src/app/routes/app/posts/[post routes]`
  - etc.

## Cross-Cutting Concerns

### Logging
**Approach:** Console-based with `fancyLog` helper from `src/helper/fancy-log.ts`
- API requests and responses logged in `api-client.ts` interceptors
- Auth state changes logged in `auth.tsx` hooks
- SSE events logged in `server-side-event.ts`

### Validation
**Approach:** Zod schemas at API boundary (mutations)
- Forms use hook-form + @hookform/resolvers with Zod
- Backend response types defined in `src/types/api.ts`

### Authentication
**Approach:** JWT with bearer tokens + token refresh
- Token stored in localStorage
- Injected as `Authorization: Bearer <token>` header
- Auto-refresh on 401 response
- Logout clears localStorage and redirects

### Authorization
**Approach:** Role-based + policy-based
- Roles: superAdmin, moderator, user
- Policies: Predicates for fine-grained checks
- Enforced at component level with `<Authorization>` wrapper
- Conditional rendering based on `useAuthorization()` hook

### Real-Time Sync
**Approach:** Server-Sent Events + Query Invalidation
- Single SSE connection at app root
- Handles: new messages, conversation updates, notifications
- Query invalidation triggers React Query refetch
- Unread counts synced via Zustand stores

### Styling
**Approach:** Tailwind CSS + CSS custom properties
- Colors use HSL variables for light/dark mode toggle
- Radix UI for unstyled primitives
- CVA for component variants
- Custom utilities in `tailwind.config.cjs`

## Testing

**Framework:** Vitest with jsdom environment
**Location:** `src/testing/setup-tests.ts`
**Mocks:** MSW for HTTP, Zustand store mocking, ResizeObserver stub

See [TESTING.md](TESTING.md) for detailed conventions.

---

*Architecture analysis: 2026-03-28*
