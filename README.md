# UID2 Integration Examples

Sample sites demonstrating UID2/EUID integration patterns.

## Prerequisites

### 1. Set Up Environment Variables

Copy one of the sample environment files:

```bash
# For UID2
cp .env.sample.uid2 .env

# For EUID
cp .env.sample.euid .env
```

Edit `.env` and add your credentials:
- `UID_API_KEY` - Your API key
- `UID_CLIENT_SECRET` - Your client secret
- `UID_CSTG_SERVER_PUBLIC_KEY` - Your CSTG public key
- `UID_CSTG_SUBSCRIPTION_ID` - Your CSTG subscription ID

### 2. Run a Local Operator (Required)

These sample sites require a local UID2 operator instance.

1. Clone the operator repo:
   ```bash
   git clone https://github.com/IABTechLab/uid2-operator.git
   ```

2. Follow the setup instructions in the [uid2-operator README](https://github.com/IABTechLab/uid2-operator#readme)

3. Ensure the operator is running on `http://localhost:8080`

---

## Running the Sample Sites

### Start All Services

```bash
docker-compose up -d
```

### Stop All Services

```bash
docker-compose down
```

### Start a Single Service

```bash
# Start only prebid-client
docker-compose up -d prebid-client

# Start with live logs (foreground)
docker-compose up prebid-client
```

### Stop a Single Service

```bash
docker-compose stop prebid-client
```

### Rebuild After Code Changes

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

---

## Run Without Local Operator (Using Integ Environment)

If you don't want to run a local operator, you can use HTTPS with custom domains to hit the integration environment operator instead.

This setup:
- Uses `https://` with subdomains (e.g., `https://prebid-client.sample-dev.com`)
- Connects to the UID2 integration operator (no local operator required)
- Requires certificate setup and hosts file configuration

See [tools/reverse-proxy/README.md](tools/reverse-proxy/README.md) for setup instructions.
