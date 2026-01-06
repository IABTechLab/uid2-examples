# React Client-Side Integration Example with Google Secure Signals

This example demonstrates how to integrate UID2/EUID with Google Secure Signals in a React application for client-side token generation.

- UID2: [Running Site](https://ss-react.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-google-ss)
- EUID: [Running Site](https://ss-react.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-google-ss)

For configuration details, see the [Google Secure Signals README](../README.md#how-it-works).

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
| `REACT_APP_UID_SECURE_SIGNALS_SDK_URL` | URL to the Secure Signals SDK |
| `REACT_APP_UID_SECURE_SIGNALS_STORAGE_KEY` | Storage key for Secure Signals (`_GESPSK-uidapi.com` or `_GESPSK-euid.eu`) |
| `REACT_APP_IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `REACT_APP_DOCS_BASE_URL` | Used for UI links to public documentation |

From the repository root directory:

```bash
docker compose up google-secure-signals-react-client-side
```

Once running, access the application at: **http://localhost:3044**

To stop the service:

```bash
docker compose stop google-secure-signals-react-client-side
```

## Test the Example Application

| Step | Description | Comments |
|:----:|:------------|:---------|
| 1 | Navigate to `http://localhost:3044` in your browser. | The React application displays a login form and a video player for testing ad requests with Secure Signals. |
| 2 | Enter a test email address and click **Generate UID2** (or **Generate EUID**). | The React component calls the SDK's `setIdentityFromEmail()` function. The Secure Signals SDK then stores the encrypted signal. |
| 3 | The UI updates to show the identity information. | React state updates via the SDK callback, displaying the advertising token and Secure Signals status. |
| 4 | Check localStorage for both tokens. | Open Developer Tools > Application > Local Storage. You should see the UID2/EUID token and the Secure Signals storage key (`_GESPSK-*`). |
| 5 | Click **Play** to trigger an ad request. | The IMA SDK makes an ad request to Google Ad Manager with the encrypted signal automatically included. |
| 6 | Click **Clear UID2** (or **Clear EUID**) to log out. | The SDK's `disconnect()` function clears the identity and Secure Signals storage. React state updates to show the login form. |

## Debugging

For debugging tips, see the [Google Secure Signals README](../README.md#debugging-tips).
