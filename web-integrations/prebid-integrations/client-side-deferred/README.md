# Deferred Client-Side Integration Example with Prebid.js

This example demonstrates how to add the UID2/EUID module to an existing Prebid.js configuration after page load using `mergeConfig()` and `refreshUserIds()`.

- UID2: [Running Site](https://prebid-deferred.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-prebid-client-side)
- EUID: [Running Site](https://prebid-deferred.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-prebid-client-side)

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for client-side token generation |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for client-side token generation |
| `UID_STORAGE_KEY` | localStorage key for token storage. Example: `__uid2_advertising_token` or `__euid_advertising_token` |
| `IDENTITY_NAME` | Display name for the UI. Example: `UID2` or `EUID` |

## Build and Run Locally

From the repository root directory:

```bash
docker compose up prebid-client-side-deferred
```

Once running, access the application at: **http://localhost:3053**

To stop the service:

```bash
docker compose stop prebid-client-side-deferred
```

## How It Works

This example uses two Prebid.js functions to add UID2/EUID after page load:

1. **`pbjs.mergeConfig()`** - Merges the UID2/EUID module configuration into the existing Prebid config without overwriting other settings
2. **`pbjs.refreshUserIds()`** - Triggers Prebid to generate the token using the newly merged configuration

## Testing and Debugging

For testing instructions and debugging tips, see the [Prebid.js README](../README.md).
