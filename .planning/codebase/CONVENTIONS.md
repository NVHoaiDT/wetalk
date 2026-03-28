# Coding Conventions

**Analysis Date:** 2026-03-28

## Naming Patterns

### Files

**Convention:** All files use **kebab-case**, enforced by `eslint-plugin-check-file`.

- Component files: `button.tsx`, `dialog.tsx`, `text-editor.tsx`
- Hook files: `use-disclosure.ts`, `use-upload-images.tsx`
- Utility files: `data-generators.ts`, `setup-tests.ts`
- Feature files: `queries.ts`, `types.ts`, `api.ts`, `index.ts`

Example from `src/components/ui/button/button.tsx`:
```typescript
// File: src/components/ui/button/button.tsx
import { Button, buttonVariants } from './button';
```

### Directories

**Convention:** All directories use **kebab-case**, enforced by `eslint-plugin-check-file` (except `__tests__`).

- `src/components/` → contains `ui/`, `layouts/`, `errors/`, `seo/`
- `src/features/` → feature modules like `auth/`, `posts/`, `messages/`, `communities/`
- `src/testing/` → contains `mocks/`, `setup-tests.ts`, `test-utils.tsx`
- `__tests__/` → special directory for test files (exception to kebab-case rule)

### Functions & Variables

**Convention:** **camelCase** for all function definitions and variable declarations.

Example from `src/lib/upload.ts`:
```typescript
export const uploadImages = async ({ data }: { data: UploadImagesInput }) => {
  // Function names are camelCase
};

export const useUploadImages = ({ mutationConfig }: UseUploadImagesOptions) => {
  // Hook names start with 'use' prefix
};
```

Example from `src/hooks/use-disclosure.ts`:
```typescript
export const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = React.useState(initial);
  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
};
```

### Types & Interfaces

**Convention:** **PascalCase** for all type definitions.

Example from `src/lib/upload.ts`:
```typescript
export const uploadImagesInput = z.object({
  type: z.enum(['avatar', 'post', 'video_thumbnail', 'community_cover']),
  files: z.array(z.instanceof(File)).min(1),
});

export type UploadImagesInput = z.infer<typeof uploadImagesInput>;
export type UploadImageResponse = { /* ... */ };
```

Example from `src/types/api.ts`:
```typescript
export type User = {
  id: number;
  username: string;
  email: string;
  bio: string;
};

export type AuthResponse = {
  jwt: string;
  user: User;
};
```

### Enums

**Convention:** **UPPER_SNAKE_CASE** for enum values.

Example from `src/lib/authorization.tsx`:
```typescript
export enum ROLES {
  superAdmin = 'super_admin',
  moderator = 'moderator',
  user = 'user',
}
```

### Constants

**Convention:** **camelCase** for regular constants, **UPPER_SNAKE_CASE** for configuration constants.

Example from `src/testing/mocks/utils.ts`:
```typescript
export const AUTH_COOKIE = 'auth-token'; // Configuration constant
```

## Code Style

### Formatting

**Tool:** Prettier 3.2.5

**Configuration:** [`.prettierrc`](.prettierrc)
```json
{
  "printWidth": 80,
  "useTabs": false,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "bracketSpacing": true,
  "arrowParens": "always",
  "jsxSingleQuote": false,
  "bracketSameLine": false,
  "endOfLine": "lf"
}
```

**Key settings:**
- Line width: **80 characters**
- Indentation: **2 spaces**
- Quotes: **Single quotes** for JavaScript, **double quotes** for JSX attributes
- Semicolons: **Always required**
- Arrow function parentheses: **Always** (e.g., `(x) => x`, never `x => x`)
- Line endings: **LF** (Unix style)

### Linting

**Tool:** ESLint 8 with TypeScript support

**Configuration:** [`.eslintrc.cjs`](.eslintrc.cjs)

**Key plugins enabled:**
- `@typescript-eslint` - TypeScript linting
- `react` - React best practices
- `react-hooks` - Hooks linting
- `import` - Import/export organization
- `jsx-a11y` - Accessibility
- `testing-library` - Testing best practices
- `jest-dom` - DOM testing assertions
- `tailwindcss` - Tailwind class utilities
- `vitest` - Vitest-specific rules
- `prettier` - Prettier integration

**Key rules enforced:**

