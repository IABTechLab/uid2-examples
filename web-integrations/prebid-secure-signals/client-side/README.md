# Client-Side Integration Example with Prebid.js and Google Secure Signals

This example demonstrates how to combine Prebid.js with Google Secure Signals for UID2/EUID, enabling both header bidding and encrypted identity signals to Google Ad Manager.

- UID2: [Running Site](https://prebid-secure-signals.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-google-ss)
- EUID: [Running Site](https://prebid-secure-signals.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-google-ss)

For configuration details, see the [Prebid.js + Secure Signals README](../README.md#how-it-works).

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for client-side token generation |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for client-side token generation |
| `UID_STORAGE_KEY` | localStorage key for Prebid token storage (`__uid2_advertising_token` or `__euid_advertising_token`) |
| `UID_SECURE_SIGNALS_SDK_URL` | URL to the Secure Signals SDK |
| `UID_SECURE_SIGNALS_STORAGE_KEY` | Storage key for Secure Signals (`_GESPSK-uidapi.com` or `_GESPSK-euid.eu`) |
| `IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `DOCS_BASE_URL` | Used for UI links to public documentation (`https://unifiedid.com/docs` or `https://euid.eu/docs`) |

## Build and Run Locally

> **Before running:** Follow the [main README](../../../README.md#running-locally) to set up your local operator and environment variables.

From the repository root directory:

```bash
docker compose up prebid-secure-signals-client-side
```

Once running, access the application at: **http://localhost:3061**

To stop the service:

```bash
docker compose stop prebid-secure-signals-client-side
```

## Test the Example Application

| Step | Description | Comments |
|:----:|:------------|:---------|
| 1 | Navigate to `http://localhost:3061` in your browser. | The main page displays a login form and a video player for testing both Prebid.js header bidding and Secure Signals. |
| 2 | Enter a test email address and click **Generate UID2** (or **Generate EUID**). | Prebid.js generates the token using CSTG. The Secure Signals SDK also picks up the token and stores the encrypted signal. |
| 3 | Open the browser console (F12) and run `pbjs.getUserIds()`. | You should see an object containing either `uid2` or `euid` with the advertising token. This confirms Prebid has the token for bid requests. |
| 4 | Check localStorage for both Prebid and Secure Signals storage. | Look for both the Prebid token key (`__uid2_advertising_token` or `__euid_advertising_token`) and Secure Signals key (`_GESPSK-*`). |
| 5 | Click **Play** to trigger an ad request. | The IMA SDK makes an ad request to Google Ad Manager. Both Prebid.js bid requests and Google ad requests include the UID2/EUID identity. |
| 6 | Click **Clear UID2** (or **Clear EUID**) to log out. | Both the Prebid token and Secure Signals storage are cleared. The page reloads to reset all state. |

## Debugging

For debugging tips, see the [Prebid.js + Secure Signals README](../README.md#debugging-tips).
