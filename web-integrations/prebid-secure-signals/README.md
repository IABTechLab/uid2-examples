# Prebid.js + Google Secure Signals Integration

This folder contains a sample integration combining Prebid.js with Google Secure Signals and UID2/EUID, enabling both header bidding and encrypted identity signals to Google Ad Manager.

## How It Works

This integration combines two powerful frameworks:

1. **Prebid.js** — Manages UID2/EUID token generation (CSTG), refresh, and sends encrypted signals to Google Ad Manager
2. **Google Ad Manager** — Receives encrypted signals directly from Prebid via the **Prebid User ID Module**

**Important:** Unlike [standalone Secure Signals integrations](../google-secure-signals/), this approach does NOT use the separate UID2/EUID Secure Signals SDK. Prebid handles the entire integration natively through its `encryptedSignalSources` configuration.

### Key Configuration

The integration requires adding the `encryptedSignalSources` configuration to Prebid:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'uid2',  // or 'euid'
      params: {
        email: userEmail,
        subscriptionId: 'your-sub-id',
        serverPublicKey: 'your-public-key'
      }
    }]
  },
  // Enable Google Secure Signals integration
  encryptedSignalSources: {
    sources: [{
      source: ['uidapi.com'],  // or 'euid.eu' for EUID
      encrypt: false
    }]
  }
});
```

> **EUID Note:** If using EUID, you must configure consent management for GDPR compliance. See the example's `index.html` for an implementation using `consentManagementObj`. For more details, see the [EUID Permissions documentation](https://euid.eu/docs/getting-started/gs-permissions).

### Google Ad Manager Configuration

In your Google Ad Manager account, you must:

1. Enable Secure Signals for third-party bidders
2. Choose **"Prebid User ID Module"** as the deployment option
3. Enable **"Use your Prebid configuration to automatically configure your Secure signals settings"**

For details, see:
- UID2: [Allow Secure Signals Sharing](https://unifiedid.com/docs/guides/integration-google-ss#allow-secure-signals-sharing)
- EUID: [Allow Secure Signals Sharing](https://euid.eu/docs/guides/integration-google-ss#allow-secure-signals-sharing)

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

## Troubleshooting

### Prebid Doesn't Have the Identity

Run `pbjs.getUserIds()` in console. If empty or missing `uid2`/`euid`:
- Check console for Prebid errors
- Verify Prebid.js loaded correctly (check Network tab)
- Ensure `pbjs.setConfig()` is being called after token generation
- Check the browser console for "Configuring Prebid.js with..." message to confirm configuration
- Check that `IDENTITY_NAME` matches the expected identity type (UID2 or EUID)
