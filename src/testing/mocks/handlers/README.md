# Link Metadata Mock Handler

This mock handler intercepts requests to `https://jsonlink.io/api/extract` and returns mock data, solving the CORS issue during development.

## Features

- ✅ No CORS errors
- ✅ Works offline
- ✅ Instant responses (with simulated network delay)
- ✅ Pre-configured mock data for popular domains
- ✅ Generates generic mock data for any URL
- ✅ Error simulation for testing error states

## Pre-configured Domains

The following domains have custom mock metadata:

- `motion.dev`
- `github.com`
- `youtube.com`
- `stackoverflow.com`

Any other URL will get auto-generated mock metadata.

## Usage

The mock is automatically active when:

1. `VITE_APP_ENABLE_API_MOCKING=true` in your `.env` file
2. The app is running in development mode

## Testing Error States

To test error handling, use a URL containing `error-test`:

```typescript
<LinkPreview link="https://error-test.com" />
```

## How It Works

1. MSW (Mock Service Worker) intercepts the API call to `jsonlink.io`
2. Extracts the target URL from query parameters
3. Returns mock metadata based on the domain
4. Falls back to generic metadata for unknown domains

## Future: Moving to Real Backend

When the backend team implements the endpoint:

1. Update `src/lib/get-meta-data.ts` to call your backend API
2. Keep this mock for testing/offline development
3. Toggle with `ENABLE_API_MOCKING` environment variable
