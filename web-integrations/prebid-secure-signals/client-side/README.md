# Client-Side Integration Example with Prebid.js and Google Secure Signals

This example demonstrates how to combine Prebid.js with Google Secure Signals for UID2/EUID, enabling both header bidding and encrypted identity signals to Google Ad Manager.

- UID2: [Running Site](https://prebid-secure-signals.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-google-ss)
- EUID: [Running Site](https://prebid-secure-signals.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-google-ss)

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for client-side token generation |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for client-side token generation |
| `UID_STORAGE_KEY` | localStorage key for token storage. Example: `__uid2_advertising_token` or `__euid_advertising_token` |
| `UID_SECURE_SIGNALS_SDK_URL` | URL to the Secure Signals SDK |
| `UID_SECURE_SIGNALS_STORAGE_KEY` | Storage key for Secure Signals. Example: `_GESPSK-uidapi.com` or `_GESPSK-euid.eu` |
| `IDENTITY_NAME` | Display name for the UI. Example: `UID2` or `EUID` |

## Build and Run Locally

From the repository root directory:

```bash
docker compose up prebid-secure-signals-client-side
```

Once running, access the application at: **http://localhost:3061**

To stop the service:

```bash
docker compose stop prebid-secure-signals-client-side
```

## Testing and Debugging

For testing instructions and debugging tips, see the [Prebid.js + Secure Signals README](../README.md).
