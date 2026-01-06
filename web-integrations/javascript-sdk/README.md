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

## Testing

### Basic Testing Steps

1. Navigate to the application URL (e.g., `http://localhost:3031`)
2. Enter a test email address in the input field
3. Click **Generate UID2** (or **Generate EUID**)
4. Verify the token appears in the UI
5. Refresh the page—the token should persist
6. Click **Clear UID2** (or **Clear EUID**) to log out

### Verifying Token State

Open your browser's Developer Tools (F12) and check:

- **Console**: Look for SDK initialization messages and any errors
- **Application > Local Storage**: Check for the token storage key (`__uid2_advertising_token` or `__euid_advertising_token`)
- **Network**: Monitor API calls to the operator endpoint

### Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| "Invalid subscription ID" | Wrong credentials for the environment | Verify `UID_CSTG_SUBSCRIPTION_ID` matches your operator URL |
| Token not persisting | localStorage blocked | Check browser privacy settings |
| SDK not loading | Wrong SDK URL | Verify `UID_JS_SDK_URL` is accessible |
| "Unexpected origin" | Domain not allowed | Use local operator or verify domain is registered |

### Debugging Tips

1. **Check environment variables**: Run `docker compose config` to see resolved values
2. **View container logs**: `docker compose logs javascript-sdk-client-side`
3. **Rebuild after changes**: `docker compose up -d --build javascript-sdk-client-side`
