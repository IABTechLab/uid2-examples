# React Client-Side Integration Example using JavaScript SDK

This example demonstrates how to integrate the UID2/EUID JavaScript SDK into a React application for client-side token generation.

- UID2: [Running Site](https://js-react.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-javascript-client-side)
- EUID: [Running Site](https://js-react.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-javascript-client-side)

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for client-side token generation |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for client-side token generation |
| `UID_JS_SDK_URL` | URL to the JavaScript SDK |
| `UID_JS_SDK_NAME` | Global variable name for the SDK. Example: `__uid2` or `__euid` |
| `IDENTITY_NAME` | Display name for the UI. Example: `UID2` or `EUID` |

## Build and Run Locally

From the repository root directory:

```bash
docker compose up javascript-sdk-react-client-side
```

Once running, access the application at: **http://localhost:3034**

To stop the service:

```bash
docker compose stop javascript-sdk-react-client-side
```

## Testing and Debugging

For testing instructions and debugging tips, see the [JavaScript SDK README](../README.md).
