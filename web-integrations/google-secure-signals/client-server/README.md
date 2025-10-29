# Client-Server UID2 or EUID SDK Integration Example with Google Secure Signals

This example demonstrates how a content publisher who is working with [Google Interactive Media Ads(IMA) SDKs](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side) can use [Google Secure Signal](https://support.google.com/admanager/answer/10488752) and either the UID2 or EUID SDK for JavaScript to share tokens directly with bidders, in a client-server implementation that uses this SDK.

- For UID2: [UID2 SDK for JavaScript](https://unifiedid.com/docs/sdks/sdk-ref-javascript), [Google Ad Manager Secure Signals Integration Guide](https://unifiedid.com/docs/guides/integration-google-ss#sdk-for-javascript-client-server-integration)
- For EUID: [EUID SDK for JavaScript](https://euid.eu/docs/sdks/sdk-ref-javascript), [EUID Google Ad Manager Secure Signals Integration Guide](https://euid.eu/docs/guides/integration-google-ss#sdk-for-javascript-client-server-integration)

This example can be configured for either UID2 or EUID — the behavior is determined by your environment variable configuration. You cannot use both simultaneously.

For an example application without using the SDK, see [Server-Side UID2 or EUID Integration Example with Google Secure Signals](../server-side/README.md).

> NOTE: Although the server side of the example application is implemented in JavaScript using node.js, it is not a requirement. You can use any technology of your choice and refer to the example application for an illustration of the functionality that needs to be implemented.

## Running with Docker

### Using Docker Compose (Recommended)

From the repository root directory:

```bash
# Start the service
docker compose up google-secure-signals-client-server
```

The application will be available at http://localhost:3041

To view logs or stop the service:

```bash
# View logs (in another terminal)
docker compose logs google-secure-signals-client-server

# Stop the service
docker compose stop google-secure-signals-client-server
```

### Using Docker Build

```bash
# Build the image
docker build -f web-integrations/google-secure-signals/client-server/Dockerfile -t google-secure-signals-client-server .

# Run the container
docker run -it --rm -p 3041:3041 --env-file .env google-secure-signals-client-server
```

### Using the VS Code Debugger

The easiest way to try the example is to do the following:

1. Open this repo in VS Code
1. Copy the appropriate sample environment file to `.env` in the base directory:
   ```bash
   # For UID2
   cp .env.sample.uid2 .env
   
   # For EUID
   cp .env.sample.euid .env
   ```
1. Update the `.env` file with your credentials
1. Click the Run and Debug tab or hit `Crtl+Shift+D`
1. Select `Launch Secure Signals (Chrome)` from the configuration dropdown
1. Click `Start Debugging` or hit F5

### Environment Variables

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `UID_SERVER_BASE_URL` | The base URL of the UID2/EUID service for server-side API calls | UID2: `https://operator-integ.uidapi.com`<br/>EUID: `https://integ.euid.eu` |
| `UID_API_KEY` | Authentication key for accessing UID2/EUID services. Provided via the UID2 Portal or your integration representative. | Your assigned API key |
| `UID_CLIENT_SECRET` | Private key used with your API key to authenticate your app with UID2/EUID services. Provided via the UID2 Portal or your integration representative. | Your assigned client secret |
| `UID_JS_SDK_URL` | URL to the JavaScript SDK | UID2: `https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js`<br/>EUID: `https://cdn.integ.euid.eu/euid-sdk-4.0.1.js` |
| `UID_JS_SDK_NAME` | Global variable name for the SDK | UID2: `__uid2`<br/>EUID: `__euid` |
| `UID_SECURE_SIGNALS_SDK_URL` | URL to the Secure Signals SDK | UID2: `https://cdn.integ.uidapi.com/uid2SecureSignal.js`<br/>EUID: `https://cdn.integ.euid.eu/euidSecureSignal.js` |
| `IDENTITY_NAME` | Identity name for UI display | UID2: `UID2`<br/>EUID: `EUID` |
| `DOCS_BASE_URL` | Documentation base URL | UID2: `https://unifiedid.com/docs`<br/>EUID: `https://euid.eu/docs` |

**Note:** The example uses a Google IMA sample ad tag URL in `public/ads.js`. To test with your own ad tag, edit line 56 in `public/ads.js` to use your ad tag URL.

Output similar to the following indicates that the example application is up and running.

```
> uid2-publisher@1.0.0 start /usr/src/app
> node server.js

Example app listening at http://localhost:3041
```

If needed, to close the application, terminate the Docker container or use the `Ctrl+C` keyboard shortcut.

## Test the Example Application

**Note:** For API endpoint documentation, see the UID2 or EUID docs based on your configuration.

The following table outlines and annotates the steps you can take to test and explore the example application.

| Step | Description                                                                                                                                                                                                                                                | Comments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :--: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|  1   | In your browser, navigate to the application main page at `http://localhost:3041`.                                                                                                                                                                         | The displayed main ([index](views/index.html)) page of the example application provides a login form for the user to complete the UID2/EUID login process.</br>IMPORTANT: A real-life application must also display a form for the user to consent to targeted advertising.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|  2   | In the text field at the bottom, enter the email address that you want to use for testing and click **Generate UID2** or **Generate EUID**. Note: The button label depends on your environment configuration; in a real production environment, labels may differ. | The click calls the Secure Signal [`clearAllCache()`](https://developers.google.com/publisher-tag/reference#googletag.secureSignals.SecureSignalProvidersArray_clearAllCache) function, to clear all cached signals from local storage, and then calls the `/login` endpoint ([server.js](server.js)). The login initiated on the server side then calls the POST /token/generate endpoint (see [POST /token/generate](https://unifiedid.com/docs/endpoints/post-token-generate#decrypted-json-response-format) for UID2 or [POST /token/generate](https://euid.eu/docs/endpoints/post-token-generate#decrypted-json-response-format) for EUID) and processes the received response.                                                                                                                                                            |
|      | A confirmation message appears with the established identity information.                                                                                                                                                                             | The displayed identity information is the `body` property of the JSON response payload from the POST /token/generate response (see [Decrypted JSON Response Format](https://unifiedid.com/docs/endpoints/post-token-generate#decrypted-json-response-format) for UID2 or [Decrypted JSON Response Format](https://euid.eu/docs/endpoints/post-token-generate#decrypted-json-response-format) for EUID). It has been passed to the `login` [view](views/login.html) for rendering client-side JavaScript. Next, the identity information is passed to the SDK [`init()`](https://unifiedid.com/docs/sdks/sdk-ref-javascript#initopts-object-void) function. If the identity is valid, the SDK stores it either in local storage or a first-party cookie for use on subsequent page loads.                                                             |
|  3   | Click the **Back to the main page** link.                                                                                                                                                                                                                  | On the updated application main page, note the newly populated **Advertising Token** value and a video player. While the [page view](views/index.html) is loading, [GPT](https://developers.google.com/publisher-tag/reference#googletag) auto-loads the Secure Signal script which pushes the advertising token to GPT local storage, and the [IMA](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side) makes an ad request which transmits the encoded signal in the request. The [page view](views/index.html) calls the [init()](https://unifiedid.com/docs/sdks/sdk-ref-javascript#initopts-object-void) function again, but this time without passing an explicit identity. Instead, the identity is loaded from the first-party cookie. |
|  4   | Click **Play**.                                                                                                                                                                                                                                            | This triggers AdsManager to insert the ad returned from the ad request, for display. The ad tag used in this example contains a 10-second pre-roll ad.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|  5   | Keep the application main page open, or refresh it after a while, and note the identity state, updated counter, and login information values.                                                                                                         | In the background, the SDK continuously validates whether the advertising token is up to date, and refreshes it automatically when needed. If the refresh succeeds, the user opts out, or the refresh token expires, the callback function is invoked, and the UI elements are updated with the current state of the identity. For details, see [Workflow Overview](https://unifiedid.com/docs/sdks/sdk-ref-javascript#workflow-overview) (UID2) or [Workflow Overview](https://euid.eu/docs/sdks/sdk-ref-javascript#workflow-overview) (EUID), and [Background Token Auto-Refresh](https://unifiedid.com/docs/sdks/sdk-ref-javascript#background-token-auto-refresh).                                                                                                                                                                                                            |
|  6   | To exit the application, click **Clear UID2** or **Clear EUID**.                                                                                                                                                                                                             | This event calls the SDK [`disconnect()`](https://unifiedid.com/docs/sdks/sdk-ref-javascript#disconnect-void) function, which clears the session and the first-party cookie and calls the Secure Signal [`clearAllCache()`](https://developers.google.com/publisher-tag/reference#googletag.secureSignals.SecureSignalProvidersArray_clearAllCache) function to clear all cached signals. This call also makes the SDK [`isLoginRequired()`](https://unifiedid.com/docs/sdks/sdk-ref-javascript#isloginrequired-boolean) function return `true`, which presents the user with the login form again.<br/> NOTE: The page displays the **Clear** button as long as the user identity is valid and refreshable within the integration test environment.              |
