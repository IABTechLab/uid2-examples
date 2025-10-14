# UID2 Prebid.js Client-Server Integration Example

This example demonstrates how a content publisher can use [UID2](https://unifiedid.com/docs/intro) and [Prebid.js](http://prebid.org/) to generate UID2 tokens on the server side and pass them to Prebid for use in header bidding auctions.

For the client-side Prebid.js integration example, see [../client-side](../client-side).

> **NOTE:** While the server side of this example is implemented in JavaScript using Node.js, it is not a requirement. You can use any technology of your choice and refer to this example for illustration of the functionality that needs to be implemented.

## Prerequisites

- **For local testing:** Node.js (version 20.x or later recommended)
- **For Docker:** Docker and Docker Compose installed
- UID2 API credentials (API Key and Client Secret)
- A local UID2 Operator instance **OR** access to the UID2 integration environment

## Run with Docker (Recommended)

### 1. Set Up Environment Variables

Create a `.env` file in the **root of the uid2-examples repository** with the following:

```bash
# UID2 Operator configuration
UID2_BASE_URL=http://localhost:8080
UID2_API_KEY=your-api-key-here
UID2_CLIENT_SECRET=your-client-secret-here
```

**For local operator:** Use `UID2_BASE_URL=http://localhost:8080` and your local operator credentials.

**For integration environment:** Use `UID2_BASE_URL=https://operator-integ.uidapi.com` and your portal credentials.

### 2. Build and Run with Docker Compose

From the **root of the uid2-examples repository**, run:

```bash
docker-compose up prebid-client-server
```

The application will be available at **`http://localhost:3052`**

To stop the container, press `Ctrl+C` or run:

```bash
docker-compose down
```

## Run Locally for Testing

### 1. Set Up Environment Variables

Create a `.env` file in the **root of the uid2-examples repository** (not in this folder) with the following variables:

**For local operator testing:**
- Use `UID2_BASE_URL=http://localhost:8080`
- Use API credentials from your local operator's configuration
- Ensure your local UID2 operator is running

**For integration environment testing:**
- Use `UID2_BASE_URL=https://operator-integ.uidapi.com`
- Use your integration environment API credentials from the UID2 Portal

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm start
```

You should see:

```
UID2 Prebid Client-Server example listening at http://localhost:3052
Make sure you have set the following environment variables:
  - UID2_API_KEY
  - UID2_CLIENT_SECRET
  - UID2_BASE_URL (optional, defaults to integration environment)
```

### 4. Test the Application

1. Open your browser to `http://localhost:3052`
2. Enter an email address in the input field
3. Click **"Generate UID2"**
4. You should see:
   - "Ready for Targeted Advertising: **yes**"
   - The UID2 advertising token displayed
   - The button changes to "Clear UID2"

### 5. Verify Prebid Integration

Open the browser console (F12) and run:

```javascript
pbjs.getUserIds()
```

You should see output like:

```javascript
{
  uid2: {
    id: "AdvertisingTokenA...",  // Your UID2 token
    refresh_token: "...",
    refresh_from: 1234567890,
    refresh_expires: 1234567890,
    // ...
  }
}
```

This confirms that Prebid.js has received and stored the UID2 token.

### 6. Test Token Persistence

Refresh the page - the UID2 token should persist (loaded from localStorage) and Prebid should still have access to it via `pbjs.getUserIds()`.

## Environment Variables

| Variable             | Required | Description                                                                                                                                           |
| :------------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UID2_BASE_URL`      | Yes      | The base URL of the UID2 service. For local testing: `http://localhost:8080`. For integration: `https://operator-integ.uidapi.com`.                  |
| `UID2_API_KEY`       | Yes      | Your UID2 API key. Must have the GENERATOR role.                                                                                                     |
| `UID2_CLIENT_SECRET` | Yes      | Your UID2 client secret corresponding to the API key.                                                                                                 |

**Note:** This application runs on port **3052** by default.

## How It Works

This example implements the [UID2 Client-Server Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-server).

### Server Side (`server.js`)

1. Receives email from the client via `/login` endpoint
2. Encrypts the email and sends it to the UID2 `/v2/token/generate` API
3. Decrypts the response and extracts the UID2 identity
4. Returns the identity (advertising token, refresh token, etc.) to the client as JSON

### Client Side (`public/index.html`)

1. Calls the `/login` endpoint with the user's email
2. Receives the UID2 identity from the server
3. Stores the identity in localStorage
4. Configures Prebid.js with the UID2 token using `pbjs.setConfig()`
5. Prebid.js includes the UID2 in subsequent bid requests

## Troubleshooting

### "Request failed with status code 401"

- Verify your `UID2_API_KEY` and `UID2_CLIENT_SECRET` are correct
- Ensure your API key has the **GENERATOR** role
- Check that your credentials match the environment (local operator vs. integration)

### "Request failed with status code 404" or "500"

- **Local operator:** Ensure your UID2 operator is running at `localhost:8080`
- **Local operator:** Verify operator configuration accepts v2 encrypted requests
- **Integration environment:** Switch `UID2_BASE_URL` to `https://operator-integ.uidapi.com`

### Token doesn't persist across refresh

- Check browser localStorage for `__uid2_advertising_token` key
- Verify no browser extensions are clearing storage
- Check browser console for JavaScript errors

### Prebid doesn't have the UID2 token

Run `pbjs.getUserIds()` in console:
- If empty or missing `uid2`, check console for Prebid errors
- Verify `setPrebidConfig()` is being called after token generation
- Check that `prebid.js` loaded correctly (check Network tab)

## Additional Resources

- [UID2 Client-Server Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-server)
- [UID2 SDK for JavaScript](https://unifiedid.com/docs/sdks/client-side-identity)
- [Prebid.js Documentation](https://docs.prebid.org/)
- [UID2 Portal](https://unifiedid.com/docs/portal/overview)

