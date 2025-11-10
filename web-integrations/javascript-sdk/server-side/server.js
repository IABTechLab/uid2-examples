"use strict";

// Load environment variables from .env file (for local development)
require('dotenv').config({ path: '../../../.env' });

const session = require('cookie-session');
const ejs = require('ejs');
const express = require('express');
const nocache = require('nocache');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3034;

let uidBaseUrl = process.env.UID_SERVER_BASE_URL;
const subscriptionId = process.env.UID_CSTG_SUBSCRIPTION_ID;
const serverPublicKey = process.env.UID_CSTG_SERVER_PUBLIC_KEY;
const uidJsSdkUrl = process.env.UID_JS_SDK_URL;
const uidJsSdkName = process.env.UID_JS_SDK_NAME;

// UI/Display configuration
const identityName = process.env.IDENTITY_NAME;
const docsBaseUrl = process.env.DOCS_BASE_URL;

// Initialize UID JavaScript SDK in a simulated browser environment using jsdom
// This demonstrates that the client-side SDK works in Node.js with jsdom
let uid2Sdk = null;
let dom = null;

async function initializeSDK() {
  const crypto = require('crypto');
  
  // Create a virtual DOM environment
  dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
  });
  
  // Set global variables for the SDK
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.localStorage = dom.window.localStorage;
  
  // Polyfill Web Crypto API for jsdom
  // The SDK needs window.crypto.subtle for encryption
  Object.defineProperty(dom.window, 'crypto', {
    value: crypto.webcrypto,
    writable: false,
    configurable: true
  });
  
  // Polyfill TextEncoder and TextDecoder (required by the SDK)
  const util = require('util');
  global.TextEncoder = util.TextEncoder;
  global.TextDecoder = util.TextDecoder;
  dom.window.TextEncoder = util.TextEncoder;
  dom.window.TextDecoder = util.TextDecoder;
  
  // Load the UID2 SDK script from CDN
  try {
    const axios = require('axios');
    const response = await axios.get(uidJsSdkUrl);
    
    // Execute the SDK code in the jsdom context
    const scriptEl = dom.window.document.createElement('script');
    scriptEl.textContent = response.data;
    dom.window.document.body.appendChild(scriptEl);
    
    // Wait for the SDK to initialize
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get reference to the SDK
    uid2Sdk = dom.window[uidJsSdkName];
    if (!uid2Sdk) {
      throw new Error(`SDK not found at window.${uidJsSdkName}`);
    }
    
    // Initialize the SDK
    uid2Sdk.init({ baseUrl: uidBaseUrl });
    
    return uid2Sdk;
  } catch (error) {
    console.error('Failed to initialize SDK:', error);
    throw error;
  }
}

// Express middleware setup
app.use(session({
  keys: [process.env.SESSION_KEY || 'default-session-key-change-me'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(nocache());

/**
 * Check if an identity is still valid and refreshable
 */
function isRefreshableIdentity(identity) {
  if (!identity || typeof identity !== 'object') {
    return false;
  }
  if (!identity.refresh_expires || Date.now() >= identity.refresh_expires) {
    return false;
  }
  return !!identity.refresh_token;
}

/**
 * Refresh an identity token using the SDK
 * The SDK will automatically refresh tokens when initialized with an existing identity
 */
async function refreshIdentity(identity) {
  // TODO: Use JS SDK to refresh identity
  // The SDK's init() with an existing identity will handle refresh automatically
  // Example:
  // const sdk = getUid2Sdk();
  // return new Promise((resolve) => {
  //   sdk.init({
  //     baseUrl: uidBaseUrl,
  //     identity: identity
  //   });
  //   sdk.callbacks.push((eventType, payload) => {
  //     if (eventType === 'IdentityUpdated') {
  //       resolve(payload.identity);
  //     }
  //   });
  // });
  
  console.log('TODO: Implement SDK-based identity refresh');
  return identity;
}

/**
 * Verify and refresh identity if needed
 */
async function verifyIdentity(req) {
  if (!isRefreshableIdentity(req.session.identity)) {
    return false;
  }

  // Check if identity needs refresh
  if (Date.now() >= req.session.identity.refresh_from || Date.now() >= req.session.identity.identity_expires) {
    req.session.identity = await refreshIdentity(req.session.identity);
  }

  return !!req.session.identity;
}

/**
 * Middleware to protect routes that require authentication
 */
async function protect(req, res, next) {
  if (await verifyIdentity(req)) {
    next();
  } else {
    req.session = null;
    res.redirect('/login');
  }
}

// Routes

/**
 * Main page - shows login form or identity result
 */
app.get('/', (req, res) => {
  res.render('index', {
    identity: req.session.identity || null,
    identityName,
    docsBaseUrl
  });
});

/**
 * Handle login form submission
 * Uses the JavaScript SDK's setIdentityFromEmail method on the server
 */
app.post('/login', async (req, res) => {
  if (!uid2Sdk) {
    return res.render('error', {
      error: 'SDK not initialized. Server may still be starting up.',
      response: null,
      identityName,
      docsBaseUrl
    });
  }

  try {
    console.log(`Generating token for email: ${req.body.email}`);
    
    // Use the SDK's setIdentityFromEmail method
    // This is the same method used in browser environments
    const identity = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Token generation timed out after 10 seconds'));
      }, 10000);

      // Add callback to capture the identity or optout
      const callbackHandler = (eventType, payload) => {
        // Handle successful identity generation
        if ((eventType === 'InitCompleted' || eventType === 'IdentityUpdated') && payload?.identity) {
          clearTimeout(timeout);
          // Remove this specific callback
          const index = uid2Sdk.callbacks.indexOf(callbackHandler);
          if (index > -1) {
            uid2Sdk.callbacks.splice(index, 1);
          }
          resolve(payload.identity);
        }
        
        // Handle optout - user has opted out of UID2
        if (eventType === 'OptoutReceived') {
          clearTimeout(timeout);
          // Remove this specific callback
          const index = uid2Sdk.callbacks.indexOf(callbackHandler);
          if (index > -1) {
            uid2Sdk.callbacks.splice(index, 1);
          }
          reject(new Error('Got unexpected token generate status: optout'));
        }
      };

      uid2Sdk.callbacks.push(callbackHandler);

      // Call setIdentityFromEmail
      uid2Sdk.setIdentityFromEmail(
        req.body.email,
        {
          subscriptionId: subscriptionId,
          serverPublicKey: serverPublicKey
        }
      ).catch(err => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    if (!identity) {
      throw new Error('No identity returned from SDK');
    }

    req.session.identity = identity;
    res.redirect('/');
    
  } catch (error) {
    console.error('Token generation failed:', error);
    res.render('error', {
      error: error.message || error.toString(),
      response: error.response || null,
      identityName,
      docsBaseUrl
    });
  }
});

/**
 * Logout endpoint - clears session and returns to main page
 */
app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

// Start server and initialize SDK
initializeSDK().then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