#### Import Organization
- Imports organized in groups: `builtin` → `external` → `internal` → `parent` → `sibling` → `index` → `object`
- **Always alphabetized** within each group (case-insensitive)
- **Blank lines** between import groups

Example from `src/app/routes/landing.tsx`:
```typescript
import { MessageCircle, Users, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';

import logo from '@/assets/logo.svg';
import { Head } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { useCurrentUser } from '@/lib/auth';
```

#### Feature Isolation
- **Cross-feature imports blocked**: Features cannot import from other features
  - `src/features/auth/` cannot import from `src/features/posts/`, etc.
  - Exception: Each feature can only import from itself
- **Unidirectional access**: `app` → `features` → `components/hooks/lib/types/utils`
  - Features cannot import from `app`
  - Shared modules (`components`, `hooks`, `lib`, `types`, `utils`) cannot import from `app` or `features`

#### Type Safety
- `@typescript-eslint/no-unused-vars` - **Error**: All unused variables forbidden
- `@typescript-eslint/no-explicit-any` - **Off**: `any` is allowed
- Explicit function return types - **Off**: Return types are optional
- Explicit module boundary types - **Off**: Not enforced

#### React
- `react/react-in-jsx-scope` - **Off**: Not needed with modern React
- `react/prop-types` - **Off**: TypeScript handles prop validation
- `jsx-a11y/anchor-is-valid` - **Off**: Allows anchor href patterns used in routing

## Import Organization

### Barrel Files (index exports)

**Pattern:** Use `index.ts` files to export public APIs from components and utilities.

Example from `src/components/ui/button/index.ts`:
```typescript
export { Button, buttonVariants } from './button';
```

This allows clean imports:
```typescript
import { Button } from '@/components/ui/button';
```

### Path Aliases

**Tool:** vite-tsconfig-paths

**Common aliases from `tsconfig.json`:**
- `@/` → `src/`
- `@/components` → `src/components/`
- `@/lib` → `src/lib/`
- `@/features` → `src/features/`
- `@/types` → `src/types/`
- `@/utils` → `src/utils/`

**Usage:**
```typescript
// Preferred: absolute imports with aliases
import { Button } from '@/components/ui/button';
import { useUploadImages } from '@/lib/upload';
import { useCurrentUser } from '@/lib/auth';

// Not preferred: relative imports
import { Button } from '../../../components/ui/button';
```

## Error Handling

### Patterns

**Theme:** Error boundaries + React Query error handling

Example from `src/lib/authorization.tsx`:
```typescript
export const useAuthorization = () => {
  const userQuery = useCurrentUser();
  const user = userQuery.data?.data;

  if (!user) {
    throw Error('User does not exist!');
  }

  // Use error state to validate conditions
  return { checkAccess, role: user.role };
};
```

**Components using react-error-boundary:**
- `src/components/errors/main.tsx` - Centralized error boundary
- Wraps main app routes to catch unhandled errors

**API error handling:**
- Uses `@tanstack/react-query` for mutation error management
- Mutations include `mutationConfig` parameter for error callbacks
- See `src/lib/upload.ts` for mutation pattern

## Logging

**Framework:** `console` (no external logging library)

**Conventions:**
- Use `console.log()` for general debugging
- Use `console.error()` for error conditions
- Development logging not enforced in production builds

Example from mock server setup:
```bash
yarn run-mock-server  # Uses pino-pretty for formatted output
```

## Comments

### When to Comment

**Comments are minimal** - code should be self-documenting.

**Use comments for:**
- Complex business logic explanation
- API documentation patterns
- Configuration notes
- Feature flags or experimental code

Example from `src/lib/upload.ts` (API documentation):
```typescript
/* 
API DOCS:

Every time you need to upload a photo/video/rawfile, the client will 
call the media service to process the upload. This service will process 
from validation, resize, format filename and save to cloud storage (Cloudinary)

REQUEST: 
POST BASEURL/images/upload (/videos/upload for videos)
...
*/
```

### JSDoc/TSDoc

**Convention:** No JSDoc used. TypeScript types serve as inline documentation.

## Function Design

### Size & Responsibility

**Pattern:** Small, focused functions with single responsibility.

Example from `src/hooks/use-disclosure.ts`:
```typescript
export const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = React.useState(initial);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((state) => !state), []);

  return { isOpen, open, close, toggle };
};
```

