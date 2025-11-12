# React Client-Side UID2/EUID Integration Example using JavaScript SDK

This example demonstrates how to integrate the UID2/EUID JavaScript SDK into a React application using Client-Side Token Generation (CSTG).

## Features

- Client-side token generation using public credentials (Subscription ID + Server Public Key)
- React-based UI matching the vanilla JavaScript example
- Real-time identity state updates
- Support for both UID2 and EUID

## Prerequisites

- Node.js 18+ installed
- UID2 or EUID credentials (Subscription ID and Server Public Key)

## Environment Variables

Configure these in your `.env` file at the root of the repository:

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_UID_JS_SDK_URL` | URL to the UID2/EUID SDK CDN | Yes |
| `REACT_APP_UID_JS_SDK_NAME` | SDK global variable name (`__uid2` or `__euid`) | Yes |
| `REACT_APP_UID_CLIENT_BASE_URL` | Base URL for the UID2/EUID service | Yes |
| `REACT_APP_UID_CSTG_SUBSCRIPTION_ID` | Your CSTG subscription ID | Yes |
| `REACT_APP_UID_CSTG_SERVER_PUBLIC_KEY` | Your CSTG server public key | Yes |
| `REACT_APP_IDENTITY_NAME` | Display name (`UID2` or `EUID`) | Yes |
| `REACT_APP_DOCS_BASE_URL` | Documentation base URL | Yes |

## Running Locally with npm

If you want to run the example locally without Docker (faster for development):

### Install Dependencies

```bash
cd web-integrations/javascript-sdk/react-client-side
npm install
```

### Run the Application

```bash
npm start
```

The application will start on `http://localhost:3034`.

> **Note:** Running locally with `npm start` is faster than Docker for development and testing.

## How It Works

### 1. SDK Loading

The SDK is loaded from CDN in `public/index.html`:

```html
<script src="%REACT_APP_UID_JS_SDK_URL%"></script>
```

### 2. SDK Initialization

The React component (`ClientSideApp.tsx`) initializes the SDK:

```typescript
const getSDK = () => window[UID_JS_SDK_NAME];

useEffect(() => {
  const sdk = getSDK();
  sdk.callbacks = sdk.callbacks || [];
  sdk.callbacks.push(onIdentityUpdated);
  
  sdk.callbacks.push((eventType) => {
    if (eventType === 'SdkLoaded') {
      sdk.init({ baseUrl: UID_BASE_URL });
    }
  });
}, []);
```

### 3. Token Generation

When a user enters an email and clicks "Generate":

```typescript
await getSDK().setIdentityFromEmail(email, clientSideIdentityOptions);
```

The SDK handles all encryption/decryption automatically.

### 4. Identity Management

- Identity is stored in browser localStorage by the SDK
- Callbacks update React state when identity changes
- Token refresh happens automatically
- Disconnect clears the identity

## Testing

1. Navigate to `http://localhost:3035`
2. Enter an email address
3. Click "Generate UID2" (or "Generate EUID")
4. Observe the identity information displayed
5. Click "Clear" to disconnect

## Key Differences from Vanilla JavaScript Example

| Aspect | Vanilla JS | React |
|--------|------------|-------|
| SDK Loading | `<script>` tag | `<script>` in `public/index.html` |
| UI Updates | jQuery DOM manipulation | React state management |
| Callbacks | Direct DOM updates | Updates React state |
| Initialization | `$(document).ready()` | `useEffect()` hook |

## License

Apache-2.0

