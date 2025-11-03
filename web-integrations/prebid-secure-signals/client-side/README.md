# Client-Side UID2 or EUID Integration with Prebid.js and Google Secure Signals

This example demonstrates how to integrate UID2 or EUID with both **Prebid.js** (for header bidding) and **Google Secure Signals** (for Google Ad Manager) using client-side token generation (CSTG). In this pattern, Prebid manages the UID2/EUID token and sends encrypted signals directly to Google Ad Manager via the **Prebid User ID Module** integration.

For additional documentation, see:

- UID2: 
  - [UID2 Client-Side Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-side)
  - [UID2 Google Ad Manager Secure Signals Integration Guide](https://unifiedid.com/docs/guides/integration-google-ss)
- EUID:
  - [EUID Client-Side Integration Guide for Prebid.js](https://euid.eu/docs/guides/integration-prebid-client-side)
  - [EUID Google Ad Manager Secure Signals Integration Guide](https://euid.eu/docs/guides/integration-google-ss)

This example can be configured for either UID2 or EUID — the behavior is determined by your environment variable configuration. You cannot use both simultaneously.

> **NOTE:** This example uses Prebid.js v8.37.0.

## How It Works

This integration combines two powerful frameworks:

1. **Prebid.js** - Manages UID2/EUID token generation (CSTG), refresh, and sends encrypted signals to Google Ad Manager
2. **Google Ad Manager** - Receives encrypted signals directly from Prebid via the **Prebid User ID Module**

**Important:** Unlike standalone Secure Signals integrations, this approach does NOT use the separate UID2/EUID Secure Signals SDK. Prebid handles the entire integration natively through its `encryptedSignalSources` configuration and the Prebid User ID Module in Google Ad Manager.

### Key Configuration

The integration requires adding the `encryptedSignalSources` configuration to Prebid:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'uid2',  // or 'euid'
      params: {
        email: userEmail,
        subscriptionId: 'your-sub-id',
        serverPublicKey: 'your-public-key'
      }
    }]
  },
  // Enable Google Secure Signals integration
  encryptedSignalSources: {
    sources: [{
      source: ['uidapi.com'],  // or 'euid.eu' for EUID
      encrypt: false
    }]
  }
});
```

### Google Ad Manager Configuration

In your Google Ad Manager account, you must:

1. Enable Secure Signals for third-party bidders
2. Choose **"Prebid User ID Module"** as the deployment option
3. Enable **"Use your Prebid configuration to automatically configure your Secure signals settings"**

For details, see:
- UID2: [Allow Secure Signals Sharing](https://unifiedid.com/docs/guides/integration-google-ss#allow-secure-signals-sharing)
- EUID: [Allow Secure Signals Sharing](https://euid.eu/docs/guides/integration-google-ss#allow-secure-signals-sharing)

## Build and Run the Example Application

### Using Docker Compose (Recommended)

From the repository root directory:

```bash
# Start the service
docker compose up prebid-secure-signals-client-side
```

The application will be available at http://localhost:3061

To view logs or stop the service:

```bash
# View logs (in another terminal)
docker compose logs prebid-secure-signals-client-side

# Stop the service
docker compose stop prebid-secure-signals-client-side
```

### Using Docker Build

```bash
# Build the image
docker build -f web-integrations/prebid-secure-signals/client-side/Dockerfile -t prebid-secure-signals-client-side .

# Run the container
docker run -it --rm -p 3061:3061 --env-file .env prebid-secure-signals-client-side
```

## Environment Variables

The following environment variables must be set in your `.env` file:

### UID2/EUID Configuration

These variables configure the connection to UID2/EUID services for client-side token generation.

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side/browser calls. For details, see [Environments](https://unifiedid.com/docs/getting-started/gs-environments) (UID2) or [Environments](https://euid.eu/docs/getting-started/gs-environments) (EUID). | UID2: `https://operator-integ.uidapi.com`<br/>EUID: `https://integ.euid.eu` |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for client-side token generation for the UID2/EUID service specified in UID_CLIENT_BASE_URL. | Your assigned subscription ID |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for client-side token generation for the UID2/EUID service specified in UID_CLIENT_BASE_URL. | Your assigned server public key |

### Display/UI Configuration

These variables control UI display and storage keys.

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `IDENTITY_NAME` | Identity name for UI display | UID2: `UID2`<br/>EUID: `EUID` |
| `DOCS_BASE_URL` | Documentation base URL | UID2: `https://unifiedid.com/docs`<br/>EUID: `https://euid.eu/docs` |
| `UID_STORAGE_KEY` | localStorage key where Prebid stores tokens | UID2: `__uid2_advertising_token`<br/>EUID: `__euid_advertising_token` |

