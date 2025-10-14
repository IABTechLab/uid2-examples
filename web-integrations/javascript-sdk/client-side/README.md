# UID2 JavaScript SDK Client-Side Integration Example

This example demonstrates how a content publisher can follow the [Client-Side Integration Guide for JavaScript](https://unifiedid.com/docs/guides/integration-javascript-client-side) to implement UID2 integration and generate UID2 tokens.

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

- `UID_JS_SDK_URL` - URL to the UID2 JavaScript SDK (default: https://cdn.uidapi.com/sdk/uid2-sdk-3.3.0.js)
- `UID_JS_SDK_NAME` - Global variable name for the SDK (default: __uid2)
- `UID_BASE_URL` - UID2 base URL (default: https://operator-integ.uidapi.com)
- `SERVER_PUBLIC_KEY` - Server public key for UID2
- `SUBSCRIPTION_ID` - UID2 subscription ID

## Accessing the Application

Once running, access the application at: http://localhost:3032

## Features

- **Client-side UID2 integration** using the UID2 JavaScript SDK
- **Environment variable substitution** for configuration
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
