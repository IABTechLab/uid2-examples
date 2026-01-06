# Client-Server Integration Example with Google Secure Signals

This example demonstrates how to combine server-side UID2/EUID token generation with Google Secure Signals for sharing encrypted identity with Google Ad Manager.

- UID2: [Running Site](https://ss-client-server.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-google-ss)
- EUID: [Running Site](https://ss-client-server.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-google-ss)

For configuration details, see the [Google Secure Signals README](../README.md#how-it-works).

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_SERVER_BASE_URL` | API base URL for server-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_API_KEY` | Your API key for server-side token generation |
| `UID_CLIENT_SECRET` | Your client secret for server-side token generation |
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
docker compose up google-secure-signals-client-server
```

Once running, access the application at: **http://localhost:3041**

To stop the service:

```bash
docker compose stop google-secure-signals-client-server
```

## Test the Example Application

| Step | Description | Comments |
|:----:|:------------|:---------|
| 1 | Navigate to `http://localhost:3041` in your browser. | The main page displays a login form and a video player for testing ad requests with Secure Signals. |
| 2 | Enter a test email address and click **Generate UID2** (or **Generate EUID**). | This calls the `/login` endpoint on the server, which generates the token using `POST /token/generate`. The identity is passed to the SDK on the client. |
| 3 | The SDK initializes with the server-generated token. | The SDK's `init()` function receives the identity. The Secure Signals SDK then encrypts and stores the signal for Google. |
| 4 | Check localStorage for both tokens. | Open Developer Tools > Application > Local Storage. You should see the UID2/EUID token and the Secure Signals storage key (`_GESPSK-*`). |
| 5 | Click **Play** to trigger an ad request. | The IMA SDK makes an ad request to Google Ad Manager with the encrypted signal automatically included. |
| 6 | Click **Clear UID2** (or **Clear EUID**) to log out. | The SDK's `disconnect()` function clears the identity and Secure Signals storage. |

## Debugging

For debugging tips, see the [Google Secure Signals README](../README.md#debugging-tips).