**Note:** These variables are substituted into the HTML during the Docker build process using `envsubst`. If a variable is not set in the `.env` file, default values are used.

## Test the Example Application

The example application illustrates the steps documented in the integration guides.

| Step | Description | Comments |
| :--: | :---------- | :------- |
| 1 | In your browser, navigate to `http://localhost:3061`. | The main page provides a form for the user to enter their email and generate an identity token. |
| 2 | Enter an email address and click **Generate UID2** or **Generate EUID**. | Prebid.js handles token generation using CSTG parameters. The token is generated client-side and stored in localStorage. |
| 3 | Observe both status sections | You should see:<br/>- **Prebid Status**: Shows the advertising token<br/>- **Google Secure Signals Status**: Shows "yes (configured via Prebid)" with the token value displayed |
| 4 | Verify Prebid configuration | Open browser console and run:<br/>`pbjs.getUserIds()` - Shows the token<br/>`pbjs.getConfig('encryptedSignalSources')` - Confirms encrypted signal sources configuration |
| 5 | **Verify Secure Signals in ad requests** | Open Network tab in DevTools, click **Play** on the video ad, and inspect ad requests to `doubleclick.net`. Look for the encrypted UID2/EUID signal in the request payload - this confirms Prebid is actually sending the token to Google Ad Manager.<br/><br/>**Note:** Unlike standalone Secure Signals integrations, Prebid's native integration does NOT create a `_GESPSK-*` localStorage entry. Prebid sends encrypted signals directly via the Prebid User ID Module, requiring manual verification via Network tab inspection. |
| 6 | Check token persistence | Refresh the page - the token should persist from `localStorage` and both Prebid and Secure Signals continue working. |
| 7 | To exit, click **Clear UID2** or **Clear EUID**. | This clears the identity from localStorage. |

## How the Integration Works

### Token Flow

1. **Token Generation**: Prebid's UID2/EUID module generates the token via CSTG
2. **Prebid Storage**: Token stored in localStorage at `__uid2_advertising_token` or `__euid_advertising_token`
3. **Prebid Usage**: 
   - Prebid automatically includes token in all bid requests to SSPs
   - Prebid sends encrypted signals directly to Google Ad Manager via the Prebid User ID Module (configured with `encryptedSignalSources`)
4. **Google Ad Manager**: Receives encrypted UID2/EUID token for targeting and measurement

### Manual Testing & Debugging

Use these commands in the browser console to verify the integration:

```javascript
// Check if Prebid has the UID2/EUID token
pbjs.getUserIds()
// Expected: { uid2: "..." } or { euid: "..." }

// Verify Prebid's Secure Signals configuration
pbjs.getConfig('encryptedSignalSources')
// Expected: { sources: [{ domain: "uidapi.com" }] } or similar for EUID

// Check localStorage for Prebid's token storage
localStorage.getItem('__uid2_advertising_token')
// or for EUID:
localStorage.getItem('__euid_advertising_token')
// Expected: JSON object with token data

// Verify Google Ad Manager tag is loaded
window.googletag
// Expected: Object with googletag API methods

```

### Key Benefits

- ✅ **No UID2/EUID SDK needed** - Prebid handles token generation, refresh, and Secure Signals integration
- ✅ **No separate Secure Signals SDK needed** - Prebid User ID Module handles the integration natively
- ✅ **Single refresh mechanism** - Prebid manages token lifecycle
- ✅ **Simplified integration** - Just add `encryptedSignalSources` config to Prebid
- ✅ **Native Google Ad Manager integration** - Uses Prebid User ID Module deployment option

## Prebid.js

This example includes a custom build of Prebid.js with the necessary modules for UID2/EUID integration. The `uid2IdSystem` module in Prebid supports both UID2 and EUID identities.

## Additional Resources

**UID2:**
- [UID2 Integration Overview for Prebid](https://unifiedid.com/docs/guides/integration-prebid)
- [Google Ad Manager Secure Signals Integration Guide](https://unifiedid.com/docs/guides/integration-google-ss)
- [Prebid.js Documentation](https://docs.prebid.org/)

**EUID:**
- [EUID Integration Overview for Prebid](https://euid.eu/docs/guides/integration-prebid)
- [EUID Google Ad Manager Secure Signals Integration Guide](https://euid.eu/docs/guides/integration-google-ss)

