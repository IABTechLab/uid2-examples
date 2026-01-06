# Prebid.js Integrations

This folder contains sample integrations using Prebid.js with the UID2/EUID User ID module. Prebid.js handles the entire token workflow—generation, storage, and automatic refresh.

## Available Examples

| Folder | Description | Port |
|--------|-------------|------|
| `client-side/` | Prebid.js handles all token management client-side using CSTG | 3051 |
| `client-server/` | Server generates initial token, Prebid.js manages refresh | 3052 |
| `client-side-deferred/` | Add UID2/EUID module to existing Prebid config using `mergeConfig()` | 3053 |

## Documentation

- UID2: [Client-Side Guide](https://unifiedid.com/docs/guides/integration-prebid-client-side) | [Client-Server Guide](https://unifiedid.com/docs/guides/integration-prebid-client-server)
- EUID: [Client-Side Guide](https://euid.eu/docs/guides/integration-prebid-client-side) | [Client-Server Guide](https://euid.eu/docs/guides/integration-prebid-client-server)

## Prebid.js Build

The `prebid.js` file in this folder is a custom Prebid.js build (v10.15.0) that includes:
- [UID2 User ID Module](https://docs.prebid.org/dev-docs/modules/userid-submodules/unified2.html)
- [EUID User ID Module](https://docs.prebid.org/dev-docs/modules/userid-submodules/euid.html)
- [TCF Consent Management Module](https://docs.prebid.org/dev-docs/modules/consentManagementTcf.html)

## Testing

### Basic Testing Steps

1. Navigate to the application URL (e.g., `http://localhost:3051`)
2. Enter a test email address in the input field
3. Click **Generate UID2** (or **Generate EUID**)
4. Open the browser console (F12) and run `pbjs.getUserIds()`
5. Verify the response contains a `uid2` or `euid` property with the advertising token
6. Refresh the page—the token should persist
7. Click **Clear UID2** (or **Clear EUID**) to log out

### Verifying Token State

Open your browser's Developer Tools (F12) and check:

- **Console**: Run `pbjs.getUserIds()` to see all configured user IDs
- **Application > Local Storage**: Check for `__uid2_advertising_token` or `__euid_advertising_token`
- **Network**: Monitor calls to the operator endpoint

### Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| `pbjs.getUserIds()` returns empty | Module not configured | Check Prebid config in page source |
| "Invalid subscription ID" | Wrong credentials | Verify credentials match operator URL |
| Token not in bid requests | Token not generated yet | Wait for `pbjs.refreshUserIds()` to complete |

### Debugging Tips

1. **Check Prebid config**: Run `pbjs.getConfig('userSync')` in console
2. **Force refresh**: Run `pbjs.refreshUserIds({ submoduleNames: ['uid2'] })` or `['euid']`
3. **View container logs**: `docker compose logs prebid-client`
4. **Rebuild after changes**: `docker compose up -d --build prebid-client`
