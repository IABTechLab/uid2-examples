# Client-Side UID2/EUID Integration Example using JavaScript SDK

This example demonstrates how a content publisher can follow the [Client-Side Integration Guide for JavaScript](https://unifiedid.com/docs/guides/integration-javascript-client-side) (UID2) or [EUID Client-Side Integration Guide for JavaScript](https://euid.eu/docs/guides/integration-javascript-client-side) (EUID) to implement UID2/EUID integration and generate UID2/EUID tokens.

## Running with Docker

### Using Docker Compose (Recommended)

From the base directory:

```bash
# Start the service
docker-compose up -d javascript-sdk-client-side

# View logs
docker-compose logs javascript-sdk-client-side

# Stop the service
docker-compose down javascript-sdk-client-side
```

### Using Docker directly

From the base directory:

```bash
# Build the image
docker build -f web-integrations/javascript-sdk/client-side/Dockerfile -t javascript-sdk-client-side .

# Run the container
docker run -p 3032:3032 --env-file .env javascript-sdk-client-side
```

## Environment Variables

The application uses environment variables from the `.env` file in the base directory:

### Core Configuration
- `UID2_JS_SDK_URL` - URL to the UID2/EUID JavaScript SDK
  - UID2 default: `https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js`
  - EUID example: `https://cdn.integ.euid.eu/euid-sdk-4.0.1.js`
- `UID2_JS_SDK_NAME` - Global variable name for the SDK
  - UID2: `__uid2`
  - EUID: `__euid`
- `UID2_BASE_URL` - API base URL
  - UID2 default: `https://operator-integ.uidapi.com`
  - EUID example: `https://integ.euid.eu/v2`
- `UID2_CSTG_SERVER_PUBLIC_KEY` - Server public key for client-side token generation
- `UID2_CSTG_SUBSCRIPTION_ID` - Subscription ID for client-side token generation

### Display/UI Configuration
- `PRODUCT_NAME` - Product name for UI display (default: `UID2`, or `EUID`)
- `DOCS_BASE_URL` - Documentation base URL (default: `https://unifiedid.com/docs`, or `https://euid.eu/docs`)

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
