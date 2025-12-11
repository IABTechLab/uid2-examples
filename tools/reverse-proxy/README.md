# Nginx Reverse Proxy

Routes HTTPS requests to UID sample sites based on subdomain.

## Prerequisites: Environment Variables

Before running the sample sites, you need to create a `.env` file in the project root (`uid2-examples/`) with your API credentials.

1. Copy one of the sample files:
   ```bash
   # For UID2
   cp .env.sample.uid2 .env

   # For EUID
   cp .env.sample.euid .env
   ```

2. Edit `.env` and add your credentials:
   - `UID_API_KEY` - Your API key
   - `UID_CLIENT_SECRET` - Your client secret
   - `UID_CSTG_SERVER_PUBLIC_KEY` - Your CSTG public key
   - `UID_CSTG_SUBSCRIPTION_ID` - Your CSTG subscription ID

See the sample files for all available configuration options.

---

## Quick Start

### 1. Install Dependencies & Generate Certificates

```bash
cd /path/to/uid2-examples
npm install
npm run createCA
```

### 2. Trust the CA Certificate (macOS)

```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./ca/ca.crt
```

Enter your password when prompted.

<details>
<summary>Windows instructions</summary>

1. Double-click `ca/ca.crt`
2. Click `Install Certificate...` → `Current User` → `Next`
3. Select `Place all certificates in the following store` → `Browse...`
4. Choose `Trusted Root Certification Authorities` → `OK` → `Next` → `Finish`

</details>

### 3. Add Hosts File Entries

Open your hosts file:
```bash
# macOS/Linux
sudo nano /etc/hosts

# Windows (run Notepad as Administrator)
# Open: C:\Windows\System32\drivers\etc\hosts
```

Add these entries:

```
127.0.0.1 sample-dev.com
127.0.0.1 js-client-side.sample-dev.com
127.0.0.1 js-client-server.sample-dev.com
127.0.0.1 js-react.sample-dev.com
127.0.0.1 server-side.sample-dev.com
127.0.0.1 secure-signals-client-server.sample-dev.com
127.0.0.1 secure-signals-client-side.sample-dev.com
127.0.0.1 secure-signals-server-side.sample-dev.com
127.0.0.1 secure-signals-react.sample-dev.com
127.0.0.1 prebid-client.sample-dev.com
127.0.0.1 prebid-client-server.sample-dev.com
127.0.0.1 prebid-deferred.sample-dev.com
127.0.0.1 prebid-secure-signals.sample-dev.com
```

Flush DNS cache after saving:
```bash
# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### 4. Start All Services

```bash
docker-compose up -d
```

> **Important:** This starts ALL containers (reverse-proxy + all sample sites). The reverse-proxy only routes traffic—it doesn't contain the sites themselves.

### 5. Access the Sites

Go to **https://sample-dev.com** — this index page has clickable links to all sample sites.

---

## Available Sites

| URL | Description | Port |
|-----|-------------|------|
| `https://sample-dev.com` | Index page (links to all sites) | — |
| `https://js-client-side.sample-dev.com` | JavaScript SDK Client Side | 3031 |
| `https://js-client-server.sample-dev.com` | JavaScript SDK Client Server | 3032 |
| `https://server-side.sample-dev.com` | Server Side Integration | 3033 |
| `https://js-react.sample-dev.com` | JavaScript SDK React | 3034 |
| `https://secure-signals-client-server.sample-dev.com` | Google Secure Signals Client Server | 3041 |
| `https://secure-signals-client-side.sample-dev.com` | Google Secure Signals Client Side | 3042 |
| `https://secure-signals-server-side.sample-dev.com` | Google Secure Signals Server Side | 3043 |
| `https://secure-signals-react.sample-dev.com` | Google Secure Signals React | 3044 |
| `https://prebid-client.sample-dev.com` | Prebid Client Side | 3051 |
| `https://prebid-client-server.sample-dev.com` | Prebid Client Server | 3052 |
| `https://prebid-deferred.sample-dev.com` | Prebid Client Side Deferred | 3053 |
| `https://prebid-secure-signals.sample-dev.com` | Prebid Secure Signals | 3061 |

---

## Troubleshooting

### Browser shows "Not Secure" warning
1. Make sure you trusted the CA certificate (step 2)
2. **Fully quit Chrome** (Cmd+Q) and reopen it
3. Verify trust worked: `security dump-trust-settings -d | grep -A2 "UID2 Examples"`

### 502 Bad Gateway
The backend service isn't running. Make sure you ran `docker-compose up -d` (not just the reverse-proxy).

### Site not loading at all
- Check hosts file entries are correct
- Flush DNS cache
- Make sure you're using `https://` not `http://`

### Re-generating certificates
If you add new domains or delete the `ca/` folder:
```bash
npm run createCA
# Then re-trust the CA certificate (step 2)
```

---

## Alternative: Direct Access (No Certificates)

You can skip all certificate setup and access services directly via localhost:

| URL | Service |
|-----|---------|
| `http://localhost:3051` | Prebid Client Side |
| `http://localhost:3052` | Prebid Client Server |
| `http://localhost:3053` | Prebid Client Side Deferred |
| `http://localhost:3031` | JavaScript SDK Client Side |
| *(etc.)* |

This bypasses the reverse-proxy entirely—no HTTPS, no subdomains needed.
