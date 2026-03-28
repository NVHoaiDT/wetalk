# Testing Patterns

**Analysis Date:** 2026-03-28

## Test Framework

### Runner

**Framework:** Vitest 1.x (via vite-node)

**Configuration:** [vite.config.ts](vite.config.ts)

```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/testing/setup-tests.ts',
  exclude: ['**/node_modules/**', '**/e2e/**'],
  coverage: {
    include: ['src/**'],
  },
}
```

**Key settings:**

- **Environment:** jsdom (browser-like environment)
- **Globals:** True (no need to import `describe`, `test`, `expect`)
- **Setup files:** `src/testing/setup-tests.ts`
- **Excluded:** node_modules and e2e tests

### Assertion Library

**Library:** Vitest built-in assertions + `@testing-library/jest-dom`

Assertions available globally:

```typescript
expect(value).toBe(expectedValue);
expect(value).toEqual(expectedValue);
expect(element).toBeInTheDocument();
expect(element).toHaveBeenCalled();
```

### Run Commands

```bash
# Run all unit tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage

# Run specific test file
yarn test use-disclosure.test.ts
```

## Test File Organization

### Location

**Convention:** Tests co-located with source code in `__tests__/` directories.

**Structure:**

```
src/
├── hooks/
│   ├── use-disclosure.ts
│   └── __tests__/
│       └── use-disclosure.test.ts
├── lib/
│   ├── upload.ts
│   └── (no tests yet)
└── features/auth/
    ├── components/
    └── (test structure TBD)
```

### Naming

**Convention:** `*.test.ts` or `*.test.tsx` for unit tests; `*.spec.ts` or `*.spec.tsx` for E2E tests.

Current test files found:

- `src/hooks/__tests__/use-disclosure.test.ts` - Hook unit test
- `e2e/tests/auth.setup.ts` - Playwright setup
- `e2e/tests/smoke.spec.ts` - E2E smoke tests
- `e2e/tests/profile.spec.ts` - E2E profile tests

## Test Structure

### Unit Test Organization

**Pattern:** Simple test structure with minimal setup required.

Example from `src/hooks/__tests__/use-disclosure.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useDisclosure } from '../use-disclosure';

test('should open the state', () => {
  const { result } = renderHook(() => useDisclosure());

  expect(result.current.isOpen).toBe(false);

  act(() => {
    result.current.open();
  });

  expect(result.current.isOpen).toBe(true);
});

test('should close the state', () => {
  const { result } = renderHook(() => useDisclosure());
  // ... test implementation
});

test('should toggle the state', () => {
  // ... test implementation
});
```

**Key patterns:**

- One `test()` per behavior (not per assertion)
- Test names describe the behavior: `should ...`
- Use `act()` wrapper for hook state updates
- Clear, readable assertion structure

### Setup & Teardown

**Global setup:** `src/testing/setup-tests.ts`

```typescript
import '@testing-library/jest-dom/vitest';
import { initializeDb, resetDb } from '@/testing/mocks/db';
import { server } from '@/testing/mocks/server';

vi.mock('zustand');

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

beforeEach(() => {
  // Mock browser APIs
  const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);

  // Mock browser encoding functions
  window.btoa = (str: string) => Buffer.from(str, 'binary').toString('base64');
  window.atob = (str: string) => Buffer.from(str, 'base64').toString('binary');

  initializeDb();
});

afterEach(() => {
  server.resetHandlers();
  resetDb();
});
```

**Applied to all tests:**

1. MSW server starts/listens before all tests
2. ResizeObserver mocked (used in many components)
3. Window encoding functions mocked
4. Database initialized/reset per test
5. Zustand globally mocked

## Mocking

### Framework

**Primary:** Mock Service Worker (MSW) 2.2.14

**Location:** `src/testing/mocks/`

**Structure:**

```
src/testing/mocks/
├── server.ts       # MSW server setup
├── browser.ts      # MSW browser setup (if needed)
├── handlers/       # HTTP request handlers
├── db.ts          # In-memory database
├── utils.ts       # Mock utilities
└── index.ts       # Exports
```

### Server Setup

Example from `src/testing/mocks/server.ts`:

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

Server is started in `beforeAll()` hook and listens with strict error handling:

```typescript
server.listen({ onUnhandledRequest: 'error' });
```

### Custom Mocking

**Vitest mocking with `vi.mock()`:**

From `src/testing/setup-tests.ts`:

```typescript
// Mock entire modules
vi.mock('zustand');
```

**Selective mocking within tests:**

```typescript
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
```

