# UID2/EUID Hashing Tool

A tool to verify that your implementation is normalizing and hashing email addresses and phone numbers correctly for UID2 and EUID.

> **Note:** The normalization and hashing logic is identical for both UID2 and EUID.

## Running Locally

### Using Docker Compose

From the repository root:

```bash
docker-compose up -d hashing-tool
```

Access at: http://localhost:3071

### Using the Reverse Proxy (HTTPS)

```bash
docker-compose up -d
```

Access at: https://hashing-tool.sample-dev.com (requires hosts file and certificate setup — see [reverse-proxy README](../reverse-proxy/README.md))

## Usage

1. Select **Email** or **Phone Number**
2. Enter the value to hash
3. Click **Enter**
4. View the normalized value, SHA-256 hash, and base64-encoded result

## Documentation

- [UID2 Normalization and Encoding](https://unifiedid.com/docs/getting-started/gs-normalization-encoding)
- [EUID Normalization and Encoding](https://euid.eu/docs/getting-started/gs-normalization-encoding)

