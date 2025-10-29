# Client-Side UID2 or EUID SDK Integration Example with Google Secure Signals

This example demonstrates how a content publisher who is working with [Google Interactive Media Ads(IMA) SDKs](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side) can use [Google Secure Signal](https://support.google.com/admanager/answer/10488752) and either the UID2 or EUID SDK for JavaScript to share tokens directly with bidders, in a client-side implementation that uses this SDK.

- For UID2: [UID2 SDK for JavaScript](https://unifiedid.com/docs/sdks/sdk-ref-javascript), [Google Ad Manager Secure Signals Integration Guide](https://unifiedid.com/docs/guides/integration-google-ss)
- For EUID: [EUID SDK for JavaScript](https://euid.eu/docs/sdks/sdk-ref-javascript), [EUID Google Ad Manager Secure Signals Integration Guide](https://euid.eu/docs/guides/integration-google-ss)

This example can be configured for either UID2 or EUID — the behavior is determined by your environment variable configuration. You cannot use both simultaneously.

## Build and Run the Example Application

### Environment Configuration

Copy the appropriate sample environment file:

```bash
# For UID2
cp .env.sample.uid2 .env

# For EUID  
cp .env.sample.euid .env
```

Then update the `.env` file with your credentials.

### Running with Docker

#### Using Docker Compose (Recommended)

From the repository root directory:

```bash
docker compose up google-secure-signals-client-side
```

The application will be available at http://localhost:3042

#### Using Docker Build

```bash
docker build -f web-integrations/google-secure-signals/client-side/Dockerfile -t google-secure-signals-client-side .
docker run -it --rm -p 3042:3042 --env-file .env google-secure-signals-client-side
```

### Environment Variables

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side/browser calls | UID2: `https://operator-integ.uidapi.com`<br/>EUID: `https://integ.euid.eu` |
| `UID_BASE_URL` | Fallback API base URL (used if `UID_CLIENT_BASE_URL` not set) | Same as above |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Server public key for client-side token generation. Provided via the UID2 Partner Portal or your integration representative. | Your assigned server public key |
| `UID_CSTG_SUBSCRIPTION_ID` | Subscription ID for client-side token generation. Provided via the UID2 Partner Portal or your integration representative. | Your assigned subscription ID |
| `UID_JS_SDK_URL` | URL to the JavaScript SDK | UID2: `https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js`<br/>EUID: `https://cdn.integ.euid.eu/euid-sdk-4.0.1.js` |
| `UID_JS_SDK_NAME` | Global variable name for the SDK | UID2: `__uid2`<br/>EUID: `__euid` |
| `UID_SECURE_SIGNALS_SDK_URL` | URL to the Secure Signals SDK | UID2: `https://cdn.integ.uidapi.com/uid2SecureSignal.js`<br/>EUID: `https://cdn.integ.euid.eu/euidSecureSignal.js` |
| `UID_SECURE_SIGNALS_STORAGE_KEY` | Local storage key for Secure Signals | UID2: `_GESPSK-uidapi.com`<br/>EUID: `_GESPSK-euid.eu` |
| `IDENTITY_NAME` | Identity name for UI display | UID2: `UID2`<br/>EUID: `EUID` |
| `DOCS_BASE_URL` | Documentation base URL | UID2: `https://unifiedid.com/docs`<br/>EUID: `https://euid.eu/docs` |

If needed, to close the application, terminate the docker container or use the `Ctrl+C` keyboard shortcut.

## Test the Example Application

The example application illustrates the steps documented in the Google Ad Manager Secure Signals Integration guides:
- UID2: [Google Ad Manager Secure Signals Integration Guide](https://unifiedid.com/docs/guides/integration-google-ss), [UID2 SDK for JavaScript](https://unifiedid.com/docs/sdks/sdk-ref-javascript)
- EUID: [EUID Google Ad Manager Secure Signals Integration Guide](https://euid.eu/docs/guides/integration-google-ss), [EUID SDK for JavaScript](https://euid.eu/docs/sdks/sdk-ref-javascript)

**Note:** For API endpoint documentation, see the UID2 or EUID docs based on your configuration.

The following table outlines and annotates the steps you may take to test and explore the example application.

| Step | Description                                                                                                                                                                                                                                                     | Comments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :--: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  1   | In your browser, navigate to the application main page at `http://localhost:3042`.                                                                                                                                                                              | The displayed main [page](views/index.html) of the example application provides a login form for the user to complete the UID2/EUID login process.</br>IMPORTANT: A real-life application must also display a form for the user to express their consent to targeted advertising.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|  2   | In the text field at the bottom, enter the user email address that you want to use for testing and click **Generate UID2** or **Generate EUID**. Note: The button label depends on your environment configuration; in a real production environment, labels may differ. | The click calls the Secure Signal [`clearAllCache()`](https://developers.google.com/publisher-tag/reference#googletag.secureSignals.SecureSignalProvidersArray_clearAllCache) function, to clear all cached signals from local storage. Then, it makes a call on the client side to the `setIdentityFromEmail` function of the JavaScript SDK. For details, see [Configuring the SDK for Javascript](https://unifiedid.com/docs/guides/integration-javascript-client-side#configure-the-sdk-for-javascript) (UID2) or [Configuring the SDK for Javascript](https://euid.eu/docs/guides/integration-javascript-client-side#configure-the-sdk-for-javascript) (EUID).                                                                                                                                                                                                         |
|  3   | A confirmation message appears with the established identity information.                                                                                                                                                                                  | The displayed identity information is the `body` property of the JSON response payload from the `client-generate` response (see [Decrypted JSON Response Format](https://unifiedid.com/docs/endpoints/post-token-generate#decrypted-json-response-format) for UID2 or [Decrypted JSON Response Format](https://euid.eu/docs/endpoints/post-token-generate#decrypted-json-response-format) for EUID). Next, the identity information is passed to the SDK [`setIdentity()`](https://unifiedid.com/docs/sdks/sdk-ref-javascript#setidentityidentity-identity-void) function. If the identity is valid, the SDK stores it either in local storage or a first-party cookie for use on subsequent page loads.                                                                                                                                                     |
|  4   | Click the **Back to the main page** link.                                                                                                                                                                                                                       | On the updated application main page, note the newly populated **Advertising Token** value and a video player. While the [page](views/index.html) is loading, [GPT](https://developers.google.com/publisher-tag/reference#googletag) auto-loads the Secure Signal script which pushes the advertising token to GPT local storage, and the [IMA](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side) makes an ad request which transmits the encoded signal in the request. The [page](views/index.html) calls the SDK [init()](https://unifiedid.com/docs/sdks/sdk-ref-javascript#initopts-object-void) function again, but this time without passing an explicit identity. Instead, the identity is loaded from the first-party cookie or local storage. |
|  5   | Click **Play**.                                                                                                                                                                                                                                                 | This triggers AdsManager to insert the ad returned from the ad request, for display. The ad tag used in this example contains a 10-second pre-roll ad.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|  6   | (Optional) Right-click the main page to inspect the source code.                                                                                                                                                                                                | When the SDK initialization is complete, the SDK invokes the passed callback function (`onIdentityUpdated()` in this example). For details, see [Callback Function](https://unifiedid.com/docs/sdks/client-side-identity#callback-function) (UID2) or [Callback Function](https://euid.eu/docs/sdks/client-side-identity#callback-function) (EUID).</br>IMPORTANT: The callback updates the page elements with the state of the identity: this is the place where you should define your logic for initiating targeted advertising.                                                                                                                                                                                                                                                                                                           |
|  7   | Keep the application main page open or refresh it after awhile and note the identity state, updated counter, and login information values.                                                                                                                 | In the background, the SDK continuously validates whether the advertising token is up-to-date and refreshes it automatically when needed. If the refresh succeeds, the user opts out, or the refresh token expires, the callback function is invoked and the UI elements are updated with the current state of the identity. For details, see [Workflow States and Transitions](https://unifiedid.com/docs/sdks/client-side-identity#workflow-states-and-transitions) (UID2) or [Workflow States and Transitions](https://euid.eu/docs/sdks/client-side-identity#workflow-states-and-transitions) (EUID), and [Background Token Auto-Refresh](https://unifiedid.com/docs/sdks/client-side-identity#background-token-auto-refresh).                                                                                                                                                                     |
|  8   | To exit the application, click **Clear UID2** or **Clear EUID**.                                                                                                                                                                                                                  | This event calls the SDK [`disconnect()`](https://unifiedid.com/docs/sdks/sdk-ref-javascript#disconnect-void) function, which clears the session and the first-party cookie or local storage and calls the Secure Signal [`clearAllCache()`](https://developers.google.com/publisher-tag/reference#googletag.secureSignals.SecureSignalProvidersArray_clearAllCache) function to clear all cached signals. This call also makes the SDK [`isLoginRequired()`](https://unifiedid.com/docs/sdks/sdk-ref-javascript#isloginrequired-boolean) function return `true`, which presents the user with the login form again.<br/> NOTE: The page displays the **Clear** button as long as the user identity is valid and refreshable within the integration test environment.    |
