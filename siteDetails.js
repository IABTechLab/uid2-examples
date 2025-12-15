/**
 * Site details configuration for UID2 example sites.
 * These domains are used for local development with HTTPS.
 */

const sites = [
  // JavaScript SDK integrations
  {
    name: 'js-client-side',
    domain: 'js-client-side.sample-dev.com',
    port: 3031,
    description: 'JavaScript SDK Client Side',
  },
  {
    name: 'js-client-server',
    domain: 'js-client-server.sample-dev.com',
    port: 3032,
    description: 'JavaScript SDK Client Server',
  },
  {
    name: 'js-react',
    domain: 'js-react.sample-dev.com',
    port: 3034,
    description: 'JavaScript SDK React Client Side',
  },

  // Server-side integration
  {
    name: 'server-side',
    domain: 'server-side.sample-dev.com',
    port: 3033,
    description: 'Server Side Integration',
  },

  // Google Secure Signals integrations
  {
    name: 'secure-signals-client-server',
    domain: 'secure-signals-client-server.sample-dev.com',
    port: 3041,
    description: 'Google Secure Signals Client Server',
  },
  {
    name: 'secure-signals-client-side',
    domain: 'secure-signals-client-side.sample-dev.com',
    port: 3042,
    description: 'Google Secure Signals Client Side',
  },
  {
    name: 'secure-signals-server-side',
    domain: 'secure-signals-server-side.sample-dev.com',
    port: 3043,
    description: 'Google Secure Signals Server Side',
  },
  {
    name: 'secure-signals-react',
    domain: 'secure-signals-react.sample-dev.com',
    port: 3044,
    description: 'Google Secure Signals React Client Side',
  },

  // Prebid integrations
  {
    name: 'prebid-client',
    domain: 'prebid-client.sample-dev.com',
    port: 3051,
    description: 'Prebid Client Side',
  },
  {
    name: 'prebid-client-server',
    domain: 'prebid-client-server.sample-dev.com',
    port: 3052,
    description: 'Prebid Client Server',
  },
  {
    name: 'prebid-deferred',
    domain: 'prebid-deferred.sample-dev.com',
    port: 3053,
    description: 'Prebid Client Side Deferred (mergeConfig)',
  },

  // Prebid + Secure Signals integrations
  {
    name: 'prebid-secure-signals',
    domain: 'prebid-secure-signals.sample-dev.com',
    port: 3061,
    description: 'Prebid Secure Signals Client Side',
  },

  // Tools
  {
    name: 'hashing-tool',
    domain: 'hashing-tool.sample-dev.com',
    port: 3071,
    description: 'Hashing Tool',
  },
];

// Export for CommonJS (used by createCA.ts)
export const port = 443;

export const urlPortSuffix = port === 443 ? '' : `:${port}`;

export const devSites = sites.map((s) => ({ ...s, url: `https://${s.domain}${urlPortSuffix}/` }));

export const devDomains = Object.values(devSites).map((s) => s.domain);

export const devSiteMap = Object.fromEntries(devSites.map((s) => [s.name, s]));

export const topLevelDomain = 'sample-dev.com';

// Also include the root domain for certificate (index page)
export const allDomains = [topLevelDomain, ...devDomains];

