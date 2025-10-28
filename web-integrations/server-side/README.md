# Server-Side UID2 or EUID Integration Example

[This example](https://example-srvonly-integ.uidapi.com/) demonstrates how a content publisher can use either the UID2 or EUID services to implement the server-side integration workflow without using an SDK.

- For UID2: [UID2 services](https://unifiedid.com/docs/intro), [server-side UID2 integration workflow](https://unifiedid.com/docs/guides/integration-publisher-server-side)
- For EUID: [EUID services](https://euid.eu/docs/intro), [server-side EUID integration workflow](https://euid.eu/docs/guides/integration-publisher-server-side)

This example supports both UID2 and EUID environments — the behavior depends on your configured environment variables.

For an example application using the SDK, see [Client-Server UID2 or EUID Integration Example using JavaScript SDK](../javascript-sdk/client-server/README.md) or [Client-Side UID2 or EUID Integration Example using JavaScript SDK](../javascript-sdk/client-side/README.md).

>NOTE: While the server side of the example application is implemented in JavaScript using node.js, it is not a requirement. You can use any technology of your choice and refer to the example application for illustration of the functionality that needs to be implemented.

## Build and Run the Example Application

### Using Docker Compose (Recommended)

From the repository root directory:

```bash
docker compose up server-side
```

The application will be available at http://localhost:3033

### Using Docker Build

```bash
docker build -f web-integrations/server-side/Dockerfile -t server-side .
docker run -it --rm -p 3033:3033 --env-file .env server-side
```

The following table lists the environment variables that you must specify to start the application.

### Core Configuration

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `UID_SERVER_BASE_URL` | The base URL of the UID2/EUID service. For details, see [Environments](https://unifiedid.com/docs/getting-started/gs-environments) (UID2) or [Environments](https://euid.eu/docs/getting-started/gs-environments) (EUID). | UID2: `https://operator-integ.uidapi.com`<br/>EUID: `https://integ.euid.eu/v2` |
| `UID_API_KEY` | Authentication key for accessing UID2/EUID services. Provided via the UID2 Partner Portal or your integration representative. | Your assigned API key |
| `UID_CLIENT_SECRET` | Private key used with your API key to authenticate your app with UID2/EUID services. Provided via the UID2 Partner Portal or your integration representative. | Your assigned client secret |
| `SESSION_KEY` | The key to the encryption session data stored in the application session cookie. This can be any arbitrary string. | Any secure random string |

### Display/UI Configuration

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `IDENTITY_NAME` | Identity name for UI display | UID2: `UID2`<br/>EUID: `EUID` |
| `DOCS_BASE_URL` | Documentation base URL | UID2: `https://unifiedid.com/docs`<br/>EUID: `https://euid.eu/docs` |

After you see output similar to the following, the example application is up and running.

```
> uid2-publisher@1.0.0 start /usr/src/app
> node server.js

Example app listening at http://localhost:3033
```

If needed, to close the application, terminate the docker container or use the `Ctrl+C` keyboard shortcut.

## Test the Example Application

The example application illustrates the steps documented in the server-side integration guides:
- UID2: [Server-Side Integration Guide](https://unifiedid.com/docs/guides/integration-publisher-server-side)
- EUID: [Server-Side Integration Guide](https://euid.eu/docs/guides/integration-publisher-server-side)

**Note:** For API endpoint documentation, see the UID2 or EUID docs based on your configuration.

The application provides three main pages: index (main), example content 1, and example content 2. Access to these pages is possible only after the user completes the login process. If the user is not logged in, they will be redirected to the login page.

Submitting the login form simulates logging in to a publisher's application in the real world. Normally the login
would require checking the user's secure credentials (for example, a password), but for demonstration purposes this
step is omitted, and the login process focuses on integration with the UID2/EUID services instead.

The following table outlines and annotates the steps you may take to test and explore the example application.

| Step | Description                                                                                                                   | Comments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|:----:|:------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|  1   | In your browser, navigate to the application main page at `http://localhost:3033`.                                            | The displayed main (index) page of the example application provides a [login form](views/login.html) for the user to complete the UID2/EUID login process.</br>IMPORTANT: A real-life application must also display a form for the user to express their consent to targeted advertising.                                                                                                                                                                                                                                                                                                                                                                                                            |
|  2   | Enter the user email address that you want to use for testing and click **Log In**.                                           | This is a call to the `/login` endpoint ([server.js](server.js)). The login initiated on the server side then calls the POST /token/generate endpoint and processes the received response.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|      | The main page is updated to display links to the two pages with protected content and the established identity information. | The displayed identity information is the `body` property of the JSON response payload from the successful POST /token/generate response. If the response is successful, the returned identity is saved to a session cookie (a real-world application would use a different way to store session data) and the protected index page is rendered.                                                                                                                                                                                                                                                                                                                   |
|  3   | Click either of the two sample content pages.                                                                                                         | When the user requests the index or content pages, the server reads the user session and extracts the current identity ([server.js](server.js)). The `advertising_token` on the identity can be used for targeted advertising.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|  4   | Click the **Back to the main page** link.                                                                                     | Note that the identity contains several timestamps that determine when the advertising token becomes invalid (`identity_expires`) and when the server should attempt to refresh it (`refresh_from`). Every time a protected page is requested, the `verifyIdentity` function ([server.js](server.js)) calls POST /token/refresh as needed.<br/>The user is automatically logged out in the following cases:<br/>- If the identity expires without being refreshed and refresh attempt fails.<br/>- If the refresh token expires.<br/>- If the refresh attempt indicates that the user has opted out. |
|  5   | To exit the application, click **Log Out**.                                                                                   | This calls the `/logout` endpoint on the server ([server.js](server.js)), which clears the session and the first-party cookie and presents the user with the login form again.<br/> NOTE: The page displays the **Log Out** button as long as the user is logged in.                                                                                                                                                                                                                                                                                                                                                                                                                       |
