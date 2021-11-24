# UID2 Publisher Integration Example (Custom, Server Only)

This example demonstrates how a content publisher can work with UID2 services to implement UID2 publisher
custom integration workflow (XREF).

While the example application is implemented in JavaScript using node.js, it is not  a requirement.
One can be implement a UID2-enabled application using any technology of their choice, and use this
example as a reference of the functionality that needs to be considered.

## Building and Running the Example

The easiest way to trying the example is to rely on docker:

```
docker build . -t uid2-publisher-server
docker run -it --rm -p 3000:3000 \
    -e UID2_BASE_URL="https://integ.uidapi.com" \
    -e UID2_API_KEY="<your-integ-API-key>" \
    -e SESSION_KEY="my-session-key" \
    uid2-publisher-server
```

The following parameters must be specified in form of environment variables to start the application:

| Setting | Description |
| :--- | :--- |
| `UID2_BASE_URL` | Base URL of the UID2 services. For example, production uid2 services are available on `https://prod.uidapi.com` |
| `UID2_API_KEY` | Your UID2 authentication key for the UID2 service above. |
| `SESSION_KEY` | Key to encryption session data stored in application's session cookie. |

Once the application starts up successfully, you should see output similar to below:

```
> uid2-publisher@1.0.0 start /usr/src/app
> node server.js

Example app listening at http://localhost:3000
```

You should then be able to navigate to the application's main page in your browser: `http://localhost:3000`.

You can quit the application by terminating the docker container or by hitting `Ctrl+C`.

## Key Points

Example follows the steps of the UID2 publisher custom integration workflow (XREF).

The application provides three main pages: index, content1 and content2. Access to these pages is only
possible after user completes the login process. If user is not logged in, they will be redirected to
the login page.

Submitting the login form simulates a real world login into publisher's application. Normally the login
would require checking user secure credentials (e.g. password), but for the sake of demonstration this
step is omitted and instead the login process focuses on integration with UID2 services. The `/login` 
handler on the server side (XREF to server.js) will call `GET /token/generate` (XREF) and process
the received response.  If the response indicates success, the returned identity (`body` properity of
the response JSON) will be saved to session cookie (a real world application would use a different way
to store session data) and render the "protected" index page.

When index and content pages are requested from the server, the server reads user session and extracts
the current UID2 identity from there. The `advertising_token` on the identity can be used for targeted
advertising.

Notice that the identity contains a number of timestamps which determine when the advertising token
becomes invalid (`identity_expires`) as well as the timestamp from which the server is recommended
to attempt to refresh it (`refresh_from`). The `verifyIdentity` function (XREF to server.js) will call
`GET /token/refresh` (XREF) as needed every time a protected page is requested. If the identity expires
without being refreshed and refresh fails, or if refresh token expires, or if the refresh indicates that
the user has opted out, the user will get automatically logged out.

While the user is logged in, they will be provided with a button to log out of the publisher's application.
Pressing the button would hit the `/logout` endpoint on the server (XREF to server.js) which would clear
the user session and redirect them back to the login page.
