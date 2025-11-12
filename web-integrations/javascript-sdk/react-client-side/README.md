# React Client-Side UID2 or EUID Integration Example using JavaScript SDK

This example demonstrates how to integrate the UID2 or EUID JavaScript SDK into a React application using Client-Side Token Generation (CSTG).


## Build and Run

You can run this example application in the following ways:
- [Run Using Docker](#run-using-docker)
- [Run Using npm](#run-using-npm)

### Run Using Docker

The easiest way to run the example is to use Docker Compose. To do this, follow the steps below:

1. From the root directory (`uid2-examples/`), create a `.env` file based on the provided template `.env.sample.uid2` or `.env.sample.euid`.

2. In the `.env` file, add your UID2 or EUID credentials (CSTG subscription ID and server public key).

3. Build and run the Docker Compose file `docker-compose.yml`:

   ```sh
   docker compose up --build javascript-sdk-react-client-side
   ```

4. Open your browser and navigate to `http://localhost:3034`.

> **Note:** To stop the application, press Ctrl+C in the terminal where you ran `docker compose up`, then run `docker compose down` to remove the containers.

### Run Using npm

Alternatively, you can run the example using npm for faster development:

1. From the root directory (`uid2-examples/`), create a `.env` file based on the provided template `.env.sample.uid2` or `.env.sample.euid`.

2. In the `.env` file, add your UID2 or EUID credentials (CSTG subscription ID and server public key).

3. Navigate to the example directory:

   ```sh
   cd web-integrations/javascript-sdk/react-client-side
   ```

4. Install dependencies:

   ```sh
   npm install
   ```

5. Start the application:

   ```sh
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3034`.

> **Note:** When running with npm, the application automatically loads environment variables from the root `.env` file using `dotenv-cli`. This approach is faster for local development compared to Docker.

## Configuration

The following environment variables must be set in your `.env` file:

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `REACT_APP_UID_JS_SDK_URL` | URL to the UID2/EUID JavaScript SDK | UID2: `https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js`<br/>EUID: `https://cdn.integ.euid.eu/euid-sdk-4.0.1.js` |
| `REACT_APP_UID_CLIENT_BASE_URL` | Base URL for the UID2/EUID operator | UID2: `https://operator-integ.uidapi.com`<br/>EUID: `https://integ.euid.eu` |
| `REACT_APP_UID_CSTG_SUBSCRIPTION_ID` | Your CSTG subscription ID | Your assigned subscription ID |
| `REACT_APP_UID_CSTG_SERVER_PUBLIC_KEY` | Your CSTG server public key | UID2: `UID2-X-...`<br/>EUID: `EUID-X-...` |
| `REACT_APP_UID_JS_SDK_NAME` | Global variable name for the SDK | UID2: `__uid2`<br/>EUID: `__euid` |
| `REACT_APP_IDENTITY_NAME` | Display name for the identity type | UID2: `UID2`<br/>EUID: `EUID` |
| `REACT_APP_DOCS_BASE_URL` | Documentation base URL | UID2: `https://unifiedid.com/docs`<br/>EUID: `https://euid.eu/docs` |

## Test the Example Application

The example application illustrates the steps documented in the Client-Side Integration guides:
- UID2: [Client-Side Integration Guide for JavaScript](https://unifiedid.com/docs/guides/integration-javascript-client-side)
- EUID: [Client-Side Integration Guide for JavaScript](https://euid.eu/docs/guides/integration-javascript-client-side)

The following table outlines the steps you can take to test and explore the example application.

| Step | Description | Comments |
| :--: | :---------- | :------- |
|  1   | In your browser, navigate to the application main page at `http://localhost:3034`. | The main page displays a login form for the user to complete the UID2/EUID login process.<br/>**IMPORTANT:** A real-life application must also display a form for the user to express their consent to targeted advertising. |
|  2   | Enter an email address in the text field and click **Generate UID2** or **Generate EUID**. | The button label depends on your environment configuration. This makes a client-side call to the `setIdentityFromEmail` function of the JavaScript SDK. |
|  3   | The page updates to display the established identity information. | The displayed identity information shows the advertising token and identity state. The SDK stores the identity in local storage or a first-party cookie for use on subsequent page loads. |
|  4   | (Optional) Inspect the page state and console logs. | When SDK initialization is complete, the SDK invokes the callback function. The callback updates the page elements with the current state of the identity. This is where you should define your logic for initiating targeted advertising. |
|  5   | Keep the page open or refresh it after a while and note the identity state and updated counter. | In the background, the SDK continuously validates whether the advertising token is up-to-date and refreshes it automatically when needed. If the refresh succeeds, the user opts out, or the refresh token expires, the callback function is invoked and the UI elements are updated. |
|  6   | To clear the identity, click **Clear UID2** or **Clear EUID**. | This calls the SDK `disconnect()` function, which clears the session and the first-party cookie or local storage. The SDK `isLoginRequired()` function returns `true`, presenting the user with the login form again. |

## License

This example is provided under the Apache License 2.0. See the [LICENSE](../../../LICENSE) file for details.
