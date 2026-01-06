# Google Secure Signals Integrations

This folder contains sample integrations combining UID2/EUID with Google Ad Manager's Secure Signals feature, enabling encrypted identity signals to be passed to Google for ad requests.

## Available Examples

| Folder | Description | Port |
|--------|-------------|------|
| `client-side/` | Client-side token generation with Secure Signals | 3042 |
| `client-server/` | Server-side token generation with Secure Signals | 3041 |
| `server-side/` | Full server-side implementation with Secure Signals | 3043 |
| `react-client-side/` | React implementation with Secure Signals | 3044 |

## Documentation

- UID2: [Secure Signals Guide](https://unifiedid.com/docs/guides/integration-google-ss) | [SDK Reference](https://unifiedid.com/docs/sdks/sdk-ref-javascript)
- EUID: [Secure Signals Guide](https://euid.eu/docs/guides/integration-google-ss) | [SDK Reference](https://euid.eu/docs/sdks/sdk-ref-javascript)

## Environment Variables

All integrations in this folder require common variables plus integration-specific ones. See the individual README for each integration for the complete list of required variables.

### Common Variables

| Variable | Description |
|:---------|:------------|
| `IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `DOCS_BASE_URL` | Used for UI links to public documentation (`https://unifiedid.com/docs` or `https://euid.eu/docs`) |

### Secure Signals Specific (Required for all examples in this folder)

| Variable | Description |
|:---------|:------------|
| `UID_SECURE_SIGNALS_SDK_URL` | URL to the Secure Signals SDK |
| `UID_SECURE_SIGNALS_STORAGE_KEY` | localStorage key for Secure Signals (`_GESPSK-uidapi.com` or `_GESPSK-euid.eu`) |

### Client-Side Specific

| Variable | Description |
|:---------|:------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for CSTG |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for CSTG |
| `UID_JS_SDK_URL` | URL to the JavaScript SDK |
| `UID_JS_SDK_NAME` | Global variable name (`__uid2` or `__euid`) |

> **React Note:** For the React example (`react-client-side/`), all client-side and Secure Signals variables must be prefixed with `REACT_APP_` (e.g., `REACT_APP_UID_CLIENT_BASE_URL`). See the [React README](react-client-side/README.md) for the complete list.

### Client-Server / Server-Side Specific

| Variable | Description |
|:---------|:------------|
| `UID_SERVER_BASE_URL` | API base URL for server-side calls |
| `UID_API_KEY` | Your API key for server-side token generation |
| `UID_CLIENT_SECRET` | Your client secret for server-side token generation |

## Debugging Tips

### Check Secure Signals Storage

Open Developer Tools (F12) > Application > Local Storage and look for:
- `_GESPSK-uidapi.com` (UID2)
- `_GESPSK-euid.eu` (EUID)

### Verify SDK Loaded

```javascript
// Check if Secure Signals providers are available
googletag.secureSignalProviders
```

### View Container Logs

```bash
docker compose logs google-secure-signals-client-side
docker compose logs google-secure-signals-client-server
docker compose logs google-secure-signals-server-side
docker compose logs google-secure-signals-react-client-side
```

### Rebuild After Changes

```bash
docker compose up -d --build SERVICE_NAME
```

### Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Secure Signals not loading | Script URL incorrect | Verify `UID_SECURE_SIGNALS_SDK_URL` |
| Signal not in ad requests | Token not generated | Generate token before ad request |
| Video not playing | Ad blocker | Disable ad blocker for testing |
| Storage key empty | SDK not initialized | Check for initialization errors in console |
