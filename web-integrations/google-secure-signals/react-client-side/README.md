# React Client-Side UID2 SDK Integration Example with Google Secure Signals

This example demonstrates how a content publisher who is working with [Google Interactive Media Ads(IMA) SDKs](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side) can use [Google Secure Signal](https://support.google.com/admanager/answer/10488752) and the [UID2 SDK for JavaScript](https://unifiedid.com/docs/sdks/sdk-ref-javascript) to share UID2 directly with bidders, in an implementation that uses this JS SDK on the client side in a React App.

## Build and Run the Example Application

You can run this example in two ways:

### Option 1: Running Locally with npm (Recommended)

The fastest way to try the example is to run it locally:

1. Ensure you have a local UID2 operator running at `http://localhost:8080`

2. Add the following environment variables to the `.env` file at the root of the repository (`uid2-examples/.env`):
   ```
   REACT_APP_UID2_BASE_URL="http://localhost:8080"
   REACT_APP_UID2_CSTG_SUBSCRIPTION_ID="<your_subscription_id>"
   REACT_APP_UID2_CSTG_SERVER_PUBLIC_KEY="<your_server_public_key>"
   ```

3. Run the application:
   ```bash
   cd web-integrations/google-secure-signals/react-client-side
   npm install
   npm start
   ```

The example app will be up and running at `http://localhost:3044`

**Note:** The React app uses `dotenv-cli` to load environment variables from the parent `.env` file. Environment variables for React must be prefixed with `REACT_APP_` to be accessible in the browser.

### Option 2: Build and Run with Docker

Alternatively, you can build and run the example using Docker (note: this may take several minutes):

```
docker build . -t uid2-secure-signals-react
docker run -it --rm -p 3044:3044 uid2-secure-signals-react
```

The example app will be up and running at localhost:3044

If needed, to close the application, terminate the docker container or use the `Ctrl+C` keyboard shortcut.

## Test the Example Application

The example application illustrates the steps documented in the Google Ad Manager Secure Signals Integration guides:
- UID2: [Google Ad Manager Secure Signals Integration Guide](https://unifiedid.com/docs/guides/integration-google-ss), [UID2 SDK for JavaScript](https://unifiedid.com/docs/sdks/client-side-identity)
- EUID: [EUID Google Ad Manager Secure Signals Integration Guide](https://euid.eu/docs/guides/integration-google-ss), [EUID SDK for JavaScript](https://euid.eu/docs/sdks/client-side-identity)

**Note:** For API endpoint documentation, see the UID2 or EUID docs based on your configuration.

The following table outlines and annotates the steps you may take to test and explore the example application.

| Step | Description                                                                                                                                                                                                                                                     | Comments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :--: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  1   | In your browser, navigate to the application main page at `http://localhost:3044`.                                                                                                                                                                              | The displayed main [page](src/SecureSignalsApp.tsx) of the example application provides a login form for the user to complete the UID2/EUID login process.</br>IMPORTANT: A real-life application must also display a form for the user to express their consent to targeted advertising.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|  2   | In the text field at the bottom, enter the user email address that you want to use for testing and click **Generate UID2** or **Generate EUID**. Note: The button label depends on your environment configuration; in a real production environment, labels may differ. | The click calls the Secure Signal [`clearAllCache()`](https://developers.google.com/publisher-tag/reference#googletag.secureSignals.SecureSignalProvidersArray_clearAllCache) function, to clear all cached signals from local storage. Then, it makes a call on the client side to the `setIdentityFromEmail` function of the JavaScript SDK.                                                                                                                                                                                                                                                                                                                         |
|  3   | A confirmation message appears with the established identity information.                                                                                                                                                                                  | The displayed identity information is the `body` property of the JSON response payload from the `client-generate` response. Next, the identity information is passed to the SDK `setIdentity()` function. If the identity is valid, the SDK stores it either in local storage or a first-party cookie for use on subsequent page loads.                                                                                                                                                                                     |
|  4   | Click the **Back to the main page** link.                                                                                                                                                                                                                       | On the updated application main page, note the newly populated **Advertising Token** value and a video player. While the [page](src/SecureSignalsApp.tsx) is loading, [GPT](https://developers.google.com/publisher-tag/reference#googletag) auto-loads the Secure Signal script which pushes the advertising token to GPT local storage, and the [IMA](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side) makes an ad request which transmits the encoded signal in the request. The [page](src/SecureSignalsApp.tsx) calls the init() function again, but this time without passing an explicit identity. Instead, the identity is loaded from the first-party cookie or local storage. |
|  5   | Click **Play**.                                                                                                                                                                                                                                                 | This triggers AdsManager to insert the ad returned from the ad request, for display. The ad tag used in this example contains a 10-second pre-roll ad.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|  6   | (Optional) Right-click the main page to inspect the source code.                                                                                                                                                                                                | When the SDK initialization is complete, the SDK invokes the passed callback function.</br>IMPORTANT: The callback updates the page elements with the state of the identity: this is the place where you should define your logic for initiating targeted advertising.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|  7   | Keep the application main page open or refresh it after awhile and note the identity state, updated counter, and login information values.                                                                                                                 | In the background, the SDK continuously validates whether the advertising token is up-to-date and refreshes it automatically when needed. If the refresh succeeds, the user opts out, or the refresh token expires, the callback function is invoked and the UI elements are updated with the current state of the identity.                                                                                                                                                                                                     |
|  8   | To exit the application, click **Clear UID2** or **Clear EUID**.                                                                                                                                                                                                                  | This event calls the SDK `disconnect()` function, which clears the session and the first-party cookie or local storage and calls the Secure Signal [`clearAllCache()`](https://developers.google.com/publisher-tag/reference#googletag.secureSignals.SecureSignalProvidersArray_clearAllCache) function to clear all cached signals. This call also makes the SDK `isLoginRequired()` function return `true`, which presents the user with the login form again.<br/> NOTE: The page displays the **Clear** button as long as the user identity is valid and refreshable within the integration test environment.                    |
