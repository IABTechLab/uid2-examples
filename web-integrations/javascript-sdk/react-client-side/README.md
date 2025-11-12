# React Client-Side UID2/EUID Integration Example using JavaScript SDK

This example demonstrates how to integrate the UID2/EUID JavaScript SDK into a React application using Client-Side Token Generation (CSTG).

## Features

- **Client-Side Token Generation**: Uses public credentials (subscription ID and server public key) to generate tokens directly in the browser
- **React Integration**: Demonstrates SDK usage within a modern React application
- **Automatic Token Refresh**: The SDK handles token refresh automatically
- **Identity Management**: Shows how to manage user identity lifecycle (login/logout)

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

| Variable | Description | Example (UID2) | Example (EUID) |
|:---------|:------------|:---------------|:---------------|
| `REACT_APP_UID_JS_SDK_URL` | URL to the UID2/EUID JavaScript SDK | `https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js` | `https://cdn.integ.euid.eu/euid-sdk-4.0.1.js` |
| `REACT_APP_UID_CLIENT_BASE_URL` | Base URL for the UID2/EUID operator | `https://operator-integ.uidapi.com` | `https://integ.euid.eu` |
| `REACT_APP_UID_CSTG_SUBSCRIPTION_ID` | Your CSTG subscription ID | `your-subscription-id` | `your-subscription-id` |
| `REACT_APP_UID_CSTG_SERVER_PUBLIC_KEY` | Your CSTG server public key | `UID2-X-...` | `EUID-X-...` |
| `REACT_APP_UID_JS_SDK_NAME` | Global variable name for the SDK | `__uid2` | `__euid` |
| `REACT_APP_IDENTITY_NAME` | Display name for the identity type | `UID2` | `EUID` |
| `REACT_APP_DOCS_BASE_URL` | Documentation base URL | `https://unifiedid.com/docs` | `https://euid.eu/docs` |

## How It Works

### SDK Loading and Initialization

The React application dynamically loads the SDK from a CDN and initializes it with the configured base URL:

```typescript
// Load SDK script dynamically
useEffect(() => {
  if (window[UID_JS_SDK_NAME]) {
    // SDK already loaded, initialize it
    const sdk = window[UID_JS_SDK_NAME];
    sdk.callbacks = sdk.callbacks || [];
    sdk.callbacks.push(onIdentityUpdated);
    if (sdk.init) {
      sdk.init({ baseUrl: UID_BASE_URL });
    }
    return;
  }

  // Load SDK script
  const script = document.createElement('script');
  script.src = UID_JS_SDK_URL;
  script.onload = () => {
    const sdk = window[UID_JS_SDK_NAME];
    if (sdk) {
      sdk.callbacks = sdk.callbacks || [];
      sdk.callbacks.push(onIdentityUpdated);
      sdk.init({ baseUrl: UID_BASE_URL });
    }
  };
  document.head.appendChild(script);
}, [onIdentityUpdated]);
```

### Identity Management

The application uses SDK callbacks to monitor identity changes:

```typescript
const onIdentityUpdated = useCallback(
  (eventType, payload) => {
    console.log(`${IDENTITY_NAME} Callback: ${eventType}`, payload);
    if (
      payload?.identity &&
      (eventType === 'InitCompleted' || eventType === 'IdentityUpdated')
    ) {
      setUpdateCounter((prev) => prev + 1);
    }
    updateGuiElements(payload);
  },
  [updateGuiElements]
);
```

### Token Generation

To generate a token from an email address:

```typescript
const handleLogin = async () => {
  try {
    await getSDK().setIdentityFromEmail(email, clientSideIdentityOptions);
  } catch (e) {
    console.error('setIdentityFromEmail failed', e);
  }
};
```

### Logout

To clear the identity and disconnect:

```typescript
const handleLogout = () => {
  getSDK().disconnect();
  updateGuiElements(undefined);
};
```

## License

This example is provided under the Apache License 2.0. See the [LICENSE](../../../LICENSE) file for details.
