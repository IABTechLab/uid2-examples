# JavaScript SDK Integrations

This folder contains sample integrations using the UID2/EUID SDK for JavaScript directly, without Prebid.js or Google Secure Signals.

## Integration Types

| Folder | Description |
|--------|-------------|
| `client-side/` | Client-side token generation using CSTG (Client-Side Token Generation) |
| `client-server/` | Server generates the initial token, client SDK manages refresh |
| `react-client-side/` | React implementation of client-side token generation |

## Required Environment Variables

| Variable | Required For | Description |
|----------|--------------|-------------|
| `UID_JS_SDK_URL` | All | URL to the UID2/EUID JavaScript SDK |
| `UID_CLIENT_BASE_URL` | All | Base URL for the UID2/EUID operator |
| `UID_CSTG_SUBSCRIPTION_ID` | Client-side | Your CSTG subscription ID |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Client-side | Your CSTG public key |
| `UID_API_KEY` | Client-server | Your API key for server-side calls |
| `UID_CLIENT_SECRET` | Client-server | Your client secret for server-side calls |

## Documentation

- [Client-Side Integration Guide](https://unifiedid.com/docs/guides/integration-javascript-client-side)
- [Client-Server Integration Guide](https://unifiedid.com/docs/guides/integration-javascript-client-server)

