# Client-Side UID2 or EUID Integration Example with Prebid.js

This example demonstrates how to integrate UID2 or EUID with Prebid.js using client-side token generation (CSTG), where tokens are generated directly in the browser. For additional documentation, see:

- UID2: [UID2 Client-Side Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-side)
- EUID: [EUID Client-Side Integration Guide for Prebid.js](https://euid.eu/docs/guides/integration-prebid-client-side)

This example can be configured for either UID2 or EUID — the behavior is determined by your environment variable configuration. You cannot use both simultaneously.

> **IMPORTANT:** This implementation requires Prebid.js version **8.42.0 or later**.

## Viewing live site

To view this example running live:
- UID2: [https://unifiedid.com/examples/cstg-prebid-example/](https://unifiedid.com/examples/cstg-prebid-example/)
- EUID: [https://euid.eu/examples/cstg-prebid-example/](https://euid.eu/examples/cstg-prebid-example/)

## Build and Run the Example Application

### Using Docker Compose (Recommended)

From the repository root directory:

```bash
# Start the service
docker compose up prebid-client
```

The application will be available at http://localhost:3051

To view logs or stop the service:

```bash
# View logs (in another terminal)
docker compose logs prebid-client

# Stop the service
docker compose stop prebid-client
```

### Using Docker Build

```bash
# Build the image
docker build -f web-integrations/prebid-integrations/client-side/Dockerfile -t prebid-client-side .

# Run the container
docker run -it --rm -p 3051:3051 --env-file .env prebid-client-side
```

The following table lists the environment variables that you must specify to start the application.

### UID2/EUID Configuration

These variables configure the connection to UID2/EUID services for token generation.

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `UID_CLIENT_BASE_URL` | API base URL for client-side/browser calls. For details, see [Environments](https://unifiedid.com/docs/getting-started/gs-environments) (UID2) or [Environments](https://euid.eu/docs/getting-started/gs-environments) (EUID). | UID2: `https://operator-integ.uidapi.com`<br/>EUID: `https://integ.euid.eu` |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for client-side token generation for the UID2/EUID service specified in UID_CLIENT_BASE_URL. | Your assigned subscription ID |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for client-side token generation for the UID2/EUID service specified in UID_CLIENT_BASE_URL. | Your assigned server public key |

### Display/Prebid Configuration

These variables control UI display and how Prebid stores/retrieves tokens.

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `IDENTITY_NAME` | Identity name for UI display | UID2: `UID2`<br/>EUID: `EUID` |
| `DOCS_BASE_URL` | Documentation base URL | UID2: `https://unifiedid.com/docs`<br/>EUID: `https://euid.eu/docs` |
| `UID_STORAGE_KEY` | localStorage key where Prebid stores and retrieves tokens in the browser | UID2: `__uid2_advertising_token`<br/>EUID: `__euid_advertising_token` |

**Note:** These variables are substituted into the HTML during the Docker build process using `envsubst`. If a variable is not set in the `.env` file, default values are used.

## Test the Example Application

The example application illustrates the steps documented in the integration guides. For an overview of the high-level workflow, API reference, and integration details, see:
- UID2: [UID2 Client-Side Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-side)
- EUID: [EUID Client-Side Integration Guide for Prebid.js](https://euid.eu/docs/guides/integration-prebid-client-side)

**Note:** This example uses client-side token generation (CSTG), where Prebid handles token generation directly in the browser. For API endpoint documentation, see the UID2 or EUID docs based on your configuration.

| Step | Description | Comments |
| :--: | :---------- | :------- |
| 1 | In your browser, navigate to the application main page at `http://localhost:3051`. | The displayed main ([index.html](index.html)) page provides a form for the user to enter their email and generate an identity token. |
| 2 | Enter an email address and click **Generate UID2** or **Generate EUID**. | Prebid.js handles token generation using the configured CSTG parameters. The token is generated client-side and stored in localStorage. |
| 3 | Open the browser console (F12 or right-click > Inspect) and run `pbjs.getUserIds()`. | You should see the identity object with either a `uid2` or `euid` property containing the advertising token. |
| 4 | Refresh the page and note the token persists. | The identity is loaded from localStorage on page load and automatically configured in Prebid. |
| 5 | To exit the application, click **Clear UID2** or **Clear EUID**. | This clears the identity from localStorage and resets the UI. |

## How It Works

This example uses **client-side token generation (CSTG)**, where Prebid.js handles the entire token generation process in the browser:

1. User enters their email address
2. Prebid.js is configured with CSTG parameters (`subscriptionId`, `serverPublicKey`, `email`)
3. Prebid automatically generates the token by calling the UID2/EUID service
4. The token is stored in localStorage
5. Prebid includes the identity in all bid requests

For EUID, TCF2 consent management is also configured to ensure GDPR compliance.

## Prebid.js

This example includes a custom build of Prebid.js v10.15.0 with the necessary modules for UID2/EUID integration:

- [Unified ID 2.0](https://docs.prebid.org/dev-docs/modules/userid-submodules/unified2.html)
- [European Unified ID](https://docs.prebid.org/dev-docs/modules/userid-submodules/euid.html)
- [TCF Consent Management Module](https://docs.prebid.org/dev-docs/modules/consentManagementTcf.html)

For general Prebid.js information, see [Prebid.js Documentation](https://docs.prebid.org/).
