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

## Project Structure (Simplified)

```
wetalk-client
├─ .eslintrc.cjs
├─ .husky
├─ .prettierignore
├─ .prettierrc
├─ .storybook
├─ docs
├─ e2e
│  ├─ .eslintrc.cjs
│  └─ tests
├─ generators
│  └─ component
├─ index.html
├─ mock-server.ts
├─ package.json
├─ playwright.config.ts
├─ plopfile.cjs
├─ pnpm-lock.yaml
├─ postcss.config.cjs
├─ public
├─ README.md
├─ src
│  ├─ app
│  │  ├─ index.tsx
│  │  ├─ provider.tsx
│  │  ├─ router.tsx
│  │  └─ routes
│  │     ├─ app
│  │     │  ├─ communites
│  │     │  │  ├─ communites.tsx
│  │     │  │  └─ community.tsx
│  │     │  ├─ dashboard.tsx
│  │     │  ├─ posts
│  │     │  │  └─ post.tsx
│  │     │  ├─ profile.tsx
│  │     │  ├─ root.tsx
│  │     │  ├─ search
│  │     │  │  └─ search.tsx
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
│  │  └─ ui
│  │     ├─ button
│  │     ├─ card
│  │     ├─ dialog
│  │     ├─ drawer
│  │     ├─ dropdown
│  │     ├─ form
│  │     ├─ grid
│  │     ├─ link
│  │     ├─ md-preview
│  │     ├─ media-uploader
│  │     ├─ media-viewer
│  │     ├─ notifications
│  │     ├─ search
│  │     ├─ select
│  │     ├─ spinner
│  │     ├─ table
│  │     └─ text-editor
│  ├─ config
│  │  ├─ env.ts
│  │  └─ paths.ts
│  ├─ features
│  │  ├─ auth
│  │  │  └─ components
│  │  │     ├─ login-form.tsx
│  │  │     └─ register-form.tsx
│  │  ├─ communities
│  │  │  ├─ api
│  │  │  │  ├─ create-community.ts
│  │  │  │  ├─ delete-community.ts
│  │  │  │  ├─ get-communities.ts
│  │  │  │  ├─ get-community.ts
│  │  │  │  ├─ join-community.ts
│  │  │  │  └─ update-community.ts
│  │  │  └─ components
│  │  │     ├─ communities-list.tsx
│  │  │     ├─ community-view.tsx
│  │  │     ├─ create-community.tsx
│  │  │     ├─ delete-community.tsx
│  │  │     ├─ join-community.tsx
│  │  │     └─ update-community.tsx
│  │  ├─ messages
│  │  │  ├─ api
│  │  │  ├─ components
│  │  │  └─ stores
│  │  ├─ post-comments
│  │  │  ├─ api
│  │  │  │  ├─ create-post-comment.ts
│  │  │  │  ├─ delete-post-comment.ts
│  │  │  │  ├─ edit-post-comment.ts
│  │  │  │  ├─ get-post-comments.ts
│  │  │  │  └─ vote-post-comment.ts
│  │  │  └─ components
│  │  │     ├─ create-post-comment.tsx
│  │  │     ├─ delete-post-comment.tsx
│  │  │     ├─ downvote-post-comment.tsx
│  │  │     ├─ edit-post-comment.tsx
│  │  │     ├─ post-comments-list.tsx
│  │  │     └─ upvote-post-comment.tsx
│  │  ├─ posts
│  │  │  ├─ api
│  │  │  └─ components
│  │  ├─ search
│  │  │  ├─ api
│  │  │  │  ├─ get-search-communites.ts
│  │  │  │  └─ get-search-posts.ts
│  │  │  └─ components
│  │  │     ├─ search-communities-list.tsx
│  │  │     ├─ search-filters.tsx
│  │  │     ├─ search-posts-list.tsx
│  │  │     └─ search.tsx
│  ├─ helper
│  │  └─ fancy-log.ts
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
│  │  ├─ upload.ts
│  ├─ main.tsx
│  ├─ testing
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
