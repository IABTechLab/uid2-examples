# Prebid.js Integrations

This folder contains sample integrations using Prebid.js with the UID2/EUID User ID module. Prebid.js manages token storage, refresh, and inclusion in bid requests.

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

## Environment Variables

All integrations in this folder require common variables plus integration-specific ones. See the individual README for each integration for the complete list of required variables.

### Common Variables

| Variable | Description |
|:---------|:------------|
| `IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `UID_STORAGE_KEY` | localStorage key for Prebid token storage |
| `DOCS_BASE_URL` | Documentation base URL |

### Client-Side Specific

| Variable | Description |
|:---------|:------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side calls |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for CSTG |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for CSTG |

### Client-Server Specific

| Variable | Description |
|:---------|:------------|
| `UID_SERVER_BASE_URL` | API base URL for server-side calls |
| `UID_API_KEY` | Your API key for server-side token generation |
| `UID_CLIENT_SECRET` | Your client secret for server-side token generation |

## Debugging Tips

### Check Prebid Config

Open browser console (F12) and run:
```javascript
pbjs.getConfig('userSync')
```

### Force Token Refresh

```javascript
// For UID2
pbjs.refreshUserIds({ submoduleNames: ['uid2'] })

// For EUID
pbjs.refreshUserIds({ submoduleNames: ['euid'] })
```

### View Container Logs

```bash
docker compose logs prebid-client
docker compose logs prebid-client-server
docker compose logs prebid-client-side-deferred
```

### Rebuild After Changes

```bash
docker compose up -d --build SERVICE_NAME
```

### Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| `pbjs.getUserIds()` returns empty | Module not configured | Check Prebid config in page source |
| "Invalid subscription ID" | Wrong credentials | Verify credentials match operator URL |
| Token not in bid requests | Token not generated yet | Wait for `pbjs.refreshUserIds()` to complete |
| Module not loading | Prebid build missing module | Use the provided `prebid.js` build |
