# UID2 Prebid.js Client-Server Integration Example

This example demonstrates how to integrate [UID2 with Prebid.js using client-server integration](https://unifiedid.com/docs/guides/integration-prebid-client-server), where UID2 tokens are generated on the server side and passed to Prebid for use in header bidding auctions.

> **NOTE:** This example uses Prebid.js v8.

> **NOTE:** While the server side of this example is implemented in JavaScript using Node.js, it is not a requirement. You can use any technology of your choice and refer to this example for illustration of the functionality that needs to be implemented.

## Run with Docker (Recommended)

### 1. Choose Your Testing Environment

You have two options for testing:

**Option A: Local UID2 Operator** (for local development)
**Option B: Integration Environment** (for testing against a live UID2 service)

### 2. Set Up Environment Variables

Create a `.env` file in the **root of the uid2-examples repository** (NOT in this folder) with the following:

```bash
UID2_BASE_URL=http://host.docker.internal:8080
UID2_API_KEY=your-api-key-here
UID2_CLIENT_SECRET=your-client-secret-here
```

**Important:** The `.env` file must be at `/uid2-examples/.env`, not `/uid2-examples/web-integrations/prebid-integrations/client-server/.env`.

See the instructions below for your chosen environment to get the correct values.

### 3. Build and Run

From the **root of the uid2-examples repository**, run:

```bash
docker-compose up --build prebid-client-server
```

The application will be available at **`http://localhost:3052`**

To stop, press `Ctrl+C` or run:

```bash
docker-compose down
```

## Testing Environment Setup

### Option A: Local UID2 Operator

This option runs a local instance of the UID2 Operator on your machine.

#### 1. Clone and Set Up the UID2 Operator

```bash
git clone https://github.com/IABTechLab/uid2-operator.git
cd uid2-operator
```

#### 2. Configure the Operator

Edit `conf/local-config.json` and ensure this key is set:

```json
{
  "enable_v2_encryption": true
}
```

#### 3. Get Your Credentials

Open `src/main/resources/clients/clients.json` and find a client entry with the **"GENERATOR"** role. For example:

```json
{
  "key": "UID2-C-L-124-H8VwqX.l2G4TCuUWYAqdqkeG/UqtFoPEoXirKn4kHWxc=",
  "secret": "NcMgi6Y8C80SlxvV7pYlfcvEIo+2b0508tYQ3pKK8HM=",
  "name": "Publisher",
  "roles": ["GENERATOR"]
}
```

#### 4. Update Your .env File

In the **root of the uid2-examples repository** (at `/uid2-examples/.env`), add:

```bash
UID2_BASE_URL=http://host.docker.internal:8080
UID2_API_KEY=UID2-C-L-124-H8VwqX.l2G4TCuUWYAqdqkeG/UqtFoPEoXirKn4kHWxc=
UID2_CLIENT_SECRET=NcMgi6Y8C80SlxvV7pYlfcvEIo+2b0508tYQ3pKK8HM=
```

#### 5. Start the Operator

Follow the [UID2 Operator README](https://github.com/IABTechLab/uid2-operator) instructions to start the operator. It will run on `http://localhost:8080`.

### Option B: Integration Environment

This option uses the hosted UID2 integration environment (deployed version).

#### 1. Get Your Credentials

Contact your UID2 representative or use the [UID2 Portal](https://unifiedid.com/docs/portal/overview) to obtain integration environment credentials.

#### 2. Update Your .env File

In the **root of the uid2-examples repository** (at `/uid2-examples/.env`), add:

```bash
UID2_BASE_URL=https://operator-integ.uidapi.com
UID2_API_KEY=your-integ-api-key
UID2_CLIENT_SECRET=your-integ-client-secret
```



## Testing the Application

### 1. Generate a UID2 Token

1. Open `http://localhost:3052` in your browser
2. Enter an email address
3. Click **"Generate UID2"**

**Expected result:**
- "Ready for Targeted Advertising: **yes**"
- The UID2 advertising token is displayed
- Button changes to "Clear UID2"

### 2. Verify Prebid Integration

Open the browser console (F12) and run:

```javascript
pbjs.getUserIds()
```

You should see:

```javascript
{
  uid2: {
    id: "AdvertisingTokenA...",
    refresh_token: "...",
    // ...
  }
}
```

### 3. Test Token Persistence

Refresh the page - the token should persist (loaded from localStorage).

### 4. Test Opt-Out

Enter an opted-out email and click "Generate UID2".

**Test emails:**
- **Local operator:** `optout@example.com`
- **Integration environment:** `test@example.com`

**Expected result:**
- "Ready for Targeted Advertising: **no**"
- "UID2 Advertising Token: **This email has opted out.**"
- Console shows: `UID2 status: optout`

## Environment Variables

| Variable             | Description                                                                                      | Example                                  |
| :------------------- | :----------------------------------------------------------------------------------------------- | :--------------------------------------- |
| `UID2_BASE_URL`      | The UID2 Operator endpoint. Use `http://localhost:8080` for local or the integration URL.       | `http://localhost:8080`                  |
| `UID2_API_KEY`       | Your UID2 API key with GENERATOR role.                                                           | `UID2-C-L-124-H8VwqX...`                 |
| `UID2_CLIENT_SECRET` | Your UID2 client secret.                                                                         | `NcMgi6Y8C80SlxvV7pYlfcvEIo+2b0508...` |
| `UID2_STORAGE_KEY`   | Your localStorage key for storing UID2 tokens.         | `__uid2_advertising_token`               |

**Note:** For Docker, use `http://host.docker.internal:8080` instead of `http://localhost:8080` to access services on your host machine.

## How It Works

This example implements the [UID2 Client-Server Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-server).

### Server Side (`server.js`)

1. Receives email from the client via `/login` endpoint
2. Encrypts the email and sends it to the UID2 `/v2/token/generate` API
3. Decrypts the response and extracts the UID2 identity
4. Returns the identity to the client as JSON

### Client Side (`public/index.html`)

1. Calls the `/login` endpoint with the user's email
2. Receives the UID2 identity from the server
3. Stores the identity in localStorage
4. Configures Prebid.js with the UID2 token using `pbjs.setConfig()`
5. Prebid.js includes the UID2 in bid requests

## Troubleshooting

### "Request failed with status code 401"

- Verify your `UID2_API_KEY` and `UID2_CLIENT_SECRET` are correct
- Ensure your API key has the **GENERATOR** role
- Check that credentials match your environment (local vs. integration)

### "Request failed with status code 500"

**For local operator:**
- Verify the operator is running at `localhost:8080`; the output should indicate 'OK'.
- Check `enable_v2_encryption: true` is set in `local-config.json`
- Review operator logs for errors

**For Docker:**
- Ensure `UID2_BASE_URL` uses `host.docker.internal:8080` not `localhost:8080`

### Prebid Doesn't Have the UID2

Run `pbjs.getUserIds()` in console:
- If empty or missing `uid2`, check console for Prebid errors
- Verify Prebid.js loaded correctly (check Network tab)
- Ensure `setPrebidConfig()` is being called after token generation

## Additional Resources

- [UID2 Client-Server Integration Guide for Prebid.js](https://unifiedid.com/docs/guides/integration-prebid-client-server)
- [UID2 Operator Repository](https://github.com/IABTechLab/uid2-operator)
- [UID2 Portal](https://unifiedid.com/docs/portal/overview)
- [Prebid.js Documentation](https://docs.prebid.org/)
