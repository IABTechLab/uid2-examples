# Client-Side Integration Example with Google Secure Signals

This example demonstrates how to combine client-side UID2/EUID token generation with Google Secure Signals to share encrypted identity with Google Ad Manager.

- UID2: [Running Site](https://ss-client-side.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-google-ss)
- EUID: [Running Site](https://ss-client-side.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-google-ss)

For configuration details, see the [Google Secure Signals README](../README.md#how-it-works).

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for client-side token generation |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for client-side token generation |
| `UID_JS_SDK_URL` | URL to the JavaScript SDK |
| `UID_JS_SDK_NAME` | Global variable name for the SDK (`__uid2` or `__euid`) |
| `UID_SECURE_SIGNALS_SDK_URL` | URL to the Secure Signals SDK |
| `UID_SECURE_SIGNALS_STORAGE_KEY` | Storage key for Secure Signals (`_GESPSK-uidapi.com` or `_GESPSK-euid.eu`) |
| `IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `DOCS_BASE_URL` | Used for UI links to public documentation (`https://unifiedid.com/docs` or `https://euid.eu/docs`) |

## Build and Run Locally

> **Before running:** Follow the [main README](../../../README.md#running-locally) to set up your local operator and environment variables.

From the repository root directory:

```bash
docker compose up google-secure-signals-client-side
```

Once running, access the application at: **http://localhost:3042**

To stop the service:

```bash
docker compose stop google-secure-signals-client-side
```

## Test the Example Application

| Step | Description | Comments |
|:----:|:------------|:---------|
| 1 | Navigate to `http://localhost:3042` in your browser. | The main page displays a login form and a video player for testing ad requests with Secure Signals. |
| 2 | Enter a test email address and click **Generate UID2** (or **Generate EUID**). | The SDK's `setIdentityFromEmail()` function generates the token. The Secure Signals SDK then encrypts and stores the signal for Google. |
| 3 | Check localStorage for both tokens. | Open Developer Tools > Application > Local Storage. You should see the UID2/EUID token and the Secure Signals storage key (`_GESPSK-*`). |
| 4 | Click **Play** to trigger an ad request. | The IMA SDK makes an ad request to Google Ad Manager. The encrypted signal is automatically included in the request via Secure Signals. |
| 5 | Observe the video ad playback. | If configured correctly, the ad request includes the UID2/EUID signal, enabling targeted advertising. |
| 6 | Click **Clear UID2** (or **Clear EUID**) to log out. | The SDK's `disconnect()` function clears the identity, and `googletag.secureSignalProviders.clearAllCache()` clears the Secure Signals storage. |

## Debugging

For debugging tips, see the [Google Secure Signals README](../README.md#debugging-tips).
