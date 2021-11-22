# UID2 Publisher Integration Example (Standard)

This example demonstrates how a content publisher can work with UID2 services and UID2 JavaScript SDK
to implement the standard UID2 publisher integration workflow (XREF).

While the server side of the example application is implemented in JavaScript using node.js, it is not
a requirement. The server side can be implemented using any technology of your choice, and you can use
the example application as a reference of the functionality that needs to be implemented.

## Building and Running the Example

The easiest way to trying the example is to rely on docker:

```
docker build . -t uid2-publisher-standard
docker run -it --rm -p 3000:3000 \
    -e UID2_BASE_URL="https://integ.uidapi.com" \
    -e UID2_API_KEY="<your-integ-API-key>" \
    uid2-publisher-standard
```

The following parameters must be specified in form of environment variables to start the application:

| Setting | Description |
| :--- | :--- |
| `UID2_BASE_URL` | Base URL of the UID2 services. For example, production uid2 services are available on `https://prod.uidapi.com` |
| `UID2_API_KEY` | Your UID2 authentication key for the UID2 service above. |

Once the application starts up successfully, you should see output similar to below:

```
> uid2-publisher@1.0.0 start /usr/src/app
> node server.js

Example app listening at http://localhost:3000
```

You should then be able to navigate to the application's main page in your browser: `http://localhost:3000`.

You can quit the application by terminating the docker container or by hitting `Ctrl+C`.

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
