# Server-Side UID2 or EUID Integration Example with Google Secure Signals

This example demonstrates how a content publisher who is working with [Google Interactive Media Ads(IMA) SDKs](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side) can use [Google Secure Signal](https://support.google.com/admanager/answer/10488752) with either UID2 or EUID to share tokens directly with bidders, in a server-side implementation without using an SDK.

- For UID2: [Google Ad Manager Secure Signals Integration Guide](https://unifiedid.com/docs/guides/integration-google-ss#server-side-integration)
- For EUID: [EUID Google Ad Manager Secure Signals Integration Guide](https://euid.eu/docs/guides/integration-google-ss#server-side-integration)

This example can be configured for either UID2 or EUID — the behavior is determined by your environment variable configuration. You cannot use both simultaneously.

For an example application using the SDK, see [Client-Server UID2 or EUID SDK Integration Example with Google Secure Signals](../client-server/README.md) or [Client-Side UID2 or EUID SDK Integration Example with Google Secure Signals](../client-side/README.md).

> NOTE: Although the server side of the example application is implemented in JavaScript using node.js, it is not a requirement. You can use any technology of your choice and refer to the example application for an illustration of the functionality that needs to be implemented.

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
docker compose up google-secure-signals-server-side
```

The application will be available at http://localhost:3043

#### Using Docker Build

```bash
docker build -f web-integrations/google-secure-signals/server-side/Dockerfile -t google-secure-signals-server-side .
docker run -it --rm -p 3043:3043 --env-file .env google-secure-signals-server-side
```

### Environment Variables

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `UID_SERVER_BASE_URL` | The base URL of the UID2/EUID service for server-side API calls | UID2: `https://operator-integ.uidapi.com`<br/>EUID: `https://integ.euid.eu` |
| `UID_API_KEY` | Authentication key for accessing UID2/EUID services. Provided via the UID2 Partner Portal or your integration representative. | Your assigned API key |
| `UID_CLIENT_SECRET` | Private key used with your API key to authenticate your app with UID2/EUID services. Provided via the UID2 Partner Portal or your integration representative. | Your assigned client secret |
| `SESSION_KEY` | The key to the encryption session data stored in the application's session cookie | Any secure random string |
| `UID_SECURE_SIGNALS_SDK_URL` | URL to the Secure Signals SDK | UID2: `https://cdn.integ.uidapi.com/uid2SecureSignal.js`<br/>EUID: `https://cdn.integ.euid.eu/euidSecureSignal.js` |
| `IDENTITY_NAME` | Identity name for UI display | UID2: `UID2`<br/>EUID: `EUID` |
| `DOCS_BASE_URL` | Documentation base URL | UID2: `https://unifiedid.com/docs`<br/>EUID: `https://euid.eu/docs` |

Output similar to the following indicates that the example application is up and running.

```
> uid2-publisher@1.0.0 start /usr/src/app
> node server.js

Example app listening at http://localhost:3043
```

If needed, to close the application, terminate the Docker container or use the `Ctrl+C` keyboard shortcut.

## Test the Example Application

The application provides three main pages:

- index (main)
- example content 1
- example content 2

Access to these pages is possible only after the user completes the login process. If login is not complete, the user is redirected to the login page.

Submitting the login form simulates logging in to a publisher's application in the real world. Normally, the login
would require checking the user's secure credentials (for example, a password). In this example, for demonstration purposes, this
step is omitted, and the login process focuses on integration with the UID2/EUID services instead.

**Note:** For API endpoint documentation, see the UID2 or EUID docs based on your configuration.

The following table outlines and annotates the steps you can take to test and explore the example application.

| Step | Description                                                                                                                                                                                                               | Comments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :--: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|  1   | In your browser, navigate to the application main page at `http://localhost:3043`.                                                                                                                                        | The displayed main (index) page of the example application provides a [login form](views/login.html) for the user to complete the UID2/EUID login process.</br>IMPORTANT: A real-life application must also display a form for the user to consent to targeted advertising.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|  2   | Enter the email address that you want to use for testing and click **Generate UID2** or **Generate EUID**. Note: The button label depends on your environment configuration; in a real production environment, labels may differ. | The click calls the Secure Signal [`clearAllCache()`](https://developers.google.com/publisher-tag/reference#googletag.secureSignals.SecureSignalProvidersArray_clearAllCache) function, to clear all cached signals from local storage, and then calls the `/login` endpoint ([server.js](server.js)). The login initiated on the server side then calls the POST /token/generate endpoint and processes the received response.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|      | The main page updates to display the established identity information and a video player.                                                                                                                            | The displayed identity information is the `body` property of the JSON response payload from the successful POST /token/generate response. If the response is successful, the returned identity is saved to a session cookie (a real-world application would use a different way to store session data) and the protected index page is rendered. While the main page is loading, [Google Publisher Tag (GPT)](https://developers.google.com/publisher-tag/reference#googletag) auto-loads the Secure Signal script which pushes the advertising token to GPT local storage. The [Interactive Media Ads (IMA) SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side) then makes an ad request, and transmits the encoded signal in the request. |
|  4   | Click **Play**.                                                                                                                                                                                                           | This triggers AdsManager to insert the ad returned from the ad request, for display. The ad tag used in this example contains a 10-second pre-roll ad.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|  5   | To exit the application, click **Clear UID2** or **Clear EUID**.                                                                                                                                                                            | This event calls the Secure Signal [`clearAllCache()`](https://developers.google.com/publisher-tag/reference#googletag.secureSignals.SecureSignalProvidersArray_clearAllCache) function, to clear all cached signals, and then calls the `/logout` endpoint on the server ([server.js](server.js)), which clears the session and the first-party cookie and presents the user with the login form again.<br/> NOTE: The page displays the **Clear** button as long as the user identity is valid and refreshable within the integration test environment.                                                                                                                                                                                                                                                                                                             |
