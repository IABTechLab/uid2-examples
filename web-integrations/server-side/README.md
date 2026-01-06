# Server-Side Integration Example

This example demonstrates a full server-side UID2/EUID implementation where all token logic is handled on the server, with no client-side SDK required.

- UID2: [Running Site](https://server-side.samples.uidapi.com/) | [Documentation](https://unifiedid.com/docs/guides/integration-publisher-server-side)
- EUID: [Running Site](https://server-side.samples.integ.euid.eu/) | [Documentation](https://euid.eu/docs/guides/integration-publisher-server-side)

## Build and Run Locally

> **Before running:** Follow the [main README](../../README.md#running-locally) to set up your local operator and ensure the following environment variables are in the `.env` file in the repository root:

| Parameter | Description |
|:----------|:------------|
| `UID_SERVER_BASE_URL` | API base URL for server-side calls. Example: `https://operator-integ.uidapi.com` (UID2) or `https://integ.euid.eu` (EUID) |
| `UID_API_KEY` | Your API key for server-side token generation |
| `UID_CLIENT_SECRET` | Your client secret for server-side token generation |
| `IDENTITY_NAME` | Display name for the UI (`UID2` or `EUID`) |
| `DOCS_BASE_URL` | Used for UI links to public documentation (`https://unifiedid.com/docs` or `https://euid.eu/docs`) |

From the repository root directory:

```bash
docker compose up server-side
```

Once running, access the application at: **http://localhost:3033**

To stop the service:

```bash
docker compose stop server-side
```

## Test the Example Application

| Step | Description | Comments |
|:----:|:------------|:---------|
| 1 | Navigate to `http://localhost:3033` in your browser. | The main page displays a login form for generating a UID2/EUID identity. **Note:** A real-life application must also display a consent form for targeted advertising. |
| 2 | Enter a test email address and click **Generate UID2** (or **Generate EUID**). | This calls the `/login` endpoint on the server, which sends an encrypted request to `POST /token/generate` using your API key and client secret. |
| 3 | The page displays the identity information. | The server stores the identity in a session and renders it into the page. The advertising token is available for ad targeting. |
| 4 | Refresh the page and note the identity persists. | The server loads the identity from the session. It checks if a refresh is needed and calls `POST /token/refresh` if necessary. |
| 5 | Observe the token expiration and refresh. | The server handles all token refresh logic. When the token is close to expiration, the server automatically refreshes it using the refresh token. |
| 6 | Click **Clear UID2** (or **Clear EUID**) to log out. | The server clears the session, removing the identity. The page returns to the login state. |

## Debugging Tips

1. **View container logs**: `docker compose logs server-side`
2. **Check environment**: Run `docker compose config` to see resolved values
3. **Rebuild after changes**: `docker compose up -d --build server-side`
4. **Check server-side errors**: The server logs all token generation and refresh errors to the console
