# Deferred Client-Side Integration Example with Prebid.js

This example demonstrates how to add the UID2/EUID module to an existing Prebid.js configuration after page load using `mergeConfig()` and `refreshUserIds()`.

- UID2: [Running Site](https://prebid-deferred.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-prebid-client-side)
- EUID: [Running Site](https://prebid-deferred.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-prebid-client-side)

For configuration details, see the [Prebid.js README](../README.md#how-it-works).

## Build and Run Locally

> **Before running:** Follow the [main README](../../../README.md#running-locally) to set up your local operator and ensure the following environment variables are in the `.env` file in the repository root:

| Parameter | Description |
|:----------|:------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for client-side token generation |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for client-side token generation |
| `UID_STORAGE_KEY` | localStorage key for token storage (`__uid2_advertising_token` or `__euid_advertising_token`) |
| `IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `DOCS_BASE_URL` | Used for UI links to public documentation (`https://unifiedid.com/docs` or `https://euid.eu/docs`) |

From the repository root directory:

```bash
docker compose up prebid-client-side-deferred
```

Once running, access the application at: **http://localhost:3053**

To stop the service:

```bash
docker compose stop prebid-client-side-deferred
```

## Test the Example Application

| Step | Description | Comments |
|:----:|:------------|:---------|
| 1 | Navigate to `http://localhost:3053` in your browser. | The page loads with Prebid.js configured but **without** UID2/EUID initially. This simulates a publisher who wants to add UID2/EUID later. |
| 2 | Open the browser console (F12) and run `pbjs.getUserIds()`. | Initially returns an empty object or no `uid2`/`euid` property, since the module hasn't been configured yet. |
| 3 | Enter a test email address and click **Generate UID2** (or **Generate EUID**). | This triggers `pbjs.mergeConfig()` to add the UID2/EUID module config, then `pbjs.refreshUserIds()` to generate the token. |
| 4 | Run `pbjs.getUserIds()` again in the console. | Now you should see the `uid2` or `euid` property with the advertising token. The module was added dynamically. |
| 5 | Refresh the page and note the identity persists. | Even though the page starts without UID2/EUID configured, it checks localStorage on load and configures Prebid if a token exists. |
| 6 | Click **Clear UID2** (or **Clear EUID**) to log out. | The token is removed from localStorage and the page reloads to clear Prebid's in-memory state. |

## How It Works

This example uses two Prebid.js functions to add UID2/EUID after page load:

1. **`pbjs.mergeConfig()`** - Merges the UID2/EUID module configuration into the existing Prebid config without overwriting other settings
2. **`pbjs.refreshUserIds()`** - Triggers Prebid to generate the token using the newly merged configuration

## Debugging

For debugging tips, see the [Prebid.js README](../README.md#debugging-tips).
