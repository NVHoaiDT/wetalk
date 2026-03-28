# Codebase Concerns

**Analysis Date:** 2026-03-28

## Tech Debt

### Console Logging Pollutes Production Builds

**Issue:** 72 console.log/error/warn statements scattered throughout production code
**Files:**

- `src/lib/api-client.ts` - 13 console statements in request/response interceptors
- `src/lib/auth.tsx` - 3 console statements
- `src/lib/server-side-event.ts` - 10 console statements
- `src/features/auth/components/login-google-form.tsx` - 11 console statements
- `src/features/dashboard/components/select-tags.tsx` - 2 console statements
- `src/features/postcomments/components/upvote-post-comment.tsx` - 1 console statement
- `src/features/posts/components/create-post.tsx` - 2 console statements
- `src/features/posts/components/edit-post.tsx` - 2 console statements
- Multiple other feature files with console statements

**Impact:**

- Bundle size bloat from debug logging
- Sensitive API request URLs and tokens potentially disclosed in browser console
- Unprofessional user experience if users see debug logs
- Harder to distinguish real errors from development logging

**Fix approach:**

- Create a debug utility that only logs in development mode
- Remove all console statements, replace with proper error handling
- Consider using a proper logging library (e.g., pino-logger or winston)

---

## Test Coverage Gaps

### Insufficient Unit and Integration Test Coverage

**Issue:** Only 7 test files for a complex feature-rich application
**Current tests:**

- `src/components/seo/__tests__/head.test.tsx` - SEO component
- `src/components/ui/dialog/__tests__/dialog.test.tsx` - Dialog component
- `src/components/ui/dialog/confirmation-dialog/__tests__/confirmation-dialog.test.tsx` - Confirmation dialog
- `src/components/ui/drawer/__tests__/drawer.test.tsx` - Drawer component
- `src/components/ui/form/__tests__/form.test.tsx` - Form component
- `src/components/ui/notifications/__tests__/notifications.test.ts` - Notifications store
- `src/hooks/__tests__/use-disclosure.test.ts` - Hook test

**Missing test coverage:**

- No tests for critical API calls, mutations, or query hooks
- No tests for authentication flows (login, logout, token refresh)
- No tests for SSE (real-time messaging, notifications)
- No tests for form validation and submission
- No tests for feature-level business logic (post creation, commenting, voting, etc.)
- No tests for error handling and edge cases

**Impact:**

- High risk of regressions in critical flows
- Poor code quality, difficult to refactor safely
- No confidence in API contract changes
- Hard to catch breaking changes during development

**Priority:** HIGH

**Fix approach:**

- Add unit tests for all custom hooks (auth, SSE, API)
- Add integration tests for feature flows (create post, comment, vote)
- Add tests for error scenarios (network failures, auth failures, validation errors)
- Set minimum coverage threshold (> 80% for src)
- Integrate coverage checks in CI/CD

---

### E2E Test Coverage Incomplete

**Issue:** Only 3 E2E test files with minimal coverage
**Current E2E tests:**

- `e2e/tests/auth.setup.ts` - Auth setup
- `e2e/tests/profile.spec.ts` - Profile feature
- `e2e/tests/smoke.spec.ts` - Smoke tests

**Missing critical user flows:**

- Post creation, editing, deletion
- Commenting and voting
- Community management
- Real-time messaging flows
- Search functionality

**Impact:** Cannot validate complete user journeys, regressions go undetected

---

## Security Concerns

### TOKEN STORAGE VULNERABILITY — XSS Risk

**Issue:** Authentication token stored in localStorage, vulnerable to XSS attacks
**Files:** `src/lib/auth.tsx`, `src/lib/api-client.ts` (multiple locations)
**Code pattern:**

```typescript
localStorage.setItem('accessToken', response.data.accessToken);
```

**Current Risk:**

- Any XSS vulnerability in app allows attacker to steal tokens
- No protection against script injection
- localStorage is readable by any script in the page

**Mitigation in place:** None

**Recommendations:**

- Move token to secure HTTP-only cookie (requires backend support)
- Implement CSP (Content Security Policy) headers
- Regular security audits for XSS vulnerabilities
- Consider using session-based storage instead of localStorage

**Priority:** HIGH

---

### Unsafe HTML Rendering Without Consistent Sanitization

**Issue:** Inconsistent XSS protection across user-generated content
**Files:**