### What to Mock

**Should mock:**

1. API calls (handled by MSW)
2. Browser APIs (`ResizeObserver`, `btoa`, `atob`)
3. State management libraries (`zustand`)
4. Third-party external APIs

**Should NOT mock:**

1. React internals
2. Custom utility functions
3. Component logic (test actual behavior)

## Test Utilities & Fixtures

### Test Data Generators

**Location:** `src/testing/data-generators.ts`

**Pattern:** Factory functions using `@ngneat/falso` for random data generation.

```typescript
import {
  randCompanyName,
  randUserName,
  randEmail,
  randParagraph,
  randUuid,
  randPassword,
} from '@ngneat/falso';

const generateUser = () => ({
  id: randUuid() + Math.random(),
  firstName: randUserName({ withAccents: false }),
  lastName: randUserName({ withAccents: false }),
  email: randEmail(),
  password: randPassword(),
  teamId: randUuid(),
  teamName: randCompanyName(),
  role: 'ADMIN',
  bio: randParagraph(),
  createdAt: Date.now(),
});

export const createUser = <T extends Partial<ReturnType<typeof generateUser>>>(
  overrides?: T,
) => {
  return { ...generateUser(), ...overrides };
};
```

**Usage:** Allows tests to create realistic data with overrides.

```typescript
const user = createUser({ email: 'custom@example.com' });
```

### Render Utilities

**Location:** `src/testing/test-utils.tsx`

**Key helpers:**

```typescript
export const createUser = async (userProperties?: any) => {
  const user = generateUser(userProperties);
  await db.user.create({ ...user, password: hash(user.password) });
  return user;
};

export const loginAsUser = async (user: any) => {
  const authUser = await authenticate(user);
  Cookies.set(AUTH_COOKIE, authUser.jwt);
  return authUser;
};

export const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByTestId(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    { timeout: 4000 },
  );

export const initializeUser = async (user: any, render: (ui: any) => any) => {
  // Initialize and render with authenticated user
};
```

### Database Fixtures

**Framework:** @mswjs/data (in-memory database)

**Location:** `src/testing/mocks/db.ts`

```typescript
import { factory, primaryKey } from '@mswjs/data';
import { nanoid } from 'nanoid';

const models = {
  user: {
    id: primaryKey(nanoid),
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    teamId: String,
    role: String,
    bio: String,
    createdAt: Date.now,
  },
  discussion: {
    id: primaryKey(nanoid),
    title: String,
    body: String,
    authorId: String,
    teamId: String,
    createdAt: Date.now,
  },
  comment: {
    id: primaryKey(nanoid),
    body: String,
    authorId: String,
    discussionId: String,
    createdAt: Date.now,
  },
};

export const db = factory(models);
```

**Database operations:**

```typescript
db.user.create({ firstName: 'John', email: 'john@example.com' });
db.discussion.getAll();
db.comment.update({ where: { id }, data: { body: 'Updated' } });
```

## Coverage

### Requirements

**Currently:** No enforced coverage targets.

**Configuration in vite.config.ts:**

```typescript
coverage: {
  include: ['src/**'],
}
```

### View Coverage

```bash
yarn test --coverage
```

Generates coverage report showing untested files and line coverage percentages.

## Test Types

### Unit Tests

**Scope:** Individual functions, hooks, utilities

**Example:** `src/hooks/__tests__/use-disclosure.test.ts`

- Tests hook behavior in isolation
- Tests state changes and callbacks
- No external dependencies

**Pattern:**

```typescript
test('should [expected behavior]', () => {
  // Arrange: Set up test data
  const { result } = renderHook(() => useDisclosure());

  // Act: Perform action
  act(() => {
    result.current.open();
  });

  // Assert: Verify behavior
  expect(result.current.isOpen).toBe(true);
});
```

### Integration Tests

**Scope:** Multiple components/modules working together

**Framework:** Would use React Testing Library + custom render utilities

**Current status:** No dedicated integration tests found; would typically use `test-utils.tsx` helpers.

**Pattern would be:**

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createUser, loginAsUser } from '@/testing/test-utils';

