# Server-Side UID2 or EUID Integration Example using JavaScript SDK

This example demonstrates how a content publisher can use either the UID2 or EUID services and the JavaScript SDK on the server side to implement the server-side integration workflow.

- For UID2: [UID2 services](https://unifiedid.com/docs/intro), [server-side UID2 integration workflow](https://unifiedid.com/docs/guides/integration-publisher-server-side)
- For EUID: [EUID services](https://euid.eu/docs/intro), [server-side EUID integration workflow](https://euid.eu/docs/guides/integration-publisher-server-side)

This example can be configured for either UID2 or EUID — the behavior is determined by your environment variable configuration. You cannot use both simultaneously.

## Key Difference from Other Examples

This example proves that the UID2/EUID **JavaScript SDK works in Node.js** server environments. It uses the same `setIdentityFromEmail` method that runs in browsers, but executes it on the server.

**Important:** This uses **public credentials** (Subscription ID + Server Public Key) which are the same credentials used for client-side integrations. This demonstrates that the client-side SDK is fully compatible with Node.js.

### Comparison with Other Examples

| Example | Environment | Credentials | SDK Usage | Notes |
|---------|-------------|-------------|-----------|-------|
| [server-side](../../server-side/) | Server only | API Key + Secret | No SDK | Manual encryption/decryption |
| [client-server](../client-server/) | Hybrid | API Key + Secret (server)<br/>None (client) | Client SDK only | Server generates, client maintains |
| [client-side](../client-side/) | Client only | Public Key + Subscription ID | Client SDK | Fully client-side |
| **This example** | **Server only** | **Public Key + Subscription ID** | **Client SDK on server** | **Proves SDK works in Node.js** |

> **Note:** While the server side of the example application is implemented in JavaScript using Node.js, it is not a requirement. You can use any technology of your choice and refer to the example application for illustration of the functionality that needs to be implemented.

## Prerequisites

- Node.js 20.x or higher
- UID2/EUID API Key and Client Secret (for server-side integration)
- Access to UID2 or EUID integration environment

## Build and Run the Example Application

### Using Docker Compose (Recommended)

From the repository root directory:

```bash
# Start the service
docker compose up javascript-sdk-server-side
```

The application will be available at http://localhost:3034

To view logs or stop the service:

```bash
# View logs (in another terminal)
docker compose logs javascript-sdk-server-side

# Stop the service
docker compose stop javascript-sdk-server-side
```

### Using Docker Build

```bash
# Build the image
docker build -f web-integrations/javascript-sdk/server-side/Dockerfile -t javascript-sdk-server-side .

# Run the container
docker run -it --rm -p 3034:3034 --env-file .env javascript-sdk-server-side
```

### Using npm (Local Development)

```bash
# Navigate to this directory
cd web-integrations/javascript-sdk/server-side

# Install dependencies
npm install

# Start the server (requires .env file in repository root)
npm start
```

## Configuration

The following table lists the environment variables that you must specify to start the application.

### Core Configuration

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `UID_SERVER_BASE_URL` | The base URL of the UID2/EUID service. For details, see [Environments](https://unifiedid.com/docs/getting-started/gs-environments) (UID2) or [Environments](https://euid.eu/docs/getting-started/gs-environments) (EUID). | UID2: `https://operator-integ.uidapi.com`<br/>EUID: `https://integ.euid.eu/v2` |
| `UID_CSTG_SUBSCRIPTION_ID` | Your UID2/EUID subscription ID for Client-Side Token Generation. **These are public credentials.** | Your assigned subscription ID (e.g., `DMr7uHxqLU`) |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your UID2/EUID server public key for Client-Side Token Generation. **These are public credentials.** | Your assigned public key |
| `SESSION_KEY` | The key to encrypt session data stored in the application session cookie. This can be any arbitrary string. | Any secure random string |

### Display/UI Configuration

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `IDENTITY_NAME` | Identity name for UI display | UID2: `UID2`<br/>EUID: `EUID` |
| `DOCS_BASE_URL` | Documentation base URL | UID2: `https://unifiedid.com/docs`<br/>EUID: `https://euid.eu/docs` |

After you see output similar to the following, the example application is up and running:

```
Server-Side UID2/EUID Integration Example using JavaScript SDK
Listening at http://localhost:3034

Note: SDK integration is not yet complete.
TODO: Add UID2/EUID JavaScript SDK package and implement token generation/refresh.
```

If needed, to close the application, terminate the docker container or use the `Ctrl+C` keyboard shortcut.

## Test the Example Application

The example application illustrates the steps documented in the server-side integration guides:
- UID2: [Server-Side Integration Guide](https://unifiedid.com/docs/guides/integration-publisher-server-side)
- EUID: [Server-Side Integration Guide](https://euid.eu/docs/guides/integration-publisher-server-side)

**Note:** For API endpoint documentation, see the UID2 or EUID docs based on your configuration.

The application provides three main pages: index (main), example content 1, and example content 2. Access to these pages is possible only after the user completes the login process. If the user is not logged in, they will be redirected to the login page.

Submitting the login form simulates logging in to a publisher's application in the real world. Normally the login would require checking the user's secure credentials (for example, a password), but for demonstration purposes this step is omitted, and the login process focuses on integration with the UID2/EUID services using the JavaScript SDK on the server.

The following table outlines and annotates the steps you may take to test and explore the example application.

| Step | Description | Comments |
|:----:|:------------|:---------|
|  1   | In your browser, navigate to the application main page at `http://localhost:3034`. | The displayed main (index) page of the example application provides a [login form](views/login.html) for the user to complete the UID2/EUID login process.</br>IMPORTANT: A real-life application must also display a form for the user to express their consent to targeted advertising. |
|  2   | Enter the user email address that you want to use for testing and click **Log In**. | This is a call to the `/login` endpoint ([server.js](server.js)). The login initiated on the server side uses the JavaScript SDK's `setIdentityFromEmail` method to generate a token and processes the received response. The SDK handles all encryption/decryption automatically, just as it does in the browser. |
|      | The main page is updated to display links to the two pages with protected content and the established identity information. | The displayed identity information is the `body` property of the response from the SDK's `setIdentityFromEmail` call. If the response is successful, the returned identity is saved to a session cookie (a real-world application would use a different way to store session data) and the protected index page is rendered. |
|  3   | Click either of the two sample content pages. | When the user requests the index or content pages, the server reads the user session and extracts the current identity ([server.js](server.js)). The `advertising_token` on the identity can be used for targeted advertising. |
|  4   | Click the **Back to the main page** link. | Note that the identity contains several timestamps that determine when the advertising token becomes invalid (`identity_expires`) and when the server should attempt to refresh it (`refresh_from`). Every time a protected page is requested, the `verifyIdentity` function ([server.js](server.js)) uses the SDK to refresh the token as needed.<br/>The user is automatically logged out in the following cases:<br/>- If the identity expires without being refreshed and refresh attempt fails.<br/>- If the refresh token expires.<br/>- If the refresh attempt indicates that the user has opted out. |
|  5   | To exit the application, click **Log Out**. | This calls the `/logout` endpoint on the server ([server.js](server.js)), which clears the session and the first-party cookie and presents the user with the login form again.<br/> NOTE: The page displays the **Log Out** button as long as the user is logged in. |

## Implementation Status

> **⚠️ Important:** This example is currently in initial development. The JavaScript SDK integration is not yet complete.

### TODO

- [ ] Identify the correct way to import/use the JavaScript SDK in Node.js (it's designed for browsers but should work with proper setup)
- [ ] Implement `setIdentityFromEmail` call in the `/login` endpoint using public credentials
- [ ] Handle SDK callbacks/promises properly in the Node.js environment
- [ ] Add error handling for SDK operations
- [ ] Test that the generated identity matches what the client-side example produces
- [ ] Update documentation with actual SDK API usage once working
- [ ] Add to docker-compose.yml in repository root

## Development Notes

This example demonstrates that the browser-based JavaScript SDK can run in Node.js. It uses the same public credentials and methods as the client-side example:

**Client-Side (Browser):**
```javascript
// In browser
const sdk = window.__uid2;
await sdk.setIdentityFromEmail(email, {
  subscriptionId: 'DMr7uHxqLU',
  serverPublicKey: 'UID2-X-I-MFk...'
});
```

**This Example (Node.js Server):**
```javascript
// Same code, but running on Node.js server
const sdk = getUid2Sdk(); // Need to figure out proper import
await sdk.setIdentityFromEmail(email, {
  subscriptionId: process.env.UID_CSTG_SUBSCRIPTION_ID,
  serverPublicKey: process.env.UID_CSTG_SERVER_PUBLIC_KEY
});
```

The key challenge is figuring out how to properly import/initialize the SDK in a Node.js environment since it's primarily designed for browsers.

## Contributing

When implementing the SDK integration, ensure:

1. The SDK is properly initialized with API key and client secret
2. Error handling matches the existing server-side example behavior
3. Session management remains unchanged
4. The user experience is identical to the manual crypto version
5. All environment variables are properly documented

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
