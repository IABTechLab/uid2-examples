# Example Prebid.js UID2 Integration

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

For local development, you can override the default settings by editing the `config.js` file:

1. **Edit `config.js`** - Uncomment and modify the lines for your local environment:
   ```javascript
   // Uncomment these lines in config.js:
   window.UID2_BASE_URL = 'https://your-local-uid2-operator.com';
   window.SERVER_PUBLIC_KEY = 'your-local-public-key';
   window.SUBSCRIPTION_ID = 'your-local-subscription-id';
   ```

2. **Rebuild and run the Docker container:**
   ```bash
   docker build -t prebid-client-side .
   docker run -p 3031:3031 prebid-client-side
   ```

3. **Alternative: Use browser dev tools** (for quick testing):
   ```javascript
   // In browser console before page load
   window.UID2_BASE_URL = 'https://your-local-uid2-operator.com';
   ```

The `config.js` file includes example configurations for different environments (local, test, staging).


## Prebid.js

This file is a build of Prebid.js with the userId, uid2IdSystem and appnexusBidAdapter modules included.