test('user can log in and view dashboard', async () => {
  const user = await createUser();
  await loginAsUser(user);

  render(<App />);

  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

### E2E Tests

**Framework:** Playwright 1.43.1

**Configuration:** [playwright.config.ts](playwright.config.ts)

**Location:** `e2e/tests/`

**Current tests:**

1. **auth.setup.ts** - Authentication flow setup (used by other tests)
   - User registration
   - User login
   - Stores auth state in `.auth/user.json`

2. **smoke.spec.ts** - Basic smoke tests (verified features work)
   - Critical paths that must work in main app

3. **profile.spec.ts** - Profile feature tests
   - Profile viewing/editing
   - Profile interactions

### E2E Test Example

From `e2e/tests/auth.setup.ts`:

```typescript
import { test as setup, expect } from '@playwright/test';
import { createUser } from '../../src/testing/data-generators';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const user = createUser();

  await page.goto('/');
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.waitForURL('/auth/login');
  await page.getByRole('link', { name: 'Register' }).click();

  // Registration flow
  await page.getByLabel('First Name').fill(user.firstName);
  await page.getByLabel('Last Name').fill(user.lastName);
  await page.getByLabel('Email Address').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByLabel('Team Name').fill(user.teamName);
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForURL('/app');

  // Sign out and back in to verify
  await page.getByRole('button', { name: 'Open user menu' }).click();
  await page.getByRole('menuitem', { name: 'Sign Out' }).click();
  await page.getByLabel('Email Address').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Log in' }).click();

  // Store auth state for reuse
  await page.context().storageState({ path: authFile });
});
```

**Run E2E tests:**

```bash
yarn test-e2e  # Starts mock server + runs playwright
```

## Common Patterns

### Hook Testing Pattern

**Pattern:** Use `renderHook` with `act()` for state changes.

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from '../use-custom-hook';

test('hook behavior', () => {
  const { result } = renderHook(() => useCustomHook());

  expect(result.current.state).toEqual(initialValue);

  act(() => {
    result.current.action();
  });

  expect(result.current.state).toEqual(expectedValue);
});
```

### Component Testing Pattern

**Pattern:** Use Testing Library's `render()` with accessibility queries.

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './my-component';

test('component renders and responds to user interaction', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);

  const button = screen.getByRole('button', { name: /submit/i });
  expect(button).toBeInTheDocument();

  await user.click(button);
  expect(screen.getByText(/submitted/i)).toBeInTheDocument();
});
```

### Async Testing Pattern

**Pattern:** Use `async/await` with `waitFor()` for async operations.

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { AsyncComponent } from './async-component';

test('loads and displays data asynchronously', async () => {
  render(<AsyncComponent />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/data loaded/i)).toBeInTheDocument();
  });
});
```

### Error Testing Pattern

**Pattern:** Use error boundaries to test error scenarios.

```typescript
test('component handles errors gracefully', async () => {
  vi.mocked(apiCall).mockRejectedValueOnce(new Error('API failed'));

  render(<ComponentThatCallsAPI />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

## Test Coverage Gaps

### Currently Tested

1. ✓ Custom hooks (`use-disclosure.ts`)
2. ✓ Authentication flow (E2E)
3. ✓ Profile feature (E2E)
4. ✓ Smoke tests (critical paths)

### Not Yet Tested (Coverage Gaps)

1. **Error handling**: No explicit error scenario tests
   - Missing: API error handling in mutations
   - Missing: Form validation errors
   - Missing: Authorization failures

2. **Utility functions**: Most utilities in `src/utils/` and `src/lib/` lack unit tests
   - `src/lib/upload.ts` - No tests for file upload logic
   - `src/lib/auth.tsx` - Authorization logic not tested
   - `src/lib/authorization.tsx` - Policy functions not tested
   - `src/utils/cn.ts` - Classname merging not tested
   - `src/utils/format.ts` - Format functions not tested

3. **Components**: Limited component testing
   - No unit tests for `src/components/ui/` components
   - No integration tests for features
   - No tests for layout/error boundary components

4. **Feature modules**: No tests for feature logic
   - `src/features/auth/` - No authentication feature tests
   - `src/features/posts/` - No post creation/editing tests
   - `src/features/messages/` - No messaging tests
   - `src/features/communities/` - No community tests

5. **State management**: Zustand stores not tested
   - Global state mutations not verified
   - Store persistence not tested

6. **API integration**: Limited API testing
   - Only covered in E2E tests
   - No isolated API client tests
   - No request/response validation tests

### Priority for Testing

**High priority:**

1. Utility functions in `src/lib/` (high reuse)
2. Feature module APIs (high impact)
3. Error handling paths (production safety)

**Medium priority:**

1. UI components (covered partially by E2E)
2. Form validation (current approach: E2E only)
3. State management (low complexity in current schema)

**Low priority:**

1. Basic Layout components (visual, not much logic)
2. Presentational components (covered by E2E)

---

_Testing analysis: 2026-03-28_
