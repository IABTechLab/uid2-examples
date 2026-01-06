# Prebid.js with Google Secure Signals

This folder contains sample integrations that combine Prebid.js with Google Ad Manager's Secure Signals feature. This enables both header bidding and Google Ad Manager to receive UID2/EUID tokens.

## Integration Types

| Folder | Description |
|--------|-------------|
| `client-side/` | Prebid.js with UID2 module and Google Secure Signals integration |

## Required Environment Variables

| Variable | Required For | Description |
|----------|--------------|-------------|
| `UID_JS_SDK_URL` | All | URL to the UID2/EUID JavaScript SDK |
| `UID_SECURE_SIGNALS_SDK_URL` | All | URL to the Secure Signals SDK |
| `UID_CLIENT_BASE_URL` | All | Base URL for the UID2/EUID operator |
| `UID_CSTG_SUBSCRIPTION_ID` | All | Your CSTG subscription ID |
| `UID_CSTG_SERVER_PUBLIC_KEY` | All | Your CSTG public key |

## Prebid.js Build

The `prebid.js` file in this folder is a custom Prebid.js build that includes the UID2 and EUID User ID modules.

## Documentation

- [UID2 Client-Side Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-side)
- [Google Ad Manager Secure Signals Integration Guide](https://unifiedid.com/docs/guides/integration-google-ss)

