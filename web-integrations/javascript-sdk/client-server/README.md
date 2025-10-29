# Client-Server UID2 or EUID Integration Example using JavaScript SDK

[This example](https://example-jssdk-integ.uidapi.com/) demonstrates how a content publisher can use either the UID2 or EUID services and the corresponding SDK for JavaScript to implement the client-server integration workflow.

- For UID2: [UID2 services](https://unifiedid.com/docs/intro), [UID2 SDK for JavaScript](https://unifiedid.com/docs/sdks/sdk-ref-javascript), [client-server UID2 integration workflow](https://unifiedid.com/docs/guides/integration-javascript-client-server)
- For EUID: [EUID services](https://euid.eu/docs/intro), [EUID SDK for JavaScript](https://euid.eu/docs/sdks/sdk-ref-javascript), [client-server EUID integration workflow](https://euid.eu/docs/guides/integration-javascript-client-server)

This example can be configured for either UID2 or EUID — the behavior is determined by your environment variable configuration. You cannot use both simultaneously.

For an example application without using the SDK, see [Server-Side UID2 or EUID Integration Example](../../server-side/README.md).

> NOTE: While the server side of the example application is implemented in JavaScript using node.js, it is not
> a requirement. You can use any technology of your choice and refer to the example application for illustration of the functionality that needs to be implemented.

## Build and Run the Example Application

### Using Docker Compose (Recommended)

From the repository root directory:

```bash
docker compose up javascript-sdk-client-server
```

The application will be available at http://localhost:3032

### Using Docker Build

```bash
docker build -f web-integrations/javascript-sdk/client-server/Dockerfile -t javascript-sdk-client-server .
docker run -it --rm -p 3032:3032 --env-file .env javascript-sdk-client-server
```

The following table lists the environment variables that you must specify to start the application.

### Core Configuration

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `UID_SERVER_BASE_URL` | The base URL of the UID2/EUID service. For details, see [Environments](https://unifiedid.com/docs/getting-started/gs-environments) (UID2) or [Environments](https://euid.eu/docs/getting-started/gs-environments) (EUID). | UID2: `https://operator-integ.uidapi.com`<br/>EUID: `https://integ.euid.eu/v2` |
| `UID_API_KEY` | Authentication key for accessing UID2/EUID services. Provided via the UID2 Portal or your integration representative. | Your assigned API key |
| `UID_CLIENT_SECRET` | Private key used with your API key to authenticate your app with UID2/EUID services. Provided via the UID2 Portal or your integration representative. | Your assigned client secret |
| `UID_JS_SDK_URL` | URL to the JavaScript SDK | UID2: `https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js`<br/>EUID: `https://cdn.integ.euid.eu/euid-sdk-4.0.1.js` |
| `UID_JS_SDK_NAME` | Global variable name for the SDK | UID2: `__uid2`<br/>EUID: `__euid` |

### Display/UI Configuration

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `IDENTITY_NAME` | Identity name for UI display | UID2: `UID2`<br/>EUID: `EUID` |
| `DOCS_BASE_URL` | Documentation base URL | UID2: `https://unifiedid.com/docs`<br/>EUID: `https://euid.eu/docs` |


## Test the Example Application

The example application illustrates the steps documented in the integration guides. For an overview of the high-level workflow for establishing UID2/EUID identity, API reference, and cookie format details, see:
- UID2: [UID2 SDK Integration Guide](https://unifiedid.com/docs/guides/publisher-client-side), [UID2 SDK for JavaScript](https://unifiedid.com/docs/sdks/client-side-identity)
- EUID: [EUID SDK Integration Guide](https://euid.eu/docs/guides/publisher-client-side), [EUID SDK for JavaScript](https://euid.eu/docs/sdks/client-side-identity)

**Note:** For API endpoint documentation, see the UID2 or EUID docs based on your configuration.

The following table outlines and annotates the steps you may take to test and explore the example application.

| Step | Description                                                                                                                                                                                                                                              | Comments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :--: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  1   | In your browser, navigate to the application main page at `http://localhost:3032`.                                                                                                                                                                       | The displayed main ([index](views/index.html)) page of the example application provides a login form for the user to complete the UID2/EUID login process.</br>IMPORTANT: A real-life application must also display a form for the user to express their consent to targeted advertising.                                                                                                                                                                                                                                                                                                                                                                                        |
|  2   | In the text field at the bottom, enter the user email address that you want to use for testing and click **Generate UID2** or **Generate EUID**. Note: The button label depends on your environment configuration; in a real production environment, labels may differ. | This is a call to the `/login` endpoint ([server.js](server.js)). The login initiated on the server side then calls the POST /token/generate endpoint and processes the received response.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|      | A confirmation message appears with the established identity information.                                                                                                                                                                           | The displayed identity information is the `body` property of the JSON response payload from the POST /token/generate response. It has been passed to the `login` [view](views/login.html) for rendering client-side JavaScript. Next, the identity information is passed to the SDK `init()` function. If the identity is valid, the SDK stores it in a first-party cookie for use on subsequent page loads. |
|  3   | Click the **Back to the main page** link.                                                                                                                                                                                                                | On the updated application main page, note the newly populated **Advertising Token** value. The [page view](views/index.html) calls the init() function again, but this time without passing an explicit identity. Instead, the identity is loaded from the first-party cookie.                                                                                                                                                                                                                                                                                                                                           |
|  4   | (Optional) Right-click the main page to inspect the source code.                                                                                                                                                                                         | When the SDK initialization is complete, the SDK invokes the passed callback function.</br>IMPORTANT: The callback updates the page elements with the state of the identity: this is the place where you should define your logic for initiating targeted advertising.                                                                                                                                                                                                                                                                                                                                                          |
|  5   | Keep the application main page open or refresh it after awhile and note the identity state, updated counter, and login information values.                                                                                                          | In the background, the SDK continuously validates whether the advertising token is up-to-date and refreshes it automatically when needed. If the refresh succeeds, the user opts out, or the refresh token expires, the callback function is invoked and the UI elements are updated with the current state of the identity.                                                                    |
|  6   | To exit the application, click **Clear UID2** or **Clear EUID**.                                                                                                                                                                                                           | This event calls the SDK `disconnect()` function, which clears the session and the first-party cookie. This call also makes the SDK `isLoginRequired()` function return `true`, which presents the user with the login form again.<br/> NOTE: The page displays the **Clear** button as long as the user identity is valid and refreshable within the integration test environment.                                                                                                                             |