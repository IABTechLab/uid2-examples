# Client-Side UID2 SDK Integration Example with Prebid.js

## Viewing live site

This example demonstrates the [UID2 Client-Side Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-side). 

To view the site running, navigate to [https://unifiedid.com/examples/cstg-prebid-example/](https://unifiedid.com/examples/cstg-prebid-example/).

## Running with Docker

To run this example using Docker:

```bash
# Build the Docker image
docker build -t prebid-client-side .

# Run the container on port 3031
docker run -p 3031:3031 prebid-client-side
```

Then navigate to [http://localhost:3031](http://localhost:3031) to view the application.

### Local Development with Custom Settings

The application automatically reads configuration from the `.env` file in the sample directory and substitutes the values into the HTML:

1. **Edit the `env` file** in the sample directory (`.env`) to set your local values:
   ```
   UID2_BASE_URL="http://localhost:8080"
   SERVER_PUBLIC_KEY="your-local-public-key"
   SUBSCRIPTION_ID="your-local-subscription-id"
   ```

2. **Build and run the Docker container:**
   ```bash
   docker build -t prebid-client-side .
   docker run -p 3031:3031 prebid-client-side
   ```

3. **Alternative: Use browser dev tools** (for quick testing):
   ```javascript
   // In browser console before page load
   window.uid2_example_settings.UID2_BASE_URL = 'https://your-local-uid2-operator.com';
   ```

The Docker build process automatically reads the `.env` file and substitutes the values into the HTML using `envsubst`. If a variable is not set in the `env` file, it uses the default values (after the `:-` in the substitution syntax).


## Prebid.js

This file is a build of Prebid.js with the userId, uid2IdSystem and appnexusBidAdapter modules included.