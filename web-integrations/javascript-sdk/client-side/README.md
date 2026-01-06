# Client-Side UID2 or EUID Integration Example using JavaScript SDK

This example demonstrates how a content publisher can follow the Client-Side Integration Guide for JavaScript to implement either a UID2 or EUID integration and generate tokens on the client side.

- For UID2: [Client-Side Integration Guide for JavaScript](https://unifiedid.com/docs/guides/integration-javascript-client-side), [UID2 SDK for JavaScript](https://unifiedid.com/docs/sdks/sdk-ref-javascript)
- For EUID: [EUID Client-Side Integration Guide for JavaScript](https://euid.eu/docs/guides/integration-javascript-client-side), [EUID SDK for JavaScript](https://euid.eu/docs/sdks/sdk-ref-javascript)

This example can be configured for either UID2 or EUID — the behavior is determined by your environment variable configuration. You cannot use both simultaneously.

## Running with Docker

### Using Docker Compose (Recommended)

From the repository root directory:

```bash
# Start the service
docker compose up javascript-sdk-client-side
```

The application will be available at http://localhost:3031

To view logs or stop the service:

```bash
# View logs (in another terminal)
docker compose logs javascript-sdk-client-side

# Stop the service
docker compose stop javascript-sdk-client-side
```

## Environment Variables

The application uses environment variables from the `.env` file in the base directory:

### Core Configuration

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `UID_JS_SDK_URL` | URL to the UID2/EUID JavaScript SDK | UID2: `https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js`<br/>EUID: `https://cdn.integ.euid.eu/euid-sdk-4.0.1.js` |
| `UID_JS_SDK_NAME` | Global variable name for the SDK | UID2: `__uid2`<br/>EUID: `__euid` |
| `UID_CLIENT_BASE_URL` | API base URL for client-side/browser calls | UID2: `https://operator-integ.uidapi.com` or `http://localhost:8080`<br/>EUID: `https://integ.euid.eu/v2` |
| `UID_BASE_URL` | Fallback API base URL (used if `UID_CLIENT_BASE_URL` not set) | Same as above |
| `UID_CSTG_SERVER_PUBLIC_KEY` | Your server public key for client-side token generation for the UID2/EUID service specified in UID_BASE_URL. | Your assigned server public key |
| `UID_CSTG_SUBSCRIPTION_ID` | Your subscription ID for client-side token generation for the UID2/EUID service specified in UID_BASE_URL. | Your assigned subscription ID |

### Display/UI Configuration

| Variable | Description | Example Values |
|:---------|:------------|:---------------|
| `IDENTITY_NAME` | Identity name for UI display | UID2: `UID2`<br/>EUID: `EUID` |
| `DOCS_BASE_URL` | Documentation base URL | UID2: `https://unifiedid.com/docs`<br/>EUID: `https://euid.eu/docs` |

## Accessing the Application

Once running, access the application at: http://localhost:3032

## Features

- **Client-side UID2/EUID integration** using the UID2/EUID JavaScript SDK
- **Dynamic product configuration** - supports both UID2 and EUID via environment variables
- **Environment variable substitution** for all configuration and UI text
- **Nginx-based static file serving**
- **Docker containerization** for easy deployment

## Development

To modify the application:

1. Edit the HTML files in the `html/` directory
2. Update the CSS in `html/stylesheets/app.css`
3. Rebuild the Docker image to see changes

## Notes

- This is a **test-only** integration environment—not for production use
- It does not perform real user authentication or generate production-level tokens
- Do not use real user data on this page
