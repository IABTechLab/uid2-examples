# Prebid.js + Google Secure Signals Integration

This folder contains a sample integration combining Prebid.js with Google Secure Signals and UID2/EUID, enabling both header bidding and encrypted identity signals to Google Ad Manager.

## Available Examples

| Folder | Description | Port |
|--------|-------------|------|
| `client-side/` | Prebid.js with Secure Signals using client-side token generation | 3061 |

## Documentation

- UID2: [Prebid Guide](https://unifiedid.com/docs/guides/integration-prebid-client-side) | [Secure Signals Guide](https://unifiedid.com/docs/guides/integration-google-ss)
- EUID: [Prebid Guide](https://euid.eu/docs/guides/integration-prebid-client-side) | [Secure Signals Guide](https://euid.eu/docs/guides/integration-google-ss)

## Prebid.js Build

The `prebid.js` file in this folder is a custom Prebid.js build (v10.15.0) that includes:
- [UID2 User ID Module](https://docs.prebid.org/dev-docs/modules/userid-submodules/unified2.html)
- [EUID User ID Module](https://docs.prebid.org/dev-docs/modules/userid-submodules/euid.html)
- [TCF Consent Management Module](https://docs.prebid.org/dev-docs/modules/consentManagementTcf.html)

## Testing

### Basic Testing Steps

1. Navigate to the application URL (`http://localhost:3061`)
2. Enter a test email address in the input field
3. Click **Generate UID2** (or **Generate EUID**)
4. Open the browser console (F12) and run `pbjs.getUserIds()`
5. Verify the response contains a `uid2` or `euid` property
6. Check localStorage for Secure Signals storage key (`_GESPSK-*`)
7. Click **Play** to trigger an ad request with the encrypted signal

### Verifying Integration

Open your browser's Developer Tools (F12) and check:

- **Console**: Run `pbjs.getUserIds()` to verify Prebid has the token
- **Application > Local Storage**: Check for both token storage and Secure Signals storage
- **Network**: Monitor ad requests for encrypted signal payload

### Debugging Tips

1. **Check Prebid config**: Run `pbjs.getConfig('userSync')` in console
2. **Verify Secure Signals**: Look for `_GESPSK-*` keys in localStorage
3. **View container logs**: `docker compose logs prebid-secure-signals-client-side`
4. **Rebuild after changes**: `docker compose up -d --build prebid-secure-signals-client-side`