- `src/components/ui/md-preview/md-preview.tsx` — Uses DOMPurify on marked output ✓
- `src/features/post-comments/components/create-post-comment.tsx` — Uses innerHTML without sanitization ✗
- `src/features/posts/api/get-summary-post.ts` — Uses innerHTML without sanitization ✗
- `src/features/profiles/components/profile-comments-list.tsx` — Uses dangerouslySetInnerHTML without DOMPurify ✗

**Impact:**

- Comment content and summaries could contain malicious scripts
- User profile data could be compromised via injected code
- XSS vulnerabilities in user-generated content

**Fix approach:**

- Apply DOMPurify to all HTML content rendering
- Use `dangerouslySetInnerHTML` only with sanitized content
- Create a sanitization utility wrapper

---

### GOOGLE_CLIENT_ID Potentially Exposed

**Issue:** Google OAuth client ID passed through environment and logged
**Files:** `src/features/auth/components/login-google-form.tsx`
**Code:**

```typescript
console.error('GOOGLE_CLIENT_ID is not configured');
console.log('Initializing Google Sign-In...', {
  clientId: env.GOOGLE_CLIENT_ID,
});
```

**Impact:**

- Client ID visibility in console logs (minor risk - client IDs are public by design)
- More concerning if credentials are hardcoded

**Fix approach:**

- Remove logging of sensitive configs
- Verify environment variables are properly loaded
- Document which env vars should never be logged

---

## Performance Concerns

### LARGE COMPONENT FILES WITH COMPLEX LOGIC

**Issue:** Several components exceed 300+ lines, combining multiple concerns
**Large files:**

- `src/components/ui/media-viewer/media-viewer.tsx` — Media viewer with video quality controls
- `src/app/routes/landing.tsx` — Large landing page with many sections
- `src/features/posts/components/edit-media-uploader.tsx` — Complex upload logic
- `src/features/posts/components/edit-post.tsx` — Complex post editor
- `src/features/communities/components/community-view.tsx` — Community page logic
- `src/features/settings/components/setting-account.tsx` — Settings with multiple sections

**Impact:**

- Harder to understand and maintain
- More prone to bugs
- Difficult to test individual features
- Potential unnecessary re-renders

**Fix approach:**

- Break large components into smaller, focused sub-components
- Extract form logic to custom hooks
- Extract display logic to separate presentational components
- Use composition pattern

---

### INEFFICIENT QUERY CONFIGURATION

**Issue:** React Query retry disabled, no exponential backoff on failures
**Files:** `src/lib/react-query.ts`
**Configuration:**

```typescript
queries: {
  refetchOnWindowFocus: false,
  retry: false,  // ← No retry logic
  staleTime: 1000 * 60,  // 1 minute stale time
}
```

**Impact:**

- Network temporary failures cause complete failure
- No resilience to flaky networks or momentary server issues
- Poor user experience on slow/unreliable connections

**Fix approach:**

- Implement retry with exponential backoff for transient errors
- Differentiate between retryable (5xx, timeouts) and non-retryable errors (4xx, auth)
- Add proper error handling UI for failures

---

### MULTIPLE API CLIENT IMPLEMENTATIONS WITH TOKEN REFRESH DUPLICATION

**Issue:** Three separate API client instances (`api`, `apiMedia`, `apiAI`) with duplicated token refresh logic
**Files:** `src/lib/api-client.ts` (270+ lines)
**Duplicated code:**

- Token refresh logic repeated 3 times
- Nearly identical error handling and interceptors
- Each client independently manages token refresh

**Impact:**

- Bug fixes must be applied to all 3 clients
- Inconsistent behavior between API types
- Maintenance burden
- Risk of inconsistency

**Fix approach:**

- Create single API client factory with configurable base URLs
- Extract token refresh logic to shared interceptor
- Use a single axios instance with multiple base URLs or request transformations

---

### SSE CONNECTION MEMORY LEAK POTENTIAL

**Issue:** SSE connections may not properly cleanup in all scenarios
**Files:**

- `src/lib/server-side-event.ts` - 200+ lines
- `src/features/notifications/api/use-notification-sse.ts`
- `src/features/messages/api/use-messages-sse.ts`

**Concerns:**

1. Multiple useEffect cleanup functions
2. Reader references kept in connectionRef
3. No guaranteed cleanup if component unmounts during connection
4. Multiple SSE implementations instead of unified approach

**Risk:**

- Browser accumulates unclosed SSE connections
- Memory leaks over extended usage
- Network resource exhaustion

**Code pattern:**

