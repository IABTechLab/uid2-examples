# Server-Side Integration Example

This example demonstrates a full server-side UID2/EUID implementation where all token logic is handled on the server, with no client-side SDK required.

- UID2: [Running Site](https://server-side.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-publisher-server-side)
- EUID: [Running Site](https://server-side.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-publisher-server-side)

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_SERVER_BASE_URL` | API base URL for server-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_API_KEY` | Your API key for server-side token generation |
| `UID_CLIENT_SECRET` | Your client secret for server-side token generation |
| `IDENTITY_NAME` | Display name for the UI. Example: `UID2` or `EUID` |

## Build and Run Locally

From the repository root directory:

```bash
docker compose up server-side
```

Once running, access the application at: **http://localhost:3033**

To stop the service:

```bash
docker compose stop server-side
```

## Testing

### Basic Testing Steps

1. Navigate to `http://localhost:3033`
2. Enter a test email address in the input field
3. Click **Generate UID2** (or **Generate EUID**)
4. Verify the token appears in the UI
5. Refresh the page—the token should persist (stored server-side)
6. Click **Clear UID2** (or **Clear EUID**) to log out

### Debugging Tips

1. **View container logs**: `docker compose logs server-side`
2. **Check environment**: Run `docker compose config` to see resolved values
3. **Rebuild after changes**: `docker compose up -d --build server-side`
