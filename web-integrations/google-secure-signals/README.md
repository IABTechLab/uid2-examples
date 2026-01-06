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

## Testing

### Basic Testing Steps

1. Navigate to the application URL (e.g., `http://localhost:3042`)
2. Enter a test email address in the input field
3. Click **Generate UID2** (or **Generate EUID**)
4. Verify the token appears in the UI
5. Check that the Secure Signals storage key is populated in localStorage
6. Click **Play** to trigger an ad request (if video player is present)
7. Click **Clear UID2** (or **Clear EUID**) to log out

### Verifying Secure Signals

Open your browser's Developer Tools (F12) and check:

- **Application > Local Storage**: Look for `_GESPSK-uidapi.com` (UID2) or `_GESPSK-euid.eu` (EUID)
- **Network**: Monitor ad requests to Google—the encrypted signal should be included
- **Console**: Check for any Secure Signals initialization messages

### Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Secure Signals not loading | Script URL incorrect | Verify `UID_SECURE_SIGNALS_SDK_URL` |
| Signal not in ad requests | Token not generated | Generate token before ad request |
| Video not playing | Ad blocker | Disable ad blocker for testing |

### Debugging Tips

1. **Check Secure Signals storage**: Look for `_GESPSK-*` keys in localStorage
2. **Verify SDK loaded**: Check for `googletag.secureSignalProviders` in console
3. **View container logs**: `docker compose logs google-secure-signals-client-side`
4. **Rebuild after changes**: `docker compose up -d --build google-secure-signals-client-side`