```typescript
return () => {
  document.removeEventListener('keydown', handleKeyDown);
  // May not properly close SSE reader
};
```

**Fix approach:**

- Consolidate to single unified SSE hook
- Ensure reader cleanup: `reader.cancel()`
- Test memory impact over extended sessions
- Add connection lifecycle logging

---

## Fragile Areas

### TYPE SYNCHRONIZATION WITH BACKEND IS MANUAL

**Issue:** API types in `src/types/api.ts` are manually maintained but marked as "autogenerated"
**Files:** `src/types/api.ts` (400+ lines)
**Header comment:**

```
// let's imagine this file is autogenerated from the backend
// ideally, we want to keep these api related types in sync
// with the backend instead of manually writing them out
```

**Risk:**

- Divergence between actual backend API and client types
- Breaking changes from backend go undetected until runtime
- New fields/changes must be manually synchronized
- Type errors don't catch API contract violations

**Examples of fragility:**

- `User.achievement` type may not match backend changes
- `Pagination` types marked as "Testing zone" (unclear status)
- No validation of API responses against types

**Fix approach:**

- Implement true API code generation (OpenAPI/TypeBox from backend)
- Add runtime validation (zod) for all API responses
- Add response type schema validation in React Query hooks
- Generate types from backend during build

---

### HARDCODED CLOUDINARY URL PATTERN

**Issue:** Hardcoded Cloudinary account ID in multiple places
**Files:**

- `src/components/ui/media-viewer/media-viewer.tsx` — `dd2dhsems` hardcoded
- `src/app/routes/landing.tsx` — Hardcoded URL
- Comments in upload docs

**Risk:**

- Account switching requires code changes
- URL patterns tightly coupled to implementation

**Fix approach:**

- Move to environment configuration
- Create media URL utility function

---

### INCOMPLETE ERROR HANDLING WITH COMMENTED-OUT CODE

**Issue:** Key error handling is commented out or incomplete
**Files:** `src/lib/api-client.ts`
**Example:**

```typescript
// if (!currentPath.startsWith('/auth')) {
//   window.location.href = paths.auth.login.getHref(currentPath);
// }
// return Promise.reject(refreshError); // ← commented out
return null; // ← returns null instead of rejecting
```

**Impact:**

- Unclear error recovery behavior
- Token refresh failures silently return null
- Requests may continue with invalid state

**Fix approach:**

- Complete the error handling implementation
- Document why code is commented vs. removed
- Ensure 401 responses properly redirect to login

---

## Missing Critical Features

### INCOMPLETE TODO ITEMS IN CRITICAL PATHS

**Issue:** 11 TODO/FIXME comments scattered throughout code, some in critical flows
**Critical TODOs:**

1. `src/lib/auth.tsx:79` — "TODO: Add config onSuccess in consumers and remove this"
   - Hardcoded window.location.href in logout
   - Requires callback pattern implementation

2. `src/features/settings/components/setting-account.tsx:88` — Location update API not implemented

3. `src/features/dashboard/components/recent-posts-sidebar.tsx:119` — Color coding by engagement not implemented

4. `src/components/ui/link-preview/link-preview.tsx:34,43` — UI polish pending

5. `src/features/posts/components/poll-view.tsx:57` — User vote indicator not showing

6. `src/features/profiles/components/profile-sidebar.tsx:42` — Badge history modal not implemented

7. `src/testing/mocks/handlers/auth.ts:95,119,139` — "todo: remove once tests in Github Actions are fixed"

**Impact:**

- Incomplete user-facing features
- Features working partially but not fully
- Test infrastructure relies on workarounds

**Priority:** Track and schedule for completion

---

## Dependency & Maintenance Issues

### MULTIPLE SSE IMPLEMENTATIONS

**Issue:** SSE functionality duplicated across 3 files with slight variations
**Files:**

- `src/lib/server-side-event.ts` (200+ lines) — Main implementation
- `src/features/messages/api/use-messages-sse.ts` (150+ lines) — Messages-specific
- `src/features/notifications/api/use-notification-sse.ts` (150+ lines) — Notifications-specific

**Risk:**

- Bugs must be fixed in multiple places
- Inconsistent behavior between features
- Hard to test
- Code duplication = maintenance burden

**Fix approach:**

- Create generic useSSE hook with event type parameter
- Consolidate to single implementation with pluggable handlers

---

### INCOMPLETE FORM ERROR LOGGING

**Issue:** Form errors logged in development but not exposed to users
**Files:**

