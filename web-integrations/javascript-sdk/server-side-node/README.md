# Server-Side UID2 or EUID Integration Example using JavaScript SDK

This example showcases how the UID2/EUID **JavaScript SDK works in Node.js** server environments. It uses the same `setIdentityFromEmail` method that runs in browsers, but executes it on the server. This uses **public credentials** (Subscription ID + Server Public Key) which are the same credentials used for client-side integrations.

For more information on the JavaScript SDK, refer to the [UID2 SDK for JavaScript](https://unifiedid.com/docs/sdks/sdk-ref-javascript) or [EUID SDK for JavaScript](https://euid.eu/docs/sdks/sdk-ref-javascript) documentation.

> **Note:** This example can be configured for either UID2 or EUID — the behavior is determined by your environment variable configuration. You cannot use both simultaneously.

## How This Implementation Works

Unlike the browser where the SDK runs natively in the DOM, this example uses **jsdom** to simulate a browser environment within Node.js:

1. **Imports the SDK**: Uses npm packages `@uid2/uid2-sdk` or `@unified-id/euid-sdk` (selected dynamically based on `IDENTITY_NAME`)
2. **Creates a virtual DOM**: Uses jsdom to provide `window`, `document`, and `navigator` objects that the SDK expects
3. **Polyfills browser APIs**: Adds Node.js equivalents for Web Crypto API (`crypto.subtle`) and text encoding APIs (`TextEncoder`/`TextDecoder`)
4. **Instantiates the SDK**: Creates a new instance of `UID2` or `EUID` class
5. **Runs SDK methods**: Calls `setIdentityFromEmail` just like in a browser, with the same public credentials

This demonstrates that the client-side SDK can be compatible with server-side Node.js environments when given the proper browser-like context.

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

## Environment Variables

The following table lists the environment variables that you must specify to start the application.

### Core Configuration

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `UID_SERVER_BASE_URL` | The base URL of the UID2/EUID service. For details, see [Environments](https://unifiedid.com/docs/getting-started/gs-environments) (UID2) or [Environments](https://euid.eu/docs/getting-started/gs-environments) (EUID). | UID2: `https://operator-integ.uidapi.com`<br/>EUID: `https://integ.euid.eu/v2` |
| `UID_CSTG_SUBSCRIPTION_ID` | Your UID2/EUID subscription ID for Client-Side Token Generation. **These are public credentials.** | Your assigned subscription ID (e.g., `DMr7uHxqLU`) |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your UID2/EUID server public key for Client-Side Token Generation. **These are public credentials.** | Your assigned public key |
| `UID_CSTG_ORIGIN` | The public URL where this application is deployed. Must match your CSTG subscription's allowed origins. | `https://your-domain.com` (production)<br/>`http://localhost:3034` (local dev default) |
| `SESSION_KEY` | Used by the cookie-session middleware to encrypt the session data stored in cookies. | Any secure random string |

### Display/UI Configuration

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `IDENTITY_NAME` | Identity name for UI display | UID2: `UID2`<br/>EUID: `EUID` |
| `DOCS_BASE_URL` | Documentation base URL | UID2: `https://unifiedid.com/docs`<br/>EUID: `https://euid.eu/docs` |

After you see output similar to the following, the example application is up and running:

```
Server listening at http://localhost:3034
```

If needed, to close the application, terminate the docker container or use the `Ctrl+C` keyboard shortcut.

## Test the Example Application

The following table outlines and annotates the steps you may take to test and explore the example application.

| Step | Description | Comments |
|:----:|:------------|:---------|
|  1   | In your browser, navigate to the application main page at `http://localhost:3034`. | The displayed main (index) page provides a login form for the user to complete the UID2/EUID login process.</br>IMPORTANT: A real-life application must also display a form for the user to express their consent to targeted advertising. |
|  2   | Enter the user email address that you want to use for testing and click **Log In**. | This is a call to the `/login` endpoint ([server.js](server.js)). The login initiated on the server side uses the JavaScript SDK's `setIdentityFromEmail` method to generate a token and processes the received response. The SDK handles all encryption/decryption automatically, just as it does in the browser. |
|      | The main page is updated to display the established identity information. | The displayed identity information is the `body` property of the response from the SDK's `setIdentityFromEmail` call. If the response is successful, the returned identity is saved to a session cookie (a real-world application would use a different way to store session data) and the protected index page is rendered. |
|  3   | Review the displayed identity information. | The server reads the user session and extracts the current identity ([server.js](server.js)). The `advertising_token` on the identity can be used for targeted advertising. Note that the identity contains several timestamps that determine when the advertising token becomes invalid (`identity_expires`) and when the server should attempt to refresh it (`refresh_from`). The `verifyIdentity` function ([server.js](server.js)) uses the SDK to refresh the token as needed.<br/>The user is automatically logged out in the following cases:<br/>- If the identity expires without being refreshed and refresh attempt fails.<br/>- If the refresh token expires.<br/>- If the refresh attempt indicates that the user has opted out. |
|  4   | To exit the application, click **Log Out**. | This calls the `/logout` endpoint on the server ([server.js](server.js)), which clears the session and presents the user with the login form again.<br/> NOTE: The page displays the **Log Out** button as long as the user is logged in. |

## Key Benefits

This example demonstrates the advantages of using the JavaScript SDK on the server:

- **Secure credential handling**: Public credentials (server public key and subscription ID) remain on the server and are not exposed to the browser
- **Simplified implementation**: The SDK handles the full token lifecycle including encryption, decryption, and refresh logic automatically
- **No manual cryptography**: Unlike traditional server-side integrations, there's no need to manually implement encryption/decryption processes
