# Client-Side Integration Example using JavaScript SDK

This example demonstrates how a content publisher can use the UID2/EUID JavaScript SDK to generate tokens on the client side, with no server-side development required.

- UID2: [Running Site](https://js-client-side.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-javascript-client-side)
- EUID: [Running Site](https://js-client-side.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-javascript-client-side)

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for client-side token generation |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for client-side token generation |
| `UID_JS_SDK_URL` | URL to the JavaScript SDK. Example: `https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js` |
| `UID_JS_SDK_NAME` | Global variable name for the SDK (`__uid2` or `__euid`) |
| `IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `DOCS_BASE_URL` | Used for UI links to public documentation (`https://unifiedid.com/docs` or `https://euid.eu/docs`) |

## Build and Run Locally

From the repository root directory:

```bash
docker compose up javascript-sdk-client-side
```

Once running, access the application at: **http://localhost:3031**

To stop the service:

```bash
docker compose stop javascript-sdk-client-side
```

## Test the Example Application

| Step | Description | Comments |
|:----:|:------------|:---------|
| 1 | Navigate to `http://localhost:3031` in your browser. | The main page displays a login form for the user to generate a UID2/EUID identity. **Note:** A real-life application must also display a consent form for targeted advertising. |
| 2 | Enter a test email address and click **Generate UID2** (or **Generate EUID**). | The SDK's `setIdentityFromEmail()` function is called with your CSTG credentials. The SDK contacts the operator directly from the browser to generate the token. |
| 3 | A confirmation message appears with the identity information. | The identity includes the advertising token, refresh token, and expiration times. The SDK automatically stores this in localStorage. |
| 4 | Refresh the page and note the identity persists. | The SDK loads the identity from localStorage on initialization. It validates the token and handles automatic refresh in the background. |
| 5 | Keep the page open and observe the token state. | The SDK continuously validates the token and refreshes it before expiration. The callback function updates the UI with the current state. |
| 6 | Click **Clear UID2** (or **Clear EUID**) to log out. | The SDK's `disconnect()` function clears the identity from localStorage and memory, resetting the UI to the login state. |

## Debugging

For debugging tips, see the [JavaScript SDK README](../README.md#debugging-tips).
