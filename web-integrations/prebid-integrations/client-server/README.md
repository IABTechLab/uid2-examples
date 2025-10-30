# Client-Server UID2 or EUID Integration Example with Prebid.js

This example demonstrates how to integrate UID2 or EUID with Prebid.js using client-server integration, where tokens are generated on the server side and passed to Prebid for use in header bidding auctions.

- For UID2: [UID2 with Prebid.js Client-Server Integration](https://unifiedid.com/docs/guides/integration-prebid-client-server)
- For EUID: [EUID with Prebid.js Client-Server Integration](https://euid.eu/docs/guides/integration-prebid-client-server)

This example can be configured for either UID2 or EUID — the behavior is determined by your environment variable configuration. You cannot use both simultaneously.

> **NOTE:** This example uses Prebid.js v8.

> **NOTE:** While the server side of this example is implemented in JavaScript using Node.js, it is not a requirement. You can use any technology of your choice and refer to this example for illustration of the functionality that needs to be implemented.

## Build and Run the Example Application

### Using Docker Compose (Recommended)

From the repository root directory:

```bash
# Start the service
docker compose up prebid-client-server
```

The application will be available at http://localhost:3052

To view logs or stop the service:

```bash
# View logs (in another terminal)
docker compose logs prebid-client-server

# Stop the service
docker compose stop prebid-client-server
```

### Using Docker Build

```bash
# Build the image
docker build -f web-integrations/prebid-integrations/client-server/Dockerfile -t prebid-client-server .

# Run the container
docker run -it --rm -p 3052:3052 --env-file .env prebid-client-server
```

The following table lists the environment variables that you must specify to start the application.

### Core Configuration

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `UID_SERVER_BASE_URL` | The base URL of the UID2/EUID service. For details, see [Environments](https://unifiedid.com/docs/getting-started/gs-environments) (UID2) or [Environments](https://euid.eu/docs/getting-started/gs-environments) (EUID). | UID2: `https://operator-integ.uidapi.com`<br/>EUID: `https://integ.euid.eu` |
| `UID_API_KEY` | Your UID2/EUID authentication key for the UID2/EUID service specified in UID_SERVER_BASE_URL. | Your assigned API key |
| `UID_CLIENT_SECRET` | Your UID2/EUID client secret for the UID2/EUID service specified in UID_SERVER_BASE_URL. | Your assigned client secret |

### Display/UI Configuration

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `IDENTITY_NAME` | Identity name for UI display | UID2: `UID2`<br/>EUID: `EUID` |
| `DOCS_BASE_URL` | Documentation base URL | UID2: `https://unifiedid.com/docs`<br/>EUID: `https://euid.eu/docs` |
| `UID_STORAGE_KEY` | localStorage key for storing tokens in browser | UID2: `__uid2_advertising_token`<br/>EUID: `__euid_advertising_token` |

**Note:** For Docker, use `http://host.docker.internal:8080` instead of `http://localhost:8080` to access services running on your host machine.

## Testing Environment Setup

You can test this example using either a local operator or the integration environment.

### Option A: Local Operator

This option runs a local instance of the UID2 or EUID Operator on your machine.

#### 1. Clone and Set Up the Operator

```bash
git clone https://github.com/IABTechLab/uid2-operator.git
cd uid2-operator
```

#### 2. Configure the Operator

Edit `conf/local-config.json` and ensure this key is set:

```json
{
  "enable_v2_encryption": true,
  "identity_scope": "uid2"  // or "euid" for EUID
}
```

#### 3. Get Your Credentials

Open `src/main/resources/clients/clients.json` (or `clients/metadata.json` depending on your setup) and find a client entry with the **"GENERATOR"** role. For example:

```json
{
  "key": "UID2-C-L-124-H8VwqX.l2G4TCuUWYAqdqkeG/UqtFoPEoXirKn4kHWxc=",
  "secret": "NcMgi6Y8C80SlxvV7pYlfcvEIo+2b0508tYQ3pKK8HM=",
  "name": "Publisher",
  "roles": ["GENERATOR"]
}
```

#### 4. Update Your .env File

In the **root of the uid2-examples repository** (at `/uid2-examples/.env`), add:

```bash
UID_SERVER_BASE_URL=http://host.docker.internal:8080
UID_API_KEY=UID2-C-L-124-H8VwqX.l2G4TCuUWYAqdqkeG/UqtFoPEoXirKn4kHWxc=
UID_CLIENT_SECRET=NcMgi6Y8C80SlxvV7pYlfcvEIo+2b0508tYQ3pKK8HM=
IDENTITY_NAME=UID2
DOCS_BASE_URL=https://unifiedid.com/docs
UID_STORAGE_KEY=__uid2_advertising_token
```

**For EUID:** Use `EUID-C-` keys, set `IDENTITY_NAME=EUID`, `DOCS_BASE_URL=https://euid.eu/docs`, and `UID_STORAGE_KEY=__euid_advertising_token`.

#### 5. Start the Operator

Follow the [UID2 Operator README](https://github.com/IABTechLab/uid2-operator) instructions to start the operator. It will run on `http://localhost:8080`.

### Option B: Integration Environment

This option uses the hosted integration environment (deployed version).

#### 1. Get Your Credentials

Contact your integration representative to obtain integration environment credentials.

#### 2. Update Your .env File

In the **root of the uid2-examples repository** (at `/uid2-examples/.env`), add:

**For UID2:**
```bash
UID_SERVER_BASE_URL=https://operator-integ.uidapi.com
UID_API_KEY=your-integ-api-key
UID_CLIENT_SECRET=your-integ-client-secret
IDENTITY_NAME=UID2
DOCS_BASE_URL=https://unifiedid.com/docs
UID_STORAGE_KEY=__uid2_advertising_token
```

**For EUID:**
```bash
UID_SERVER_BASE_URL=https://integ.euid.eu
UID_API_KEY=your-integ-api-key
UID_CLIENT_SECRET=your-integ-client-secret
IDENTITY_NAME=EUID
DOCS_BASE_URL=https://euid.eu/docs
UID_STORAGE_KEY=__euid_advertising_token
```



## Test the Example Application

The example application illustrates the steps documented in the integration guides. For an overview of the high-level workflow, API reference, and integration details, see:
- UID2: [UID2 Client-Server Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-server)
- EUID: [EUID Client-Server Integration Guide for Prebid.js](https://euid.eu/docs/guides/integration-prebid-client-server)

**Note:** For API endpoint documentation, see the UID2 or EUID docs based on your configuration.

The following table outlines and annotates the steps you may take to test and explore the example application.

| Step | Description | Comments |
| :--: | :---------- | :------- |
| 1 | In your browser, navigate to the application main page at `http://localhost:3052`. | The displayed main ([index.html](public/index.html)) page provides a login form for the user to complete the identity generation process.</br>IMPORTANT: A real-life application must also display a form for the user to express their consent to targeted advertising. |
| 2 | In the text field at the bottom, enter the user email address that you want to use for testing and click **Generate UID2** or **Generate EUID**. Note: The button label depends on your environment configuration; in a real production environment, labels may differ. | This is a call to the `/login` endpoint ([server.js](server.js)). The login initiated on the server side then calls the POST /token/generate endpoint and processes the received response. |
|  | A confirmation message appears with the established identity information. | The displayed identity information is stored in localStorage and passed to Prebid.js using `pbjs.setConfig()`. Prebid will automatically include this identity in all bid requests. |
| 3 | Open the browser console (F12 or right-click > Inspect) and run `pbjs.getUserIds()`. | You should see the identity object with either a `uid2` or `euid` property containing the advertising token. This confirms Prebid has successfully loaded the identity. |
| 4 | Refresh the page and note the token persists. | The identity is loaded from localStorage on page load and automatically configured in Prebid. |
| 5 | (Optional) Test opt-out by entering an opted-out email (e.g., `optout@example.com` for local operator) and generating a new token. | The UI should display "Ready for Targeted Advertising: **no**" and show an opt-out message. The console will show the opt-out status. |
| 6 | To exit the application, click **Clear UID2** or **Clear EUID**. | This clears the identity from localStorage and resets the UI. |

## How It Works

This example implements the Client-Server Integration Guide for Prebid.js:
- UID2: [UID2 Client-Server Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-server)
- EUID: [EUID Client-Server Integration Guide for Prebid.js](https://euid.eu/docs/guides/integration-prebid-client-server)

### Server Side (`server.js`)

1. Receives email from the client via `/login` endpoint
2. Encrypts the email and sends it to the `/v2/token/generate` API
3. Decrypts the response and extracts the identity
4. Returns the identity to the client as JSON

### Client Side (`public/index.html`)

1. Calls the `/login` endpoint with the user's email
2. Receives the identity from the server
3. Stores the identity in localStorage
4. Configures Prebid.js with the token using `pbjs.setConfig()`
5. Prebid.js includes the identity in bid requests

## Troubleshooting

### "Request failed with status code 401"

- Verify your `UID_API_KEY` and `UID_CLIENT_SECRET` are correct
- Ensure your API key has the **GENERATOR** role
- Check that credentials match your environment (local vs. integration)
- For EUID, ensure your operator's `identity_scope` is set to `"euid"` and you're using `EUID-C-` keys

### "Request failed with status code 500"

**For local operator:**
- Verify the operator is running at `localhost:8080`; the output should indicate 'OK'.
- Check `enable_v2_encryption: true` is set in the operator's config
- Review operator logs for errors
- Ensure `identity_scope` matches your credentials (e.g., `"uid2"` or `"euid"`)

**For Docker:**
- Ensure `UID_SERVER_BASE_URL` uses `host.docker.internal:8080` not `localhost:8080`

### Prebid Doesn't Have the Identity

Run `pbjs.getUserIds()` in console:
- If empty or missing `uid2`/`euid`, check console for Prebid errors
- Verify Prebid.js loaded correctly (check Network tab)
- Ensure `setPrebidConfig()` is being called after token generation
- Check that `IDENTITY_NAME` matches the expected identity type (UID2 or EUID)

## Additional Resources

To see all UID2 integration options with Prebid.js, see [UID2 Integration Overview for Prebid](https://unifiedid.com/docs/guides/integration-prebid).

To see all EUID integration options with Prebid.js, see [EUID Integration Overview for Prebid](https://euid.eu/docs/guides/integration-prebid).

For information about running a local operator, see [UID2 Operator Repository](https://github.com/IABTechLab/uid2-operator).

For general Prebid.js information, see [Prebid.js Documentation](https://docs.prebid.org/).
