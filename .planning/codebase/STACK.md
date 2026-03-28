# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**

- **TypeScript** 5.4.5 - All source code in `src/` and supporting files
- **JavaScript** - Configuration files and legacy support
- **CSS** - Styling via Tailwind CSS with custom configuration

## Runtime

**Environment:**

- **Node.js** - Environment agnostic (supports v18+)

**Package Manager:**

- **pnpm** - Recommended package manager (configured in `pnpm-lock.yaml`)
- **npm/yarn** - Supported alternatives but not recommended

## Frameworks

**Core:**

- **React** 18.3.1 - UI framework, main entry in `src/main.tsx`
- **React Router** 7.0.2 - Client-side routing in `src/app/router.tsx`
- **Vite** 5.2.10 - Build tool and dev server (`vite.config.ts`)

**State Management & Data:**

- **Zustand** 4.5.2 - Lightweight state management for stores (e.g., `src/features/notifications/stores/notifications-store.ts`)
- **TanStack React Query** 5.32.0 - Server state management, caching, and synchronization (`src/lib/react-query.ts`)
- **TanStack React Query DevTools** 5.32.0 - Development utilities

**Forms & Validation:**

- **React Hook Form** 7.51.3 - Form state and performance (`src/features/auth/components/register-form.tsx`)
- **@hookform/resolvers** 3.3.4 - Zod resolver integration
- **Zod** 3.23.4 - Runtime schema validation (`src/config/env.ts`, form schemas)

**UI & Styling:**

- **Tailwind CSS** 3.4.3 - Utility-first CSS framework (`tailwind.config.cjs`)
- **PostCSS** 8.4.38 - CSS processing
- **Autoprefixer** 10.4.19 - Browser vendor prefix support
- **Radix UI** - Component library
  - React Radix UI Dialog 1.0.5
  - React Radix UI Dropdown Menu 2.0.6
  - React Radix UI Hover Card 1.1.15
  - React Radix UI Icons 1.3.0
  - React Radix UI Label 2.0.2
  - React Radix UI Select 2.2.6
  - React Radix UI Slot 1.0.2
  - React Radix UI Switch 1.0.3
- **class-variance-authority** 0.7.0 - CSS class generation for components
- **clsx** 2.1.1 - Conditional className utility
- **tailwind-merge** 2.6.0 - Merge Tailwind CSS classes intelligently
- **tailwindcss-animate** 1.0.7 - Animation utilities extension
- **@tailwindcss/typography** 0.5.13 - Typography plugin for rich text

**Rich Text & Content:**

- **Tiptap** - Rich text editor
  - @tiptap/react 3.9.1
  - @tiptap/starter-kit 3.9.1
  - @tiptap/extension-link 3.10.0
- **Marked** 12.0.2 - Markdown parsing
- **DOMPurify** 3.1.1 - HTML sanitization for security

**HTTP & API:**

- **Axios** 1.6.8 - HTTP client library (`src/lib/api-client.ts`)

**Real-time & Media:**

- **React Player** 3.3.3 - Video/media playback
- **Media Chrome** 4.15.1 - Media player controls UI

**Utilities:**

- **date-fns** 4.1.0 - Date manipulation and formatting
- **dayjs** 1.11.11 - Date library alternative
- **nanoid** 5.0.7 - URL-friendly unique ID generation
- **js-cookie** 3.0.5 - Browser cookie management
- **react-error-boundary** 4.0.13 - React error boundary component
- **react-helmet-async** 2.0.4 - Dynamic HTML head management
- **framer-motion** 12.23.24 - Animation library
- **lucide-react** 0.554.0 - Icon library
- **@ngneat/falso** 7.2.0 - Fake data generation for testing

## Build & Development

**Build Tool:**

- **Vite** 5.2.10 - ESM-native build tool (`vite.config.ts`)
- **Rollup** - Bundler (via Vite)
- **@vitejs/plugin-react** 4.2.1 - Fast Refresh for React

**TypeScript & Processing:**

- **TypeScript** 5.4.5 - Type checking and compilation
- **vite-tsconfig-paths** 4.3.2 - Path alias resolution

## Testing

**Unit & Integration Testing:**

- **Vitest** 2.1.4 - Unit test runner (`vite.config.ts` configured with jsdom)
- **vite-node** 1.6.0 - Node execution in Vite projects
- **@testing-library/react** 15.0.5 - Component testing utilities
- **@testing-library/jest-dom** 6.4.2 - DOM matchers
- **@testing-library/user-event** 14.5.2 - User interaction simulation
- **jsdom** 24.0.0 - DOM implementation for Node.js
- **jest-environment-jsdom** 29.7.0 - Test environment configuration

