# Google Secure Signals Integrations

This folder contains sample integrations combining UID2/EUID with Google Ad Manager's Secure Signals feature, enabling encrypted identity signals to be passed to Google for ad requests.

## How It Works

These integrations use the **UID2/EUID Secure Signals SDK** alongside the main UID2/EUID SDK:

1. **UID2/EUID SDK** — Manages token generation, refresh, and storage
2. **Secure Signals SDK** — Encrypts and stores the identity signal for Google Ad Manager
3. **Google Ad Manager** — Retrieves the encrypted signal from localStorage during ad requests

### Key Configuration

The Secure Signals SDK is loaded as a separate script and automatically picks up the UID2/EUID token:

```html
<!-- Load the main UID2/EUID SDK -->
<script src="https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js"></script>

<!-- Load the Secure Signals SDK -->
<script src="https://cdn.integ.uidapi.com/uid2SecureSignal.js"></script>
```

Once both SDKs are loaded and a token is generated, the Secure Signals SDK automatically stores an encrypted signal in localStorage under:
- `_GESPSK-uidapi.com` (UID2)
- `_GESPSK-euid.eu` (EUID)

### Google Ad Manager Configuration

In your Google Ad Manager account, you must:

1. Enable Secure Signals for third-party bidders
2. Add **UID2** or **EUID** as a signal provider

For details, see:
- UID2: [Allow Secure Signals Sharing](https://unifiedid.com/docs/guides/integration-google-ss#allow-secure-signals-sharing)
- EUID: [Allow Secure Signals Sharing](https://euid.eu/docs/guides/integration-google-ss#allow-secure-signals-sharing)

> **Prebid.js Alternative:** If you're using Prebid.js, you can use the [Prebid.js + Secure Signals integration](../prebid-secure-signals/) instead, which handles Secure Signals natively without requiring the separate SDK.

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

## Troubleshooting (Client-Server / Server-Side)

### "Request failed with status code 401"

- Verify your `UID_API_KEY` and `UID_CLIENT_SECRET` are correct
- Ensure your API key has the **GENERATOR** role
- Check that credentials match your environment (local vs. integration)
- For EUID, ensure your operator's `identity_scope` is set to `"euid"` and you're using `EUID-C-` keys

### "Request failed with status code 500"

**For local operator:**
- Verify the operator is running at `localhost:8080`
- Check `enable_v2_encryption: true` is set in the operator's config
- Review operator logs for errors
- Ensure `identity_scope` matches your credentials (e.g., `"uid2"` or `"euid"`)

**For Docker:**
- Ensure `UID_SERVER_BASE_URL` uses `host.docker.internal:8080` not `localhost:8080`
