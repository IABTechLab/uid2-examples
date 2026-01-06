# Client-Server Integration Example using JavaScript SDK

This example demonstrates how a content publisher can generate UID2/EUID tokens on the server side while using the JavaScript SDK on the client to manage token refresh and state.

- UID2: [Running Site](https://js-client-server.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-javascript-client-server)
- EUID: [Running Site](https://js-client-server.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-javascript-client-server)

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_SERVER_BASE_URL` | API base URL for server-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_API_KEY` | Your API key for server-side token generation |
| `UID_CLIENT_SECRET` | Your client secret for server-side token generation |
| `UID_JS_SDK_URL` | URL to the JavaScript SDK |
| `UID_JS_SDK_NAME` | Global variable name for the SDK. Example: `__uid2` or `__euid` |
| `IDENTITY_NAME` | Display name for the UI. Example: `UID2` or `EUID` |

## Build and Run Locally

From the repository root directory:

```bash
docker compose up javascript-sdk-client-server
```

Once running, access the application at: **http://localhost:3032**

To stop the service:

```bash
docker compose stop javascript-sdk-client-server
```

## Testing and Debugging

For testing instructions and debugging tips, see the [JavaScript SDK README](../README.md).
