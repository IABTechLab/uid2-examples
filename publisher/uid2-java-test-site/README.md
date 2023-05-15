# Java UID2 Integration Example

This example demonstrates how a content publisher can use the [UID2 Java SDK](https://github.com/IABTechLab/uid2-client-java) to implement [UID2 Publisher integrations](https://unifiedid.com/docs/guides/summary-guides).


>NOTE: While the server side of this example application is implemented in Java using Vert.x, it is not a requirement. You can use any technology of your choice and refer to the example application for illustration of the functionality that needs to be implemented.

## Build and Run the Example Application

To try the example, set the following environment variables:

| Parameter         | Data Type | Description                                                                                                                                                                                                            |
|:------------------|:----------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `UID2_BASE_URL`   | string    | The base URL of the UID2 service. For example:</br>Testing environment: `https://operator-integ.uidapi.com`<br/>For details, see [Environments](https://unifiedid.com/docs/getting-started/gs-environments). |
| `UID2_API_KEY`    | string    | Your UID2 authentication key for the UID2 service specified in `UID2_BASE_URL`.                                                                                                                                        |                                                                          |
| `UID2_SECRET_KEY` | string    | Your UID2 client secret for the UID2 service specified in `UID2_BASE_URL`.                                                                                                                                             |                                                                           |
| `UID2_PORT`       | string    | Optional. The port for this example's HTTP server. Defaults to 3000.                                                                                                                                                   |                                                                           |

Once the environment variables are set, use the following command:

```
./mvnw clean compile exec:java
```

After you see output similar to the following, the example application is up and running.

```
HTTP server started on http://localhost:3000
```


## Test the Example Application

The example application illustrates the steps documented in the [Server-Only UID2 Integration Guide](https://unifiedid.com/docs/guides/custom-publisher-integration).

The application provides three main pages: index (main), example content 1, and example content 2. Access to these pages is possible only after the user completes the login process. If the user is not logged in, they will be redirected to the login page.

Submitting the login form simulates logging in to a publisher's application in the real world. Normally the login
would require checking the user's secure credentials (for example, a password), but for demonstration purposes this
step is omitted, and the login process focuses on integration with the UID2 services instead.

The following table outlines and annotates the steps you may take to test and explore the example application.

| Step | Description                                                                                                                      | Comments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|:----:|:---------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|  1   | In your browser, navigate to the application main page at `http://localhost:3000`.                                               | The displayed main (index) page of the example application provides a login form for the user to complete the UID2 login process.</br>IMPORTANT: A real-life application must also display a form for the user to express their consent to targeted advertising.                                                                                                                                                                                                                                                                                                                                                                                                       |
|  2   | Enter the user email address that you want to use for testing and click **Log In**.                                              | This is a call to the `/login` endpoint. The login initiated on the server side then calls the [POST /token/generate](https://unifiedid.com/docs/endpoints/post-token-generate) endpoint and processes the received response.                                                                                                                                                                                                                                                                                                                                                                           |
|      | The main page is updated to display links to the two pages with protected content and the established UID2 identity information. | The displayed identity information is the `body` property of the [JSON response payload](https://unifiedid.com/docs/endpoints/post-token-generate#decrypted-json-response-format) from the successful `POST /token/generate` response. If the response is successful, the returned identity is saved to a session cookie (a real-world application would use a different way to store session data) and the protected index page is rendered.                                                                                                                                                                                          |
|  3   | Click either of the two sample content pages.                                                                                    | When the user requests the index or content pages, the server reads the user session and extracts the current UID2 identity. The `advertising_token` on the identity can be used for targeted advertising.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|  4   | Click the **Back to the main page** link.                                                                                        | Note that the identity contains several timestamps that determine when the advertising token becomes invalid (`identity_expires`) and when the server should attempt to refresh it (`refresh_from`). Every time a protected page is requested, the `verifyIdentity` function calls [POST /token/refresh](https://unifiedid.com/docs/endpoints/post-token-refresh) as needed.<br/>The user is automatically logged out in the following cases:<br/>- If the identity expires without being refreshed and refresh attempt fails.<br/>- If the refresh token expires.<br/>- If the refresh attempt indicates that the user has opted out. |
|  5   | To exit the application, click **Log Out**.                                                                                      | This calls the `/logout` endpoint on the server, which clears the UID2 session and the first-party cookie and presents the user with the login form again.<br/> NOTE: The page displays the **Log Out** button as long as the user is logged it.                                                                                                                                                                                                                                                                                                                                                                                                                       |