- `src/features/posts/components/create-post.tsx:97,98`
- `src/features/posts/components/edit-post.tsx:97,98`
  **Code:**

```typescript
console.log('form errors', formState.errors);
console.log('form values', getValues());
```

**Issues:**

- Users don't see validation errors
- Errors only visible in browser console
- Console logging instead of proper error UI

**Fix approach:**

- Implement error display in form UI
- Remove console.log calls
- Use react-hook-form error handling

---

### UNUSED OR UNCLEAR CODE PATTERNS

**Issue:** Some code patterns suggest incomplete refactoring
**Examples:**

- `src/types/api.ts` marked "Testing zone"
- `fancy-log.ts` utility (fancy logging helper) - likely debug code
- Multiple console statements with emoji prefixes for tagging

**Impact:**

- Unclear intent makes maintenance harder
- Clutters codebase with debug utilities

---

## Potential Future Concerns

### SCALABILITY CONCERNS

**Database/API:**

- No pagination caching strategy visible
- Search implementation may not scale to large datasets
- Real-time features (messaging, notifications) may have latency at scale

**Frontend:**

- Long lists (posts, comments) rendered without virtualization visible in core components
- Media viewer may struggle with large arrays of images/videos
- No lazy-loading of route components (code-splitting)

**Recommendation:**

- Profile performance with realistic data volumes
- Implement virtualized lists for long collections
- Add route-based code splitting

---

### REAL-TIME FEATURES RELY ON SINGLE CONNECTION

**Issue:** All real-time events (messages, notifications, conversations) flow through single SSE connection
**Files:** `src/lib/server-side-event.ts`

**Risk:**

- Single point of failure
- One event parsing error breaks all real-time features
- No priority/timeout management per event type

**Recommendation:**

- Consider fallback mechanism if SSE fails
- Separate critical (messages) from non-critical (notifications) channels
- Add circuit breaker pattern

---

### NO OFFLINE SUPPORT

**Issue:** App assumes continuous connectivity
**Impact:**

- Works poorly on unreliable networks
- No cached data for offline viewing
- Real-time features require active connection

**Recommendation:**

- Implement service workers for offline caching
- Queue mutations when offline
- Sync when reconnected

---

## Validation & Data Integrity Issues

### RUNTIME VALIDATION MISSING FOR API RESPONSES

**Issue:** API responses not validated against expected types
**Files:** All API hooks in `src/lib/auth.tsx`
**Current pattern:**

```typescript
const getCurrentUser = async (): Promise<{ data: User | null }> => {
  return api.get('/users/me'); // ← No runtime validation
};
```

**Risk:**

- Backend API changes not caught until runtime errors
- Type/shape mismatches silently corrupt state
- No warning of API contract violations

**Fix approach:**

- Add Zod schema validation to all API responses
- Wrap queries with runtime type guards
- Log validation errors for debugging

---

## Build & Deployment Concerns

### EXPERIMENTAL VITE CONFIGURATION

**Issue:** Using experimental features in build configuration
**Files:** `vite.config.ts`
**Code:**

```typescript
experimentalMinChunkSize: 3500,
external: ['fs/promises'],
```

**Risk:**

- Experimental features may break in future Vite versions
- fs/promises external marking unusual for frontend
- Unclear why chunk size is manually tuned

**Recommendation:**

- Document why experimental features are needed
- Plan for replacement when feature stabilizes
- Test bundle output for size/count anomalies

---

## Documentation & Knowledge Gaps

### INSTRUCTION COMMENTS CONTRADICT IMPLEMENTATION

**Issue:** Comments in `src/lib/upload.ts` document API expectations but actual integration may differ
**Example:** Upload docs detail specific form-data structure, but implementation just appends files

**Risk:**

- Developers implementing similar features might follow docs instead of code
- API contract unclear

---

## Summary by Severity

### 🔴 HIGH PRIORITY

1. Test coverage gaps - No unit tests for business logic
2. Token storage in localStorage (XSS vulnerability)
3. Inconsistent XSS protection in HTML rendering
4. Incomplete error handling with commented-out code

### 🟠 MEDIUM PRIORITY

1. Console logging in production (72 statements)
2. Large component files needing refactoring
3. Multiple SSE implementations (maintenance burden)
4. API client duplication
5. Manual type synchronization with backend
6. Incomplete form error handling

### 🟡 LOW PRIORITY

1. Hardcoded URLs and values
2. Experimental Vite config
3. Performance optimization opportunities
4. Code documentation gaps

---

_Concerns audit: 2026-03-28_
