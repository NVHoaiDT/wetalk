# Link Preview Mock API - Quick Start

## ✅ Setup Complete!

Your mock API for link previews is now ready! This solves the CORS issue you were experiencing with `jsonlink.io`.

## How It Works

1. **MSW (Mock Service Worker)** intercepts requests to `https://jsonlink.io/api/extract`
2. Returns mock metadata without making external API calls
3. No CORS errors, works offline, and instant responses!

## Testing It Out

### 1. Make sure your `.env` file has:

```bash
VITE_APP_ENABLE_API_MOCKING=true
```

### 2. Start your dev server:

```bash
npm run dev
# or
pnpm dev
```

### 3. Try creating a post with these URLs:

✨ **Pre-configured domains** (custom mock data):

- `https://motion.dev/`
- `https://github.com`
- `https://youtube.com`
- `https://stackoverflow.com`

🌐 **Any other URL** will get auto-generated mock data:

- `https://example.com`
- `https://your-favorite-site.com`

⚠️ **Test error handling**:

- `https://error-test.com` (triggers a 500 error)

## What Changed?

### Files Added:

- ✅ `src/testing/mocks/handlers/link-metadata.ts` - Mock handler for jsonlink.io API
- ✅ `src/testing/mocks/handlers/README.md` - Documentation

### Files Modified:

- ✅ `src/testing/mocks/handlers/index.ts` - Added link metadata handler to exports

## Mock Data Structure

Each URL returns metadata like this:

```typescript
{
  title: "Motion — JavaScript & React animation library",
  description: "Motion (prev Framer Motion) is a fast...",
  images: ["https://..."],
  sitename: "Motion",
  favicon: "https://...",
  duration: 480,
  domain: "motion.dev",
  url: "https://motion.dev/",
  source: "mock"  // ← Notice this indicates it's mocked
}
```

## Next Steps

### When Backend is Ready:

Simply update `src/lib/get-meta-data.ts`:

```typescript
export const getLinkMetadata = ({ url }: { url: string }) => {
  // Change to your backend endpoint
  return api.get(`/api/link-metadata`, {
    params: { url },
  });
};
```

The mock will still be there for:

- 🧪 Testing
- 💻 Offline development
- 🚀 Demo purposes

Just toggle with `VITE_APP_ENABLE_API_MOCKING=false`

## Troubleshooting

### Mock not working?

1. Check console for MSW logs: `[MSW] Mocking enabled`
2. Verify `.env` has `VITE_APP_ENABLE_API_MOCKING=true`
3. Restart dev server after changing `.env`

### Want different mock data?

Edit `src/testing/mocks/handlers/link-metadata.ts` and add your domains to the `mockMetadata` object!

---

**Happy coding!** 🎉 No more CORS issues!
