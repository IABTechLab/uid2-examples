# Nginx Reverse Proxy

A nginx reverse proxy configuration that routes requests to different backend services based on subdomain.

## Configuration

This reverse proxy is configured to forward requests to different ports based on subdomain. Each subdomain maps to a specific service defined in `docker-compose.yml`.

### Environment Variables

The domain used for subdomain routing can be configured using the `DOMAIN` environment variable. This allows you to use different domains for different environments (dev, test, prod).

**Default:** `sample-dev.com` (if `DOMAIN` is not set)

**Examples:**
- Development: `DOMAIN=sample-dev.com`
- Test: `DOMAIN=sample-test.com`
- Production: `DOMAIN=sample-prod.com`

### Subdomain Routing

The following subdomains are configured (using `${DOMAIN}` as the base domain):

- `js-client-side.${DOMAIN}` → JavaScript SDK Client Side (port 3031)
- `js-client-server.${DOMAIN}` → JavaScript SDK Client Server (port 3032)
- `js-react.${DOMAIN}` → JavaScript SDK React Client Side (port 3034)
- `server-side.${DOMAIN}` → Server Side Integration (port 3033)
- `gss-client-server.${DOMAIN}` → Google Secure Signals Client Server (port 3041)
- `gss-client-side.${DOMAIN}` → Google Secure Signals Client Side (port 3042)
- `gss-server-side.${DOMAIN}` → Google Secure Signals Server Side (port 3043)
- `gss-react.${DOMAIN}` → Google Secure Signals React Client Side (port 3044)
- `prebid-client.${DOMAIN}` → Prebid Client Side (port 3051)
- `prebid-client-server.${DOMAIN}` → Prebid Client Server (port 3052)
- `prebid-ss.${DOMAIN}` → Prebid Secure Signals Client Side (port 3061)

**Example with default domain (`sample-dev.com`):**
- `js-client-side.sample-dev.com` → JavaScript SDK Client Side (port 3031)
- `js-client-server.sample-dev.com` → JavaScript SDK Client Server (port 3032)
- etc.

## Required Hosts File Configuration

To use the subdomain-based routing, you must add entries to your hosts file so that these subdomains resolve to localhost.

**Note:** Replace `sample-dev.com` with your configured `DOMAIN` value in the examples below.

### Windows

1. Open Notepad (or your preferred text editor) **as Administrator**
   - Right-click Notepad → "Run as administrator"
   - Or use PowerShell as Administrator

2. Open the hosts file:
   ```
   C:\Windows\System32\drivers\etc\hosts
   ```

3. Add the following entries at the end of the file:
   ```
   127.0.0.1 js-client-side.sample-dev.com
   127.0.0.1 js-client-server.sample-dev.com
   127.0.0.1 js-react.sample-dev.com
   127.0.0.1 server-side.sample-dev.com
   127.0.0.1 gss-client-server.sample-dev.com
   127.0.0.1 gss-client-side.sample-dev.com
   127.0.0.1 gss-server-side.sample-dev.com
   127.0.0.1 gss-react.sample-dev.com
   127.0.0.1 prebid-client.sample-dev.com
   127.0.0.1 prebid-client-server.sample-dev.com
   127.0.0.1 prebid-ss.sample-dev.com
   ```

4. Save the file

5. Flush DNS cache (run in PowerShell as Administrator):
   ```powershell
   ipconfig /flushdns
   ```

### macOS / Linux

1. Open the hosts file with sudo:
   ```bash
   sudo nano /etc/hosts
   ```
   (or use `vim`, `vi`, or your preferred editor)

2. Add the following entries:
   ```
   127.0.0.1 js-client-side.sample-dev.com
   127.0.0.1 js-client-server.sample-dev.com
   127.0.0.1 js-react.sample-dev.com
   127.0.0.1 server-side.sample-dev.com
   127.0.0.1 gss-client-server.sample-dev.com
   127.0.0.1 gss-client-side.sample-dev.com
   127.0.0.1 gss-server-side.sample-dev.com
   127.0.0.1 gss-react.sample-dev.com
   127.0.0.1 prebid-client.sample-dev.com
   127.0.0.1 prebid-client-server.sample-dev.com
   127.0.0.1 prebid-ss.sample-dev.com
   ```

3. Save and exit

4. Flush DNS cache (if needed):
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Linux (systemd-resolved)
   sudo systemd-resolve --flush-caches
   ```

## Usage

### Using Docker Compose (Recommended)

When using `docker-compose.yml` from the project root, the reverse proxy will automatically connect to other services on the same Docker network:

**Default domain (sample-dev.com):**
```bash
docker-compose up reverse-proxy
```

**Custom domain:**
```bash
DOMAIN=sample-test.com docker-compose up reverse-proxy
```

**Or set in your `.env` file:**
```bash
DOMAIN=sample-prod.com
```

Then run:
```bash
docker-compose up reverse-proxy
```

### Standalone Build and Run

#### Build the image
```bash
docker build -t nginx-reverse-proxy .
```

#### Run the container

**Default domain:**
```bash
docker run -d -p 80:80 --name nginx-proxy nginx-reverse-proxy
```

**Custom domain:**
```bash
docker run -d -p 80:80 -e DOMAIN=sample-test.com --name nginx-proxy nginx-reverse-proxy
```

**Note:** When running standalone, you'll need to ensure the backend services are accessible. You may need to modify the `proxy_pass` directives in `default.conf.template` to use `host.docker.internal` or the appropriate Docker network hostname.

## Customization

Edit `default.conf.template` to customize the nginx configuration:
- Add or remove server blocks for different subdomains
- Modify subdomain names in the `server_name` directives (use `${DOMAIN}` for the domain variable)
- Adjust proxy headers as needed
- Add additional location blocks for specific routes

**Important:** After modifying `default.conf.template`, rebuild the Docker image:
```bash
docker-compose build reverse-proxy
docker-compose up -d reverse-proxy
```

