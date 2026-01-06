# Deferred UID2/EUID Integration with Prebid.js (using mergeConfig)

This example demonstrates how to integrate UID2 or EUID with Prebid.js using **deferred configuration**. Unlike the standard integration where UID2/EUID is configured on page load, this pattern uses `mergeConfig()` and `refreshUserIds()` to add the identity module *after* the page has already loaded.

## Use Cases

This pattern is useful for:

- **Async Login**: User logs in after the page has loaded
- **Delayed Consent**: Consent is given asynchronously (e.g., via a consent management platform)
- **Single Page Applications (SPAs)**: Dynamic login/logout without full page reloads
- **Lazy Loading**: Only load UID2/EUID when actually needed
- **User State Changes**: Handle logout and re-login scenarios

## How It Works

### Standard Flow (for comparison)
```javascript
// Page load: UID2 configured immediately
pbjs.setConfig({
  userSync: {
    userIds: [{ name: 'uid2', params: {...} }]
  }
});
```

### Deferred Flow (this example)
```javascript
// Step 1: Page load - Prebid configured WITHOUT UID2
pbjs.setConfig({
  userSync: {
    syncDelay: 5000,
    auctionDelay: 1000,
    // Note: NO userIds configured here!
  }
});

// Step 2: Later (after login, consent, etc.) - Add UID2 via mergeConfig
pbjs.mergeConfig({
  userSync: {
    userIds: [{
      name: 'uid2',
      params: {
        uid2ApiBase: 'https://operator-integ.uidapi.com',
        email: 'user@example.com',
        subscriptionId: 'your-subscription-id',
        serverPublicKey: 'your-server-public-key'
      }
    }]
  }
});

// Step 3: Trigger user ID refresh to generate the token
await pbjs.refreshUserIds();
```

## Key Prebid.js APIs

| API | Purpose |
|-----|---------|
| `pbjs.setConfig()` | Initial configuration (without UID2) |
| `pbjs.mergeConfig()` | Add/update configuration without replacing existing config |
| `pbjs.refreshUserIds()` | Trigger user ID module to fetch/generate new IDs |
| `pbjs.getUserIds()` | Get current user IDs (check if token was generated) |

## Running Locally

### Using Docker Compose (recommended)

From the repository root:

```bash
docker compose up prebid-client-side-deferred
```

Access at: http://localhost:3053

### Using the Reverse Proxy

```bash
docker compose up
```

Access at: http://prebid-deferred.sample-dev.com (requires hosts file configuration)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls | `https://operator-integ.uidapi.com` |
| `UID_CSTG_SUBSCRIPTION_ID` | Your CSTG subscription ID | Test value provided |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your CSTG server public key | Test value provided |
| `UID_STORAGE_KEY` | localStorage key for token storage | `__uid2_advertising_token` |
| `IDENTITY_NAME` | Display name (UID2 or EUID) | `UID2` |
| `DOCS_BASE_URL` | Base URL for documentation links | `https://unifiedid.com/docs` |

## Testing Flow

1. **Page loads** - Observe that Prebid is loaded but UID2 shows "Not yet configured (deferred)"
2. **Enter email** - Type an email address in the input field
3. **Click "Configure UID2 with mergeConfig()"** - This triggers:
   - `pbjs.mergeConfig()` to add UID2 configuration
   - `pbjs.refreshUserIds()` to generate the token
4. **Observe results** - Token appears in the status tables
5. **Test opt-out** - Use `test@example.com` to see opt-out behavior

## Clearing UID2 Identity (Logout)

UID2 state lives in two places:
- **Browser storage** (localStorage) - where the token is persisted
- **Prebid's in-memory cache** - where Prebid holds the token during the session

To fully clear UID2 and prevent future bid requests from using the token:

```javascript
// Step 1: Clear UID2 from browser storage
localStorage.removeItem('__uid2_advertising_token');

// Step 2: Page reload clears Prebid's in-memory cache
location.reload();
```

### Why Page Reload?

Prebid's UID2 module doesn't expose a method to clear just UID2 without affecting other user ID modules. The `mergeConfig()` API is additive—once UID2 is added to `userSync.userIds`, there's no built-in way to remove only that configuration. Page reload ensures Prebid reinitializes fresh with an empty localStorage.

### Alternative: Using the UID2 JavaScript SDK

If you're using the [UID2 JavaScript SDK](https://unifiedid.com/docs/sdks/sdk-ref-javascript) directly (not just Prebid's module), you can use:

```javascript
__uid2.disconnect();
```

This automatically clears both storage and in-memory state without page reload. However, this method is **not available** when using Prebid's UID2 module alone—Prebid uses an internal implementation that doesn't expose the full SDK globally.

## Documentation

- [UID2 Client-Side Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-side)
- [EUID Client-Side Integration Guide for Prebid.js](https://euid.eu/docs/guides/integration-prebid-client-side)
- [Prebid.js User ID Module](https://docs.prebid.org/dev-docs/modules/userId.html)
- [Prebid.js mergeConfig](https://docs.prebid.org/dev-docs/publisher-api-reference/mergeConfig.html)

## Related Examples

- [client-side](../client-side/) - Standard Prebid + UID2 (configured on page load)
- [client-server](../client-server/) - Server-side token generation with Prebid

