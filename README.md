# UID2 Integration Examples

The [UID2 framework](https://unifiedid.com/docs/intro) enables publishers to integrate in either of the following ways:

- Via the standard integration workflow, using the [UID2 SDK for JavaScript](https://unifiedid.com/docs/sdks/client-side-identity) (also known as the UID2 SDK).
- Via the server-only (custom) integration workflow, by building a direct integration without using the UID2 SDK.

If you are a content publisher interested in generating UID2 tokens for the real-time bidding (RTB) bid stream and want to see how you can use the UID2 services and which integration fits your needs best, you can build and run an example application for each integration.

The following table summarizes both examples and provides links to the example applications, their documentation, and the respective step-by-step integration guides.

| Environment | Documentation                                                                          | Description                                                                                                                                                                                                     | Primary Audience                                             | Integration Guide                                                                                                                                                                                                    |
|-------------|----------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Node.js     | [UID2 SDK Integration Example](./publisher/standard/README.md)                         | Demonstrates how to use the UID2 services with the [UID2 client SDK](https://unifiedid.com/docs/sdks/client-side-identity) to implement the standard UID2 integration workflow. | Publishers with web assets                                   | [Client SDK Integration Guide](https://unifiedid.com/docs/guides/publisher-client-side)                                                                                              |
| Node.js     | [Server-Only UID2 Integration Example](https://github.com/UnifiedID2/uid2-examples/tree/main/publisher/server_only) | Demonstrates how to use the UID2 services to implement a custom (server-only) UID2 integration workflow without relying on an SDK for establishing client UID2 identity and retrieving advertising tokens.      | App developers and CTV broadcasters                          | [Server-Only UID2 Integration Guide](https://unifiedid.com/docs/guides/custom-publisher-integration)                                                                                 |
| Java        | [Java SDK Integration Example](./publisher/uid2-java-test-site/README.md)              | Demonstrates use of the [UID2 Java SDK](https://github.com/IABTechLab/uid2-client-java) for both a server-only UID2 integration, and a standard (client SDK and server SDK) integration.                        | Publishers with web assets, app developers, CTV broadcasters | [Server-Only](https://unifiedid.com/docs/guides/custom-publisher-integration); [Client SDK](https://unifiedid.com/docs/guides/publisher-client-side) |

The example applications illustrate the basic steps that you need to consider for your integration. For example, you need to decide how to do the following:
- Implement user login and logout.
- Manage UID2 identity information and use it for targeted advertising.
- Refresh tokens.
- Deal with missing identities.
- Handle user opt-outs.

## Docker Compose Setup

This repository includes Docker Compose configuration for easy development and testing of multiple UID2 integration examples.

### Quick Start

**Start all services:**
```bash
docker-compose up -d
```

**Start a single service:**
```bash
# Start only the Prebid.js client-side integration
docker-compose up -d prebid-client

# Start with live logs (foreground)
docker-compose up prebid-client
```

**Stop services:**
```bash
# Stop all services
docker-compose down

# Stop a single service
docker-compose stop prebid-client
```

**View logs:**
```bash
# View all logs
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f prebid-client
```

**Rebuild and restart:**
```bash
# Rebuild and restart all services
docker-compose up -d --build

# Rebuild and restart a single service
docker-compose up -d --build prebid-client
```

### Available Services

- **`prebid-client`** - Prebid.js client-side integration (Port: 3031)
- **`javascript-sdk-client`** - JavaScript SDK client-server integration (Port: 3051)
- *More services will be added as they are containerized*

### Environment Configuration

This repository includes sample environment files for both UID2 and EUID configurations:

- **`.env.sample.uid2`** - UID2 configuration template
- **`.env.sample.euid`** - EUID configuration template

**To get started:**

1. Copy the appropriate sample file to `.env`:
   ```bash
   # For UID2
   cp .env.sample.uid2 .env
   
   # For EUID
   cp .env.sample.euid .env
   ```

2. Update the `.env` file with your credentials:
   - Replace `your-api-key` with your actual API key
   - Replace `your-client-secret` with your actual client secret
   - Update other placeholder values as needed

The sample files include all necessary environment variables for running the examples, including configuration for:
- Core API endpoints
- JavaScript SDK settings
- Google Secure Signals integration
- Prebid integration
- React client examples
- UI/Display preferences

