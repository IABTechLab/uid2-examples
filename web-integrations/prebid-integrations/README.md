# Prebid.js Integrations

This folder contains sample integrations using Prebid.js with the UID2/EUID User ID module. Prebid.js handles the entire UID2 workflow—token generation, storage, and automatic refresh.

## Integration Types

| Folder | Description |
|--------|-------------|
| `client-side/` | Prebid.js handles all token management client-side using CSTG |
| `client-server/` | Server generates initial token, Prebid.js manages refresh |
| `client-side-deferred/` | Add UID2 module to existing Prebid config using `mergeConfig()` |

## Required Environment Variables

| Variable | Required For | Description |
|----------|--------------|-------------|
| `UID_CLIENT_BASE_URL` | All | Base URL for the UID2/EUID operator |
| `UID_CSTG_SUBSCRIPTION_ID` | Client-side | Your CSTG subscription ID |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Client-side | Your CSTG public key |
| `UID_API_KEY` | Client-server | Your API key for server-side calls |
| `UID_CLIENT_SECRET` | Client-server | Your client secret for server-side calls |

## Prebid.js Build

The `prebid.js` file in this folder is a custom Prebid.js build that includes the UID2 and EUID User ID modules.

## Documentation

- [UID2 Client-Side Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-side)
- [UID2 Client-Server Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-server)

