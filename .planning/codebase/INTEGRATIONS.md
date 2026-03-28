# External Integrations

**Analysis Date:** 2026-03-28

## APIs & External Services

**Primary API:**

- **Main Backend API** - RESTful API for core application functionality
  - Client: Axios instance at `src/lib/api-client.ts`
  - Base URL: Environment variable `VITE_APP_API_URL`
  - Authentication: Bearer token in Authorization header
  - Features: Auto-refresh token on 401, request/response logging
  - Endpoints: Users, auth, posts, comments, discussions, communities, messages

**Media API:**

- **Media Backend API** - Dedicated service for file uploads
  - Client: Separate Axios instance `apiMedia` in `src/lib/api-client.ts`
  - Base URL: Environment variable `VITE_APP_API_MEDIA_URL` (optional)
  - Purpose: Image/video upload handling
  - Used in: `src/lib/upload.ts` for image and video submission
  - Authentication: Bearer token via same interceptor

**AI Service:**

- **AI Backend API** - AI-powered features like post summarization
  - Base URL: Environment variable `VITE_APP_API_AI_URL` (optional)
  - Features: Post summarization via "wetake AI" chatbox
  - Integration: Available for content analysis

**Third-party APIs:**

- **JSONLink API** - Link metadata extraction
  - API Key: Environment variable `VITE_APP_JSONLINK_API_KEY` (optional)
  - Purpose: Extract metadata from shared URLs for rich link previews
  - Used in: `src/lib/get-metadata.ts` via React Query
  - Mocked in tests via `src/testing/mocks/handlers/link-metadata.ts`

## Data Storage

**Session Storage:**

- **LocalStorage** - OAuth/JWT Token persistence
  - Key: `accessToken`
  - Purpose: Persistent authentication across page reloads
  - Set via: Token refresh endpoint and login response
  - Cleared on: Logout or token refresh failure

**Cookies:**

- **HTTP Cookies** - Browser-side token management
  - Library: `js-cookie` (3.0.5)
  - Used for: Authentication cookie handling
  - Scope: Test utilities and mock setup
  - Secure flag: Enabled via `withCredentials: true` in Axios config

**File Storage:**

- **Temporary Client-side Storage** - For file uploads before submission
  - Mechanism: FormData objects passed to Media API
  - Supported types: Images (JPEG, PNG, WebP) and Videos (MP4, WebM)

**In-Memory State:**

- **Zustand Stores** - Real-time application state
  - Notifications store: Toast/alert notifications
  - Messages store: Real-time chat messages
  - Location: `src/features/*/stores/*.ts`

**Server-side Data:**

- **Backend Database** - Persisted via API endpoints
  - No direct client-side database (API-driven)
  - Real-time updates via Server-Sent Events

## Authentication & Identity

**Auth Provider:**

- **Custom Token-based Authentication** - JWT/Bearer token system
  - Token storage: localStorage key `accessToken`
  - Implementation: `src/lib/auth.tsx` with React Query hooks
  - Token refresh: Automatic via interceptor on 401 response
  - Endpoints:
    - `POST /auth/login` - User login
    - `POST /auth/register` - User registration
    - `POST /auth/refresh` - Token refresh
    - `POST /auth/logout` - User logout
    - `POST /auth/resend-verification` - Email verification
    - `POST /auth/reset-password` - Password reset

**OAuth Integration:**

- **Google OAuth** - Third-party authentication
  - Client ID: Environment variable `VITE_APP_GOOGLE_CLIENT_ID` (optional)
  - Purpose: Google sign-in alternative
  - User attribute: `authProvider` field in User type

**Protected Routes:**

- **React Router Protection** - Auth-aware routing
  - Implementation: `ProtectedRoute` component in `src/lib/auth.tsx`
  - Logic: Requires valid accessToken and successful user profile fetch
  - Redirect: Unauthorized users redirected to `/auth/login`

## Real-time Communication

**Server-Sent Events (SSE):**

- **Endpoint URL:** `{API_URL}/events/messages` (Bearer token authenticated)
- **Implementation:** Custom hook in `src/lib/server-side-event.ts`
- **Features:**
  - Real-time message delivery
  - Real-time notification updates
  - Conversation status updates
  - Unread message count tracking
