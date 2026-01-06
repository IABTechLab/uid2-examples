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

## Environment Variables

This integration requires variables for both Prebid.js and Secure Signals. See the individual README for the complete list.

### Common Variables

| Variable | Description |
|:---------|:------------|
| `IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `UID_STORAGE_KEY` | localStorage key for Prebid token storage |
| `DOCS_BASE_URL` | Used for UI links to public documentation (`https://unifiedid.com/docs` or `https://euid.eu/docs`) |

### Secure Signals Specific

| Variable | Description |
|:---------|:------------|
| `UID_SECURE_SIGNALS_SDK_URL` | URL to the Secure Signals SDK |
| `UID_SECURE_SIGNALS_STORAGE_KEY` | localStorage key for Secure Signals |

### Client-Side Specific

| Variable | Description |
|:---------|:------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for CSTG |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for CSTG |

## Debugging Tips

### Check Both Prebid and Secure Signals

```javascript
// Check Prebid token
pbjs.getUserIds()

// Check Secure Signals storage
localStorage.getItem('_GESPSK-uidapi.com')  // UID2
localStorage.getItem('_GESPSK-euid.eu')     // EUID
```

### View Container Logs

```bash
docker compose logs prebid-secure-signals-client-side
```

### Rebuild After Changes

```bash
docker compose up -d --build prebid-secure-signals-client-side
```

### Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Prebid token present but Secure Signals empty | Secure Signals SDK not loaded | Verify `UID_SECURE_SIGNALS_SDK_URL` |
| Neither token present | CSTG credentials incorrect | Check subscription ID and public key |
| Video ads not showing | Ad blocker | Disable ad blocker for testing |
