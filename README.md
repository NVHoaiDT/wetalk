# React Vite Application

## Get Started

Prerequisites:

- Node 20+
- Yarn 1.22+

To set up the app execute the following commands.

```bash
git clone https://github.com/NVHoaiDT/we-talk
cd we-talk
cp .env.example .env
pnpm install
```

##### `pnpm dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

##### `pnpm build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

See the section about [deployment](https://vitejs.dev/guide/static-deploy) for more information.

## Contributing

Contributions are always welcome! If you have any ideas, suggestions, fixes, feel free to contribute. You can do that by going through the following steps:

1. Clone this repo
2. Create a branch: `git checkout -b your-feature`
3. Execute the `yarn prepare` script.
4. Make some changes
5. Test your changes
6. Push your branch and open a Pull Request

View `docs` folder for more information about project structure and coding principles.

## Project Structure

```
wetalk-client
├─ .eslintrc.cjs
├─ .husky
│  └─ _
│     ├─ applypatch-msg
│     ├─ commit-msg
│     ├─ h
│     ├─ husky.sh
│     ├─ post-applypatch
│     ├─ post-checkout
│     ├─ post-commit
│     ├─ post-merge
│     ├─ post-rewrite
│     ├─ pre-applypatch
│     ├─ pre-auto-gc
│     ├─ pre-commit
│     ├─ pre-merge-commit
│     ├─ pre-push
│     ├─ pre-rebase
│     └─ prepare-commit-msg
├─ .prettierignore
├─ .prettierrc
├─ .storybook
│  ├─ main.ts
│  └─ preview.tsx
├─ docs
│  ├─ additional-resources.md
│  ├─ api-layer.md
│  ├─ application-overview.md
│  ├─ assets
│  │  └─ unidirectional-codebase.png
│  ├─ components-and-styling.md
│  ├─ deployment.md
│  ├─ error-handling.md
│  ├─ performance.md
│  ├─ project-standards.md
│  ├─ project-structure.md
│  ├─ security.md
│  ├─ state-management.md
│  └─ testing.md
├─ e2e
│  ├─ .eslintrc.cjs
│  └─ tests
│     ├─ auth.setup.ts
│     ├─ profile.spec.ts
│     └─ smoke.spec.ts
├─ generators
│  └─ component
│     ├─ component.stories.tsx.hbs
│     ├─ component.tsx.hbs
│     ├─ index.cjs
│     └─ index.ts.hbs
├─ index.html
├─ mock-server.ts
├─ package.json
├─ playwright.config.ts
├─ plopfile.cjs
├─ pnpm-lock.yaml
├─ postcss.config.cjs
├─ public
│  ├─ favicon.ico
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ mockServiceWorker.js
│  ├─ robots.txt
│  └─ _redirects
├─ README.md
├─ src
│  ├─ app
│  │  ├─ index.tsx
│  │  ├─ provider.tsx
│  │  ├─ router.tsx
│  │  └─ routes
│  │     ├─ app
│  │     │  ├─ dashboard.tsx
│  │     │  ├─ discussions
│  │     │  │  ├─ discussion.tsx
│  │     │  │  ├─ discussions.tsx
│  │     │  │  └─ __tests__
│  │     │  │     ├─ discussion.test.tsx
│  │     │  │     └─ discussions.test.tsx
│  │     │  ├─ profile.tsx
│  │     │  ├─ root.tsx
│  │     │  └─ users.tsx
│  │     ├─ auth
│  │     │  ├─ login.tsx
│  │     │  ├─ notify.tsx
│  │     │  ├─ register.tsx
│  │     │  └─ verify.tsx
│  │     ├─ landing.tsx
│  │     └─ not-found.tsx
│  ├─ assets
│  │  └─ logo.svg
│  ├─ components
│  │  ├─ errors
│  │  │  └─ main.tsx
│  │  ├─ layouts
│  │  │  ├─ auth-layout.tsx
│  │  │  ├─ content-layout.tsx
│  │  │  ├─ dashboard-layout.tsx
│  │  │  └─ index.ts
│  │  ├─ seo
│  │  │  ├─ head.tsx
│  │  │  ├─ index.ts
│  │  │  └─ __tests__
│  │  │     └─ head.test.tsx
│  │  └─ ui
│  │     ├─ button
│  │     │  ├─ button.stories.tsx
│  │     │  ├─ button.tsx
│  │     │  └─ index.ts
│  │     ├─ dialog
│  │     │  ├─ confirmation-dialog
│  │     │  │  ├─ confirmation-dialog.stories.tsx
│  │     │  │  ├─ confirmation-dialog.tsx
│  │     │  │  ├─ index.ts
│  │     │  │  └─ __tests__
│  │     │  │     └─ confirmation-dialog.test.tsx
│  │     │  ├─ dialog.stories.tsx
│  │     │  ├─ dialog.tsx
│  │     │  ├─ index.ts
│  │     │  └─ __tests__
│  │     │     └─ dialog.test.tsx
│  │     ├─ drawer
│  │     │  ├─ drawer.stories.tsx
│  │     │  ├─ drawer.tsx
│  │     │  ├─ index.ts
│  │     │  └─ __tests__
│  │     │     └─ drawer.test.tsx
│  │     ├─ dropdown
│  │     │  ├─ dropdown.stories.tsx
│  │     │  ├─ dropdown.tsx
│  │     │  └─ index.ts
│  │     ├─ form
│  │     │  ├─ error.tsx
│  │     │  ├─ field-wrapper.tsx
│  │     │  ├─ form-drawer.tsx
│  │     │  ├─ form.stories.tsx
│  │     │  ├─ form.tsx
│  │     │  ├─ index.ts
│  │     │  ├─ input.tsx
│  │     │  ├─ label.tsx
│  │     │  ├─ select.tsx
│  │     │  ├─ switch.tsx
│  │     │  ├─ textarea.tsx
│  │     │  └─ __tests__
│  │     │     └─ form.test.tsx
│  │     ├─ link
│  │     │  ├─ index.ts
│  │     │  ├─ link.stories.tsx
│  │     │  └─ link.tsx
│  │     ├─ md-preview
│  │     │  ├─ index.ts
│  │     │  ├─ md-preview.stories.tsx
│  │     │  └─ md-preview.tsx
│  │     ├─ notifications
│  │     │  ├─ index.ts
│  │     │  ├─ notification.stories.tsx
│  │     │  ├─ notification.tsx
│  │     │  ├─ notifications-store.ts
│  │     │  ├─ notifications.tsx
│  │     │  └─ __tests__
│  │     │     └─ notifications.test.ts
│  │     ├─ spinner
│  │     │  ├─ index.ts
│  │     │  ├─ spinner.stories.tsx
│  │     │  └─ spinner.tsx
│  │     └─ table
│  │        ├─ index.ts
│  │        ├─ pagination.tsx
│  │        ├─ table.stories.tsx
│  │        └─ table.tsx
│  ├─ config
│  │  ├─ env.ts
│  │  └─ paths.ts
│  ├─ features
│  │  ├─ auth
│  │  │  └─ components
│  │  │     ├─ login-form.tsx
│  │  │     ├─ register-form.tsx
│  │  │     └─ __tests__
│  │  │        ├─ login-form.test.tsx
│  │  │        └─ register-form.test.tsx
│  │  ├─ comments
│  │  │  ├─ api
│  │  │  │  ├─ create-comment.ts
│  │  │  │  ├─ delete-comment.ts
│  │  │  │  └─ get-comments.ts
│  │  │  └─ components
│  │  │     ├─ comments-list.tsx
│  │  │     ├─ comments.tsx
│  │  │     ├─ create-comment.tsx
│  │  │     └─ delete-comment.tsx
│  │  ├─ discussions
│  │  │  ├─ api
│  │  │  │  ├─ create-discussion.ts
│  │  │  │  ├─ delete-discussion.ts
│  │  │  │  ├─ get-discussion.ts
│  │  │  │  ├─ get-discussions.ts
│  │  │  │  └─ update-discussion.ts
│  │  │  └─ components
│  │  │     ├─ create-discussion.tsx
│  │  │     ├─ delete-discussion.tsx
│  │  │     ├─ discussion-view.tsx
│  │  │     ├─ discussions-list.tsx
│  │  │     └─ update-discussion.tsx
│  │  ├─ teams
│  │  │  └─ api
│  │  │     └─ get-teams.ts
│  │  └─ users
│  │     ├─ api
│  │     │  ├─ delete-user.ts
│  │     │  ├─ get-users.ts
│  │     │  └─ update-profile.ts
│  │     └─ components
│  │        ├─ delete-user.tsx
│  │        ├─ update-profile.tsx
│  │        └─ users-list.tsx
│  ├─ hooks
│  │  ├─ use-disclosure.ts
│  │  └─ __tests__
│  │     └─ use-disclosure.test.ts
│  ├─ index.css
│  ├─ lib
│  │  ├─ api-client.ts
│  │  ├─ auth.tsx
│  │  ├─ authorization.tsx
│  │  ├─ react-query.ts
│  │  └─ __tests__
│  │     └─ authorization.test.tsx
│  ├─ main.tsx
│  ├─ testing
│  │  ├─ data-generators.ts
│  │  ├─ mocks
│  │  │  ├─ browser.ts
│  │  │  ├─ db.ts
│  │  │  ├─ handlers
│  │  │  │  ├─ auth.ts
│  │  │  │  ├─ comments.ts
│  │  │  │  ├─ discussions.ts
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ teams.ts
│  │  │  │  └─ users.ts
│  │  │  ├─ index.ts
│  │  │  ├─ server.ts
│  │  │  └─ utils.ts
│  │  ├─ setup-tests.ts
│  │  └─ test-utils.tsx
│  ├─ types
│  │  └─ api.ts
│  ├─ utils
│  │  ├─ cn.ts
│  │  └─ format.ts
│  └─ vite-env.d.ts
├─ tailwind.config.cjs
├─ tsconfig.json
├─ vite-env.d.ts
├─ vite.config.ts
└─ __mocks__
   ├─ vitest-env.d.ts
   └─ zustand.ts

```
