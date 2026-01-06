# Server-Side Integration Example with Google Secure Signals

This example demonstrates a full server-side UID2/EUID implementation combined with Google Secure Signals for sharing encrypted identity with Google Ad Manager.

- UID2: [Running Site](https://ss-server-side.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-google-ss)
- EUID: [Running Site](https://ss-server-side.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-google-ss)

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_SERVER_BASE_URL` | API base URL for server-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_API_KEY` | Your API key for server-side token generation |
| `UID_CLIENT_SECRET` | Your client secret for server-side token generation |
| `UID_SECURE_SIGNALS_SDK_URL` | URL to the Secure Signals SDK |
| `UID_SECURE_SIGNALS_STORAGE_KEY` | Storage key for Secure Signals (`_GESPSK-uidapi.com` or `_GESPSK-euid.eu`) |
| `IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `DOCS_BASE_URL` | Documentation base URL |

## Build and Run Locally

From the repository root directory:

```bash
docker compose up google-secure-signals-server-side
```

Once running, access the application at: **http://localhost:3043**

To stop the service:

```bash
docker compose stop google-secure-signals-server-side
```

## Test the Example Application

| Step | Description | Comments |
|:----:|:------------|:---------|
| 1 | Navigate to `http://localhost:3043` in your browser. | The main page displays a login form and a video player for testing ad requests with Secure Signals. |
| 2 | Enter a test email address and click **Generate UID2** (or **Generate EUID**). | This calls the `/login` endpoint on the server, which generates the token and stores it in a server-side session. |
| 3 | The page reloads with the identity embedded. | The server renders the advertising token directly into the page. The Secure Signals SDK picks up the token and stores the encrypted signal. |
| 4 | Check localStorage for the Secure Signals storage. | Open Developer Tools > Application > Local Storage and look for `_GESPSK-uidapi.com` (UID2) or `_GESPSK-euid.eu` (EUID). |
| 5 | Click **Play** to trigger an ad request. | The IMA SDK makes an ad request to Google Ad Manager with the encrypted signal automatically included. |
| 6 | Click **Clear UID2** (or **Clear EUID**) to log out. | The server clears the session and Secure Signals storage is cleared. |

## Debugging

For debugging tips, see the [Google Secure Signals README](../README.md#debugging-tips).
