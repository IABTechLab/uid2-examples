# Client-Side Integration Example with Prebid.js

This example demonstrates how to integrate UID2/EUID with Prebid.js using client-side token generation, where Prebid.js handles the entire token workflow in the browser.

- UID2: [Running Site](https://prebid-client.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-prebid-client-side)
- EUID: [Running Site](https://prebid-client.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-prebid-client-side)

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
docker compose up prebid-client
```

Once running, access the application at: **http://localhost:3051**

To stop the service:

```bash
docker compose stop prebid-client
```

## Test the Example Application

| Step | Description | Comments |
|:----:|:------------|:---------|
| 1 | Navigate to `http://localhost:3051` in your browser. | The main page displays a login form for generating a UID2/EUID identity via Prebid.js. |
| 2 | Enter a test email address and click **Generate UID2** (or **Generate EUID**). | Prebid.js is configured with your CSTG credentials (subscription ID, server public key) and the email address. Prebid contacts the operator directly to generate the token. |
| 3 | Open the browser console (F12) and run `pbjs.getUserIds()`. | You should see an object containing either `uid2` or `euid` with the advertising token. This confirms Prebid has the token and will include it in bid requests. |
| 4 | Refresh the page and note the identity persists. | Prebid loads the token from localStorage on page load and automatically configures itself. The token is available immediately for bid requests. |
| 5 | Check localStorage for the token. | Open Developer Tools > Application > Local Storage and look for `__uid2_advertising_token` or `__euid_advertising_token`. |
| 6 | Click **Clear UID2** (or **Clear EUID**) to log out. | The token is removed from localStorage and the page reloads to clear Prebid's in-memory state. |

## Debugging

For debugging tips, see the [Prebid.js README](../README.md#debugging-tips).