**E2E Testing:**

- **Playwright** (@playwright/test) 1.43.1 - Browser automation (`playwright.config.ts`)
- **@mswjs/data** 0.16.1 - Mock database for testing
- **@mswjs/http-middleware** 0.10.1 - HTTP middleware for mocking

**API Mocking:**

- **MSW (Mock Service Worker)** 2.2.14 - API request interception (`src/testing/mocks/`)
- **setupWorker** (msw/browser) - Browser worker setup for request mocking

## Code Quality

**Linting & Formatting:**

- **ESLint** 8 - JavaScript linter (`eslint.config.*`)
- **@typescript-eslint/parser** 7.8.0 - TypeScript support
- **@typescript-eslint/eslint-plugin** 7.8.0 - TypeScript rules
- **Prettier** 3.2.5 - Code formatter
- **eslint-config-prettier** 9.1.0 - Disable conflicting ESLint rules
- **eslint-plugin-prettier** 5.1.3 - Prettier as ESLint rule
- **eslint-plugin-react** 7.34.1 - React-specific rules
- **eslint-plugin-react-hooks** 4.6.2 - React Hooks rules
- **eslint-plugin-jsx-a11y** 6.8.0 - Accessibility rules
- **eslint-plugin-import** 2.29.1 - Import/export rules
- **eslint-plugin-tailwindcss** 3.15.1 - Tailwind CSS linting
- **eslint-plugin-jest-dom** 5.4.0 - jest-dom matchers
- **eslint-plugin-testing-library** 6.2.2 - Testing Library best practices
- **eslint-plugin-vitest** 0.5.4 - Vitest linting
- **eslint-plugin-playwright** 1.6.0 - Playwright testing rules
- **eslint-plugin-check-file** 2.8.0 - File naming conventions
- **eslint-import-resolver-typescript** 3.6.1 - TypeScript import resolution

**Git Hooks:**

- **Husky** 9.0.11 - Git hooks management (`src/.husky/`)
- **lint-staged** 15.2.2 - Run linters on staged files

## Development Tools

**Component Development:**

- **Storybook** 8.0.9 - Component documentation and development
- **@storybook/react** 8.0.9
- **@storybook/react-vite** 8.0.9
- **@storybook/addon-a11y** 8.0.10 - Accessibility auditing
- **@storybook/addon-essentials** 8.0.9
- **@storybook/addon-links** 8.0.9
- **baseline-browser-mapping** 2.9.5

**Code Generation:**

- **Plop** 4.0.1 - Component generator (`generators/component/`)

**Server & Execution:**

- **Express** 4.19.2 - Mock API server (`mock-server.ts`)
- **CORS** 2.8.5 - Cross-origin resource sharing
- **Pino HTTP** 10.1.0 - HTTP logger
- **Pino Pretty** 11.1.0 - Pretty-printed logging
- **PM2** 5.4.0 - Process manager

## Configuration Files

**TypeScript:**

- `tsconfig.json` - Compiler options with ESNext target, strict mode, path aliases (`@/*`)

**Vite:**

- `vite.config.ts` - Build configuration with React plugin, path aliases, test setup

**Tailwind CSS:**

- `tailwind.config.cjs` - Theme customization, animations, colors (HSL-based)

**PostCSS:**

- `postcss.config.cjs` - CSS processing pipeline

**Mock Server:**

- `mock-server.ts` - Express-based API mock server

**Vercel:**

- `vercel.json` - Deployment configuration with rewrites and headers

**Environment:**

- Environment variables validated via Zod in `src/config/env.ts`
- Requires: `VITE_APP_API_URL`, `VITE_APP_API_MEDIA_URL` (optional)
- Optional: `VITE_APP_API_AI_URL`, `VITE_APP_GOOGLE_CLIENT_ID`, `VITE_APP_JSONLINK_API_KEY`

## Platform Requirements

**Development:**

- Node.js v18 or higher
- pnpm package manager (recommended)
- Modern browser for development (Chrome/Firefox/Safari)

**Production:**

- **Hosting:** Vercel (SPA deployment with rewrites)
- **Browser Support:** Modern browsers with ES2020+ support

---

_Stack analysis: 2026-03-28_
