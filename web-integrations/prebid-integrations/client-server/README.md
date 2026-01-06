# Client-Server Integration Example with Prebid.js

This example demonstrates how to generate UID2/EUID tokens on the server side while using Prebid.js on the client to manage the token lifecycle.

- UID2: [Running Site](https://prebid-client-server.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-prebid-client-server)
- EUID: [Running Site](https://prebid-client-server.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-prebid-client-server)

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_SERVER_BASE_URL` | API base URL for server-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_API_KEY` | Your API key for server-side token generation |
| `UID_CLIENT_SECRET` | Your client secret for server-side token generation |
| `UID_STORAGE_KEY` | localStorage key for token storage (`__uid2_advertising_token` or `__euid_advertising_token`) |
| `IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `DOCS_BASE_URL` | Documentation base URL |

## Build and Run Locally

From the repository root directory:

```bash
docker compose up prebid-client-server
```

Once running, access the application at: **http://localhost:3052**

To stop the service:

```bash
docker compose stop prebid-client-server
```

## Test the Example Application

| Step | Description | Comments |
|:----:|:------------|:---------|
| 1 | Navigate to `http://localhost:3052` in your browser. | The main page displays a login form for generating a UID2/EUID identity. |
| 2 | Enter a test email address and click **Generate UID2** (or **Generate EUID**). | This calls the `/login` endpoint on the server, which sends an encrypted request to `POST /token/generate` using your API key and client secret. |
| 3 | The server returns the identity and it's stored in localStorage. | The identity is stored under the key specified by `UID_STORAGE_KEY`. Prebid.js is configured to read from this key. |
| 4 | Open the browser console (F12) and run `pbjs.getUserIds()`. | You should see an object containing either `uid2` or `euid` with the advertising token. Prebid loaded the token from localStorage. |
| 5 | Refresh the page and note the identity persists. | Prebid loads the token from localStorage on page load. Prebid handles automatic token refresh using the refresh token. |
| 6 | Click **Clear UID2** (or **Clear EUID**) to log out. | The token is removed from localStorage and the page reloads to clear Prebid's in-memory state. |

## Debugging

For debugging tips, see the [Prebid.js README](../README.md#debugging-tips).