### Parameters

**Pattern:** Use object destructuring for multiple parameters.

Example from `src/lib/upload.ts`:
```typescript
// ✓ Good: object parameters
export const uploadImages = async ({
  data,
}: {
  data: UploadImagesInput;
}): Promise<UploadImageResponse> => {
  // Implementation
};

// ✗ Avoid: multiple positional parameters
export const uploadImages = async (data, onSuccess, onError) => {
  // Hard to remember order
};
```

### Return Values

**Pattern:** Explicit return types for public APIs, optional for internal functions.

Example from `src/lib/upload.ts`:
```typescript
// ✓ Public functions have explicit return types
export const uploadImages = async ({
  data,
}: {
  data: UploadImagesInput;
}): Promise<UploadImageResponse> => { /* ... */ };

// ✓ Custom hooks use explicit return type
export const useUploadImages = ({
  mutationConfig,
}: UseUploadImagesOptions) => {
  return useMutation({
    mutationFn: uploadImages,
  });
};
```

## Module Design

### Feature Structure

**Pattern:** Feature modules follow consistent structure.

Example from `src/features/auth/`:
```
src/features/auth/
├── components/          # UI components specific to auth
├── types.ts            # Feature-specific types
├── api.ts              # API calls for auth
├── queries.ts          # React Query hooks for auth
└── index.ts            # Public exports
```

**Pattern from upload utility:**
```typescript
// Export both the service function and the hook
export const uploadImages = async ({ data }: { data: UploadImagesInput }) => { };
export const useUploadImages = ({ mutationConfig }: UseUploadImagesOptions) => { };
```

### Exports

**Pattern:** Export public APIs from `index.ts` files.

Example from `src/components/ui/button/index.ts`:
```typescript
export { Button, buttonVariants } from './button';
```

Use barrel files to create clean API surfaces for consumers.

### Shared Code Organization

**Locations:**
- `src/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utilities, helpers, API clients
- `src/utils/` - Plain utility functions
- `src/types/` - Shared type definitions

## CSS & Styling

### Framework

**Primary:** Tailwind CSS 3.4.3

**Utilities:**
- `clsx` - Conditional class names
- `tailwind-merge` - Smart Tailwind class merging
- `class-variance-authority` - Component variant management

Example from `src/components/ui/button/button.tsx`:
```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background shadow-sm',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
      },
    },
  },
);
```

### Class Merging

**Tool:** `class-variance-authority` + `tailwind-merge`

```typescript
import { cn } from '@/utils/cn';

// Merge custom classes with variants
<Comp className={cn(buttonVariants({ variant, size, className }))} />
```

## React Patterns

### Hooks

**Convention:** Custom hooks use `use` prefix and are placed in `src/hooks/`.

Example from `src/hooks/use-disclosure.ts`:
```typescript
export const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = React.useState(initial);
  return { isOpen, open, close, toggle };
};
```

### Component Props

**Pattern:** Use TypeScript interfaces for component props.

Example from `src/components/ui/button/button.tsx`:
```typescript
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    icon?: React.ReactNode;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    return <Comp className={cn(buttonVariants({ variant, size, className }))} />;
  },
);
```

### Forms

**Framework:** React Hook Form + Zod validation

**Pattern:**
1. Define Zod schema
2. Use schema to infer TypeScript type
3. Pass type to `useForm` hook

Example from `src/lib/upload.ts`:
```typescript
export const uploadImagesInput = z.object({
  type: z.enum(['avatar', 'post', 'video_thumbnail', 'community_cover']),
  files: z.array(z.instanceof(File)).min(1, 'At least one file is required'),
});

export type UploadImagesInput = z.infer<typeof uploadImagesInput>;
```

### Component Composition

**Pattern:** Use Radix UI + custom components for composition.

Example from button with icon:
```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading, icon, children, ...props }, ref) => {
    return (
      <Comp {...props}>
        {isLoading && <Spinner size="sm" />}
        {!isLoading && icon && <span className="mr-2">{icon}</span>}
        <span>{children}</span>
      </Comp>
    );
  },
);
```

## State Management

**Library:** Zustand

**Location:** `src/lib/` for global stores

**Convention:** Stores are mocked in tests using `vi.mock('zustand')` in setup.

---

*Convention analysis: 2026-03-28*
