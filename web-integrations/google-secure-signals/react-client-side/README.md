# React Client-Side Integration Example with Google Secure Signals

This example demonstrates how to integrate UID2/EUID with Google Secure Signals in a React application for client-side token generation.

- UID2: [Running Site](https://ss-react.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-google-ss)
- EUID: [Running Site](https://ss-react.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-google-ss)

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for client-side token generation |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for client-side token generation |
| `UID_JS_SDK_URL` | URL to the JavaScript SDK |
| `UID_JS_SDK_NAME` | Global variable name for the SDK. Example: `__uid2` or `__euid` |
| `UID_SECURE_SIGNALS_SDK_URL` | URL to the Secure Signals SDK |
| `UID_SECURE_SIGNALS_STORAGE_KEY` | Storage key for Secure Signals. Example: `_GESPSK-uidapi.com` or `_GESPSK-euid.eu` |
| `IDENTITY_NAME` | Display name for the UI. Example: `UID2` or `EUID` |

## Build and Run Locally

From the repository root directory:

```bash
docker compose up google-secure-signals-react-client-side
```

Once running, access the application at: **http://localhost:3044**

To stop the service:

```bash
docker compose stop google-secure-signals-react-client-side
```

## Testing and Debugging

For testing instructions and debugging tips, see the [Google Secure Signals README](../README.md).
