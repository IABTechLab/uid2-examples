# UID2 Publisher Integration Example (Standard)

This example demonstrates how a content publisher can use the UID2 services and the [Client-Side Identity JavaScript SDK](../uid2docs/blob/main/api/v1/sdks/client-side-identity-v1.md), also known as the UID2 SDK, to implement the [standard UID2 publisher integration workflow](../uid2docs/blob/main/api/v1/guides/publisher-client-side.md).

>NOTE: While the server side of the example application is implemented in JavaScript using node.js, it is not
a requirement. You can use any technology of your choice and refer to the example application for the functionality that needs to be implemented.

## Build the Example Application

The easiest way to try the example is to use the following docker build command:

```
docker build . -t uid2-publisher-standard
docker run -it --rm -p 3000:3000 \
    -e UID2_BASE_URL="https://integ.uidapi.com" \
    -e UID2_API_KEY="<your-integ-API-key>" \
    uid2-publisher-standard
```

The following table lists the environment variables that you must specify to start the application.

| Parameter | Data Type | Description |
| :--- | :--- | :--- |
| `UID2_BASE_URL` | string | The base URL of the UID2 service. For example:</br>Testing environment: `https://integ.uidapi.com`<br/>Production environment: `https://prod.uidapi.com` |
| `UID2_API_KEY` | string | Your UID2 authentication key for the UID2 service specified in `UID2_BASE_URL`. |

## Run the Example Application

After you see output similar to the following, the example application is up and running.

```
> uid2-publisher@1.0.0 start /usr/src/app
> node server.js

Example app listening at http://localhost:3000
```
To use the example application, do the following:

1. In you browser, navigate to the application main page at `http://localhost:3000`. The example application interface appears.
2. In the text field, at the bottom, enter the user email address you want to use for testing and click **Login**. TBD - should be Log in (2 words).</br>A confirmation message appears with the established UID2 identity information returned by the [GET /token/generate](../uid2docs/blob/main/api/v1/endpoints/get-token-generate.md) API call.
3. Click the **Go back the main page** link.
4. On the updated application page, note the newly populated **UID2 Advertising Token** value.
5. Explore the application by inspecting the code, noting the number of auto-refresh counter updates. TBD
6. To exit the application, click **Logout** (TBD - 2 words). Alternatively, terminate the docker container or use the `Ctrl+C` keyboard shortcut.


## Key Points

Example follows the steps of the UID2 publisher integration workflow (XREF).

The index page provides a login form for the user to complete the UID2 login process. A real application
would need to display information for user to express their consent to targeted advertising.

Once the user supplies their email address and hit the `Login` button, they will hit the `/login` endpoint (XREF to server.js).
The login process on the server side will call `GET /token/generate` (XREF) and process the received response.
If the response indicates success, the returned identity (`body` properity of the response JSON) will be passed
to the `login` view (XREF to file) for rendering client side JavaScript.

The client side JavaScript calls the UID2 client SDK `init()` function passing it the identity from `/token/generate`.
If the identity is valid, it will be stored in a first party UID2 cookie for use on subsequent page loads.

Next the user can navigate back to the main (index) page. The page view (XREF to index view) calls the `init()`
function this time without passing an explicit identity, requesting for it to be loaded from the first party cookie
instead. When the UID2 finishes initialising, it will invoke the passed callback function `onUid2IdentityUpdated()`.
The callback will update the page elements with the state of UID2 identity: it is the place where one should place
their logic for initiating targeted advertising.

As the user keeps the page open or as they keep refreshing it over time, the UID2 JavaScript SDK will be validating
whether the advertising token is up-to-date and refresh it automatically when needed. If the refresh succeeds, or
if the user opts out, or the refresh token expires, the callback function will be invoked and the UI elements
will be updated with the current state of UID2 identity.

While the user identity is valid (refreshable), the page will display a logout button. User clicking the button
would lead to UID2 SDK `disconnect()` function being called which would clear the UID2 session and the first party
cookie. User will be presented with the login form again.
