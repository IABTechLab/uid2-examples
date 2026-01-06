# Hashing Tool

A tool to verify that your implementation is normalizing and hashing email addresses and phone numbers correctly for UID2 and EUID.

- UID2: [Running Site](https://hashing-tool.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/getting-started/gs-normalization-encoding)
- EUID: [Running Site](https://hashing-tool.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/getting-started/gs-normalization-encoding)

> **Note:** The normalization and hashing logic is identical for both UID2 and EUID.

## Prerequisites

The following environment variables are required. Add them to your `.env` file in the repository root.

| Parameter | Description |
|:----------|:------------|
| `UID_JS_SDK_URL` | URL to the JavaScript SDK. Example: `https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js` |
| `UID_JS_SDK_NAME` | Global variable name for the SDK. Example: `__uid2` or `__euid` |
| `IDENTITY_NAME` | Display name for the UI. Example: `UID2` or `EUID` |
| `DOCS_BASE_URL` | Documentation base URL. Example: `https://unifiedid.com/docs` or `https://euid.eu/docs` |

## Build and Run Locally

From the repository root directory:

```bash
docker compose up hashing-tool
```

Once running, access the application at: **http://localhost:3071**

To stop the service:

```bash
docker compose stop hashing-tool
```

## Usage

1. Select **Email** or **Phone Number**
2. Enter the value to hash
3. Click **Enter**
4. View the normalized value, SHA-256 hash, and base64-encoded result
