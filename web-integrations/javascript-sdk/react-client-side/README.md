# React Client-Side Integration Example using JavaScript SDK

This example demonstrates how to integrate the UID2/EUID JavaScript SDK into a React application for client-side token generation.

- UID2: [Running Site](https://js-react.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-javascript-client-side)
- EUID: [Running Site](https://js-react.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-javascript-client-side)

For configuration details, see the [JavaScript SDK README](../README.md#how-it-works).

## Build and Run Locally

> **Before running:** Follow the [main README](../../../README.md#running-locally) to set up your local operator and ensure the following environment variables are in the `.env` file in the repository root:

> **Note:** React requires environment variables to be prefixed with `REACT_APP_` to be accessible in the browser.

| Parameter | Description |
|:----------|:------------|
| `REACT_APP_UID_CLIENT_BASE_URL` | API base URL for client-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID). For local development: `http://localhost:8080` |
| `REACT_APP_UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for client-side token generation |
| `REACT_APP_UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for client-side token generation |
| `REACT_APP_UID_JS_SDK_URL` | URL to the JavaScript SDK |
| `REACT_APP_UID_JS_SDK_NAME` | Global variable name for the SDK (`__uid2` or `__euid`) |
| `REACT_APP_IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `REACT_APP_DOCS_BASE_URL` | Used for UI links to public documentation |

From the repository root directory:

```bash
docker compose up javascript-sdk-react-client-side
```

Once running, access the application at: **http://localhost:3034**

To stop the service:

```bash
docker compose stop javascript-sdk-react-client-side
```

## Test the Example Application

| Step | Description | Comments |
|:----:|:------------|:---------|
| 1 | Navigate to `http://localhost:3034` in your browser. | The React application displays a login form for generating a UID2/EUID identity. |
| 2 | Enter a test email address and click **Generate UID2** (or **Generate EUID**). | The React component calls the SDK's `setIdentityFromEmail()` function with your CSTG credentials. |
| 3 | The UI updates to show the identity information. | React state is updated via the SDK callback, displaying the advertising token and identity status. The SDK stores the identity in localStorage. |
| 4 | Refresh the page and note the identity persists. | The SDK loads the identity from localStorage. React components re-render based on the SDK's state. |
| 5 | Click **Clear UID2** (or **Clear EUID**) to log out. | The SDK's `disconnect()` function clears the identity and React state updates to show the login form again. |

## Debugging

For debugging tips, see the [JavaScript SDK README](../README.md#debugging-tips).