- **Client Setup:** Automatic connection on feature mount, graceful reconnection
- **Consumer Components:** Messages and Notifications components monitor via `useServerSideEvent()`

## Monitoring & Observability

**Error Tracking:**

- None configured (handled via custom error boundaries)
- Implementation: `react-error-boundary` for component-level error handling

**Logging:**

- **Browser Console:** Manual console.log calls for API requests/responses
- **Server (Mock):** Pino HTTP logger in `mock-server.ts` for request/response logging
- **Test Output:** Standard test runner output via Vitest

**Request Logging:**

- Axios interceptor logs all API requests in format: `[API Request]: GET /users/me?param=value`

## Deployment

**Hosting Platform:**

- **Vercel** - Primary deployment target
  - Configuration: `vercel.json` with rewrites for SPA routing
  - Build command: `tsc && vite build --base=/`
  - Static asset optimization: Enabled

**Environment Configuration:**

- Vercel environment variables: Prefixed with `VITE_APP_`
- Example: `VITE_APP_API_URL=https://api.wetalk.com`

**Security Headers (Vercel):**

- `Cross-Origin-Opener-Policy: same-origin-allow-popups` - OAuth popup support
- `Permissions-Policy: interest-cohort=()` - FLoC opt-out

## CI/CD

**Testing & Validation Pipeline:**

- **Unit Tests:** Vitest automated on build
  - Run: `yarn test`
  - Watch: `yarn test -- --watch`
  - Coverage: Configured in `vite.config.ts`

**E2E Testing:**

- **Playwright** for browser automation
  - Config: `playwright.config.ts`
  - Run: `yarn test-e2e`
  - Execution: Starts mock server via PM2, runs tests against http://localhost:3000
  - Setup flow: Auth setup phase creates authenticated session in `e2e/.auth/user.json`

**Local Development Server:**

- **Vite Dev Server:** `yarn dev`
  - Port: 5173
  - Mock API option: Auto-enabled if `VITE_APP_ENABLE_API_MOCKING=true`

**Mock API Server:**

- **Express Server:** `yarn run-mock-server`
  - Port: 8080 (configurable via `VITE_APP_APP_MOCK_API_PORT`)
  - Uses MSW handlers matching real API contracts
  - Endpoint coverage: Auth, users, posts, discussions, comments, teams, links

## Environment Configuration

**Required Environment Variables:**
| Variable | Purpose | Type |
|----------|---------|------|
| `VITE_APP_API_URL` | Main backend API base URL | Required |
| `VITE_APP_API_MEDIA_URL` | Media upload service base URL | Optional |
| `VITE_APP_API_AI_URL` | AI service base URL | Optional |
| `VITE_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `VITE_APP_JSONLINK_API_KEY` | Link metadata extraction API key | Optional |
| `VITE_APP_ENABLE_API_MOCKING` | Enable/disable mock server (`'true'`/`'false'`) | Optional |
| `VITE_APP_APP_URL` | Frontend application URL (default: `http://localhost:3000`) | Optional |
| `VITE_APP_APP_MOCK_API_PORT` | Mock API server port (default: `8080`) | Optional |

**Secrets Management:**

- All API keys and sensitive values stored as environment secrets in Vercel
- Never committed to repository (`.env` files in `.gitignore`)
- Local development: Create `.env.local` with test values

## API Request/Response Flow

**Standard HTTP Request:**

```
Client (Axios) → Interceptor (Add Auth Token) → Backend API
                     ↓
              Response Interceptor
                     ↓
         Automatic Token Refresh (if 401)
                     ↓
         Return response.data to consumer
```

**Authentication Flow:**

```
User Credentials → POST /auth/login → Response: { accessToken, user }
                       ↓
        Store accessToken in localStorage
                       ↓
        Auto-add to all subsequent requests via interceptor
                       ↓
        On 401: POST /auth/refresh to get new token
```

**Media Upload Flow:**

```
FormData (files) → POST /api/media/upload → API_MEDIA_URL endpoint
                       ↓
          Bearer Token interceptor applied
                       ↓
        Returns: { uploadedFileUrls: [...] }
```

---

_Integration audit: 2026-03-28_
