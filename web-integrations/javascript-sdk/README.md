# JavaScript SDK Integrations

This folder contains sample integrations using the UID2/EUID JavaScript SDK directly, without Prebid.js or Google Secure Signals.

## Available Examples

| Folder | Description | Port |
|--------|-------------|------|
| `client-side/` | Client-side token generation using CSTG | 3031 |
| `client-server/` | Server generates initial token, client SDK manages refresh | 3032 |
| `react-client-side/` | React implementation of client-side token generation | 3034 |

## Documentation

- UID2: [Client-Side Guide](https://unifiedid.com/docs/guides/integration-javascript-client-side) | [Client-Server Guide](https://unifiedid.com/docs/guides/integration-javascript-client-server) | [SDK Reference](https://unifiedid.com/docs/sdks/sdk-ref-javascript)
- EUID: [Client-Side Guide](https://euid.eu/docs/guides/integration-javascript-client-side) | [Client-Server Guide](https://euid.eu/docs/guides/integration-javascript-client-server) | [SDK Reference](https://euid.eu/docs/sdks/sdk-ref-javascript)

## Environment Variables

All integrations in this folder require common variables plus integration-specific ones. See the individual README for each integration for the complete list of required variables.

### Common Variables

| Variable | Description |
|:---------|:------------|
| `IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `DOCS_BASE_URL` | Used for UI links to public documentation (`https://unifiedid.com/docs` or `https://euid.eu/docs`) |

### Client-Side Specific

| Variable | Description |
|:---------|:------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for CSTG |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for CSTG |
| `UID_JS_SDK_URL` | URL to the JavaScript SDK |
| `UID_JS_SDK_NAME` | Global variable name (`__uid2` or `__euid`) |

### Client-Server Specific

| Variable | Description |
|:---------|:------------|
| `UID_SERVER_BASE_URL` | API base URL for server-side calls |
| `UID_API_KEY` | Your API key for server-side token generation |
| `UID_CLIENT_SECRET` | Your client secret for server-side token generation |

## Debugging Tips

### Check Environment Variables

```bash
docker compose config
```

### View Container Logs

```bash
# Replace SERVICE_NAME with the specific service
docker compose logs javascript-sdk-client-side
docker compose logs javascript-sdk-client-server
docker compose logs javascript-sdk-react-client-side
```

### Rebuild After Changes

```bash
docker compose up -d --build SERVICE_NAME
```

### Verify Token State

Open Developer Tools (F12) and check:
- **Console**: Look for SDK initialization messages and errors
- **Application > Local Storage**: Check for `__uid2_advertising_token` or `__euid_advertising_token`
- **Network**: Monitor API calls to the operator endpoint

### Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| "Invalid subscription ID" | Wrong credentials for the environment | Verify credentials match your operator URL |
| Token not persisting | localStorage blocked | Check browser privacy settings |
| SDK not loading | Wrong SDK URL | Verify `UID_JS_SDK_URL` is accessible |
| "Unexpected origin" | Domain not allowed | Use local operator or verify domain is registered |
