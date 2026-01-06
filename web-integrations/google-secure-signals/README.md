# Google Secure Signals Integrations

This folder contains sample integrations that combine UID2/EUID with Google Ad Manager's Secure Signals feature. Secure Signals allows encrypted user signals to be passed to Google Ad Manager for ad targeting.

## Integration Types

| Folder | Description |
|--------|-------------|
| `client-side/` | Client-side token generation with Secure Signals |
| `client-server/` | Server generates token, client manages refresh with Secure Signals |
| `server-side/` | All token logic server-side with Secure Signals |
| `react-client-side/` | React implementation with Secure Signals |

## Required Environment Variables

| Variable | Required For | Description |
|----------|--------------|-------------|
| `UID_JS_SDK_URL` | All | URL to the UID2/EUID JavaScript SDK |
| `UID_SECURE_SIGNALS_SDK_URL` | All | URL to the Secure Signals SDK |
| `UID_CLIENT_BASE_URL` | All | Base URL for the UID2/EUID operator |
| `UID_CSTG_SUBSCRIPTION_ID` | Client-side | Your CSTG subscription ID |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Client-side | Your CSTG public key |
| `UID_API_KEY` | Server-side | Your API key for server-side calls |
| `UID_CLIENT_SECRET` | Server-side | Your client secret for server-side calls |

## Documentation

- [Google Ad Manager Secure Signals Integration Guide](https://unifiedid.com/docs/guides/integration-google-ss)

