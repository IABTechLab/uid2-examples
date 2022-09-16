# UID2 Integration Examples

The [UID2 framework](https://github.com/UnifiedID2/uid2docs/tree/main) enables publishers to integrate in either of the following ways:

- Via the standard integration workflow, using the [Client-Side Identity JavaScript SDK](https://github.com/UnifiedID2/uid2docs/blob/main/api/v2/sdks/client-side-identity.md) (also known as the UID2 SDK).
- Via a server-only or custom integration, by building a direct integration without using the UID2 SDK.

If you are a content publisher interested in generating UID2 tokens for the real-time bidding (RTB) bid stream and want to see how you can use the UID2 services and which integration fits your needs best, you can build and run an example application for each integration.

The following table summarizes both examples and provides links to the example applications, their documentation, and the respective step-by-step integration guides.

| Example Application | Example Description | Primary Audience | Example Documentation| Integration Guide |
| :--- | :--- | :--- | :--- | :--- |
| [UID2 SDK Integration Example](https://example-jssdk-integ.uidapi.com/) | Demonstrates how to use the UID2 services with the [UID2 SDK](https://github.com/UnifiedID2/uid2docs/blob/main/api/v2/sdks/client-side-identity.md) to implement the standard UID2 integration workflow.  | Publishers with web assets | [UID2 SDK Integration Example](./publisher/standard/README.md) | [UID2 SDK Integration Guide](https://github.com/UnifiedID2/uid2docs/blob/main/api/v2/guides/publisher-client-side.md) |
| [Server-Only UID2 Integration Example](https://example-srvonly-integ.uidapi.com/login) |Demonstrates how to use the UID2 services to implement a custom (server-only) UID2 integration workflow without relying on an SDK for establishing client UID2 identity and retrieving advertising tokens.| App developers and CTV broadcasters |  [Server-Only UID2 Integration Example](./publisher/server_only/README.md) | [Server-Only UID2 Integration Guide](https://github.com/UnifiedID2/uid2docs/blob/main/api/v2/guides/custom-publisher-integration.md) |

The example applications illustrate the basic steps that you need to consider for your integration. For example, you need to decide how to do the following:
- Implement user login and logout.
- Manage UID2 identity information and use it for targeted advertising.
- Refresh tokens.
- Deal with missing identities.
- Handle user opt-outs.

The documentation for each example includes instructions on how to build and run the application and suggests steps that you may take to test and explore it. Each step is annotated with comments that explain what takes place on the backend and how the UID2 services work.
