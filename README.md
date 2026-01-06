# UID2 and EUID Integration Examples

This repository contains sample sites demonstrating various integration patterns for UID2 (Unified ID 2.0) and EUID (European Unified ID). 

## Available Integrations

- **[JavaScript SDK](web-integrations/javascript-sdk/)** — Direct SDK integration for client-side or client-server token management
- **[Prebid.js](web-integrations/prebid-integrations/)** — Header bidding integration where Prebid.js manages the token workflow
- **[Google Secure Signals](web-integrations/google-secure-signals/)** — Integration with Google Ad Manager's Secure Signals feature
- **[Prebid.js + Secure Signals](web-integrations/prebid-secure-signals/)** — Combined Prebid.js and Google Secure Signals integration
- **[Server-Side](web-integrations/server-side/)** — All token logic handled on the server
- **[Hashing Tool](tools/hashing-tool/)** — Tool for normalizing and hashing email/phone

For a list of all deployed sample sites and related documentation, see the [UID2 Integration Samples and Tools](https://unifiedid.com/docs/ref-info/integration-sample-sites) or [EUID Integration Samples and Tools](https://euid.eu/docs/ref-info/integration-sample-sites) pages.

---

## Running Locally

The following instructions are for running the sample sites on your local machine. This requires a local UID2 operator because the hosted operator does not accept requests from `localhost`. If you want to run locally without setting up a local operator, see [Run Without Local Operator](#run-without-local-operator-using-integ-environment) below.

### 1. Run a Local Operator

These sample sites require a local UID2 operator instance.

1. Clone the operator repo:
   ```bash
   git clone https://github.com/IABTechLab/uid2-operator.git
   ```

2. Follow the setup instructions in the [uid2-operator README](https://github.com/IABTechLab/uid2-operator#readme)

3. Ensure the operator is running on `http://localhost:8080`

### 2. Set Up Environment Variables

Copy one of the sample environment files:

```bash
# For UID2
cp .env.sample.uid2 .env

# For EUID
cp .env.sample.euid .env
```

Edit `.env` and add your credentials:
- `UID_API_KEY` — Your API key
- `UID_CLIENT_SECRET` — Your client secret
- `UID_CSTG_SERVER_PUBLIC_KEY` — Your CSTG public key
- `UID_CSTG_SUBSCRIPTION_ID` — Your CSTG subscription ID

> **Note:** Additional environment variables may be required depending on the integration type. The `.env.sample.uid2` and `.env.sample.euid` files contain all available variables. See the README in each [integration folder](#available-integrations) for which variables are required for that specific integration.

### 3. Start the Sample Sites

```bash
# Start all sample sites
docker-compose up -d

# Stop all services
docker-compose down
```

#### Start a Single Service

```bash
# Start only prebid-client
docker-compose up -d prebid-client

# Stop a single service
docker-compose stop prebid-client
```

#### Rebuild After Code Changes

```bash
# Rebuild all
docker-compose up -d --build

# Rebuild a single service
docker-compose up -d --build prebid-client
```

---

## Available Sample Sites

| Service Name | Description | Port | URL |
|--------------|-------------|------|-----|
| `javascript-sdk-client-side` | JavaScript SDK Client Side | 3031 | http://localhost:3031 |
| `javascript-sdk-client-server` | JavaScript SDK Client Server | 3032 | http://localhost:3032 |
| `server-side` | Server Side Integration | 3033 | http://localhost:3033 |
| `javascript-sdk-react-client-side` | JavaScript SDK React | 3034 | http://localhost:3034 |
| `google-secure-signals-client-server` | Google Secure Signals Client Server | 3041 | http://localhost:3041 |
| `google-secure-signals-client-side` | Google Secure Signals Client Side | 3042 | http://localhost:3042 |
| `google-secure-signals-server-side` | Google Secure Signals Server Side | 3043 | http://localhost:3043 |
| `google-secure-signals-react-client-side` | Google Secure Signals React | 3044 | http://localhost:3044 |
| `prebid-client` | Prebid Client Side | 3051 | http://localhost:3051 |
| `prebid-client-server` | Prebid Client Server | 3052 | http://localhost:3052 |
| `prebid-client-side-deferred` | Prebid Client Side Deferred | 3053 | http://localhost:3053 |
| `prebid-secure-signals-client-side` | Prebid Secure Signals | 3061 | http://localhost:3061 |
| `hashing-tool` | Hashing Tool | 3071 | http://localhost:3071 |

---

## Run Without Local Operator (Using Integ Environment)

If you don't want to run a local operator, you can use HTTPS with custom domains to connect to the integration environment operator instead.

This setup:
- Uses `https://` with subdomains (e.g., `https://prebid-client.sample-dev.com`)
- Connects to the UID2 integration operator (no local operator required)
- Requires certificate setup and hosts file configuration

See [tools/reverse-proxy/README.md](tools/reverse-proxy/README.md) for setup instructions.
