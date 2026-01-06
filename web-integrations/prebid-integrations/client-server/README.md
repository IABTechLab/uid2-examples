# Client-Server Integration Example with Prebid.js

This example demonstrates how to generate UID2/EUID tokens on the server side while using Prebid.js on the client to manage the token lifecycle.

- UID2: [Running Site](https://prebid-client-server.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-prebid-client-server)
- EUID: [Running Site](https://prebid-client-server.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-prebid-client-server)

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_SERVER_BASE_URL` | API base URL for server-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_API_KEY` | Your API key for server-side token generation |
| `UID_CLIENT_SECRET` | Your client secret for server-side token generation |
| `UID_STORAGE_KEY` | localStorage key for token storage. Example: `__uid2_advertising_token` or `__euid_advertising_token` |
| `IDENTITY_NAME` | Display name for the UI. Example: `UID2` or `EUID` |

## Build and Run Locally

From the repository root directory:

```bash
docker compose up prebid-client-server
```

Once running, access the application at: **http://localhost:3052**

To stop the service:

```bash
docker compose stop prebid-client-server
```

## Testing and Debugging

For testing instructions and debugging tips, see the [Prebid.js README](../README.md).
