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
| `UID_JS_SDK_NAME` | Global variable name for the SDK. Example: `__uid2` (UID2) or `__euid` (EUID) |
| `IDENTITY_NAME` | Display name for the UI. Example: `UID2` or `EUID` |

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

## Testing and Debugging

For testing instructions and debugging tips, see the [JavaScript SDK README](../README.md).
