# UID2 Integration Examples

If you are a content publisher interested in generating identity tokens utilizing UID2 for the RTB bid stream, you can build and run either of the two example applications to see how you can use the UID2 services and which integration fits your needs best.

Both examples illustrate the basic steps that you need to consider for your integration. For example, you need to decide how to implement user login and logout, how to manage UID2 identity information and use it for targeted advertising, how to refresh tokens, deal with missing identities, and handle user opt-outs.

The following table summarizes both examples. 

| Integration Example | Primary Audience | Example Description | Integration Guide |
| :--- | :--- | :--- | :--- |
| [UID2 SDK]() | Publishers with web assets | Demonstrates how to use the UID2 services using the [Client-Side Identity JavaScript SDK](https://github.com/UnifiedID2/uid2docs/blob/main/api/v1/sdks/client-side-identity-v1.md) (also known as the UID2 SDK) to implement the standard UID2 integration workflow.  | [UID2 SDK Integration Guide](https://github.com/UnifiedID2/uid2docs/blob/main/api/v1/guides/publisher-client-side.md) |
| [Server-Only]() | App developers and CTV broadcasters | Demonstrates how to use the UID2 services to implement a custom (server-only) UID2 integration workflow without relying on an SDK for establishing client UID2 identity and retrieving advertising tokens.  | [Server-Only UID2 Integration Guide](https://github.com/UnifiedID2/uid2docs/blob/main/api/v1/guides/custom-publisher-integration.md) |

The documentation for each example includes instructions on how to build and run the application and provides the steps that you may take to test and explore it. Each step is annotated with comments that explain what takes place on the backend and how the UID2 services work.






