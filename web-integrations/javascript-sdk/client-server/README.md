# Client-Server Integration Example using JavaScript SDK

This example demonstrates how a content publisher can generate UID2/EUID tokens on the server side while using the JavaScript SDK on the client to manage token refresh and state.

- UID2: [Running Site](https://js-client-server.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-javascript-client-server)
- EUID: [Running Site](https://js-client-server.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-javascript-client-server)

For configuration details, see the [JavaScript SDK README](../README.md#how-it-works).

## Build and Run Locally

> **Before running:** Follow the [main README](../../../README.md#running-locally) to set up your local operator and ensure the following environment variables are in the `.env` file in the repository root:

| Parameter | Description |
|:----------|:------------|
| `UID_SERVER_BASE_URL` | API base URL for server-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_API_KEY` | Your API key for server-side token generation |
| `UID_CLIENT_SECRET` | Your client secret for server-side token generation |
| `UID_JS_SDK_URL` | URL to the JavaScript SDK |
| `UID_JS_SDK_NAME` | Global variable name for the SDK (`__uid2` or `__euid`) |
| `IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `DOCS_BASE_URL` | Used for UI links to public documentation (`https://unifiedid.com/docs` or `https://euid.eu/docs`) |

From the repository root directory:

```bash
docker compose up javascript-sdk-client-server
```

Once running, access the application at: **http://localhost:3032**

To stop the service:

```bash
docker compose stop javascript-sdk-client-server
```

## Test the Example Application

| Step | Description | Comments |
|:----:|:------------|:---------|
| 1 | Navigate to `http://localhost:3032` in your browser. | The main page displays a login form for the user to generate a UID2/EUID identity. **Note:** A real-life application must also display a consent form for targeted advertising. |
| 2 | Enter a test email address and click **Generate UID2** (or **Generate EUID**). | This calls the `/login` endpoint on the server (`server.js`), which sends an encrypted request to the `POST /token/generate` endpoint using your API key and client secret. |
| 3 | A confirmation message appears with the identity information. | The server decrypts the response and returns the identity to the client. The identity is then passed to the SDK's `init()` function, which stores it in localStorage. |
| 4 | Refresh the page and note the identity persists. | The SDK automatically loads the identity from localStorage and validates it. The SDK handles automatic token refresh in the background using the refresh token. |
| 5 | Keep the page open and observe the token state. | The SDK continuously validates the token and refreshes it before expiration. The callback function updates the UI with the current state. |
| 6 | Click **Clear UID2** (or **Clear EUID**) to log out. | The SDK's `disconnect()` function clears the identity from localStorage and memory, resetting the UI to the login state. |

## Debugging

For debugging tips, see the [JavaScript SDK README](../README.md#debugging-tips).
