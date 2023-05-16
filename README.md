# UID2 Integration Examples

The [UID2 framework](https://unifiedid.com/docs/intro) enables publishers to integrate in either of the following ways:

- Via the standard integration workflow, using the [UID2 SDK for Javascript](https://unifiedid.com/docs/sdks/client-side-identity) (also known as the UID2 SDK).
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

