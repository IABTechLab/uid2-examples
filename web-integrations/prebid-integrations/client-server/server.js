// ============================================================================
// UID2 Prebid.js Client-Server Integration Example - Server
// ============================================================================
// This server demonstrates how to generate UID2 tokens on the server side
// for use with Prebid.js in a client-server integration.
//
// Key responsibilities:
// 1. Accept user email from the front-end
// 2. Encrypt the email and send it to the UID2 API
// 3. Decrypt the UID2 token response
// 4. Return the token to the front-end for use with Prebid.js
// ============================================================================

// Load environment variables from .env file (for local development)
require('dotenv').config({path: '../../../.env'});

const axios = require('axios');
const express = require('express');
const crypto = require('crypto');

const app = express();
const port = 3052;

// UID2 API Configuration
// These values should be set via environment variables for security
const uid2BaseUrl = process.env.UID2_BASE_URL || 'https://operator-integ.uidapi.com';
const uid2ApiKey = process.env.UID2_API_KEY;           // Your API Key from UID2 Portal
const uid2ClientSecret = process.env.UID2_CLIENT_SECRET; // Your Client Secret from UID2 Portal

// Encryption constants required by UID2 API
const ivLength = 12;                    // Initialization vector length
const nonceLength = 8;                  // Nonce (random number) length
const timestampLength = 8;              // Timestamp length
const encryptionAlgo = 'aes-256-gcm';   // AES-256-GCM encryption algorithm

// Middleware setup
app.use(express.static('public'));      // Serve static files (HTML, CSS, JS) from 'public' folder
app.use(express.json());                // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data

// ============================================================================
// HELPER FUNCTIONS FOR ENCRYPTION/DECRYPTION
// ============================================================================
// The UID2 API requires all requests and responses to be encrypted for security.
// These functions handle the encryption/decryption process.

/**
 * Converts a Buffer to a base64-encoded string
 * @param {Buffer} arrayBuffer - The buffer to convert
 * @returns {string} Base64-encoded string
 */
function bufferToBase64(arrayBuffer) {
    return Buffer.from(arrayBuffer).toString('base64');
}

/**
 * Converts a base64-encoded string back to a Buffer
 * @param {string} base64 - The base64 string to convert
 * @returns {Buffer} The decoded buffer
 */
function base64ToBuffer(base64) {
    return Buffer.from(base64, 'base64');
}

/**
 * Encrypts a message using AES-256-GCM encryption
 * This is required by the UID2 API to protect user data in transit.
 * @param {string|Buffer} message - The message to encrypt (typically user email)
 * @param {string} base64Key - Your UID2 Client Secret (base64-encoded)
 * @returns {Object} Object containing the ciphertext and initialization vector
 */
function encryptRequest(message, base64Key) {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(encryptionAlgo, base64ToBuffer(base64Key), iv);
    const ciphertext = Buffer.concat([cipher.update(message), cipher.final(), cipher.getAuthTag()]);

    return { ciphertext: ciphertext, iv: iv };
}

/**
 * Compares two byte arrays for equality
 * Used to verify that the nonce in the response matches the request (prevents tampering)
 * @param {Uint8Array} array1 - First array to compare
 * @param {Uint8Array} array2 - Second array to compare
 * @returns {boolean} True if arrays are equal, false otherwise
 */
function isEqual(array1, array2) {
    for (let i = 0; i < array1.byteLength; i++) {
        if (array1[i] !== array2[i]) return false;
    }
    return true;
}

/**
 * Decrypts a response from the UID2 API
 * Verifies the nonce to ensure the response hasn't been tampered with.
 * @param {string} base64Response - The encrypted response from UID2 API
 * @param {string} base64Key - Your UID2 Client Secret (base64-encoded)
 * @param {Buffer} nonceInRequest - The nonce that was sent in the request
 * @returns {Object} The decrypted JSON response containing the UID2 token
 * @throws {Error} If the nonce doesn't match (indicates tampering)
 */
function decrypt(base64Response, base64Key, nonceInRequest)  {
    const responseBytes = base64ToBuffer(base64Response);
    const iv = responseBytes.subarray(0, ivLength);

    const decipher = crypto.createDecipheriv(encryptionAlgo, base64ToBuffer(base64Key), iv);

    const tagLength = 16;
    const tag = responseBytes.subarray(responseBytes.length - tagLength);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(responseBytes.subarray(ivLength, responseBytes.length - tagLength)), decipher.final()]);

    const nonceInResponse = decrypted.subarray(timestampLength, timestampLength + nonceLength);
    if (!isEqual(nonceInRequest, new Uint8Array(nonceInResponse))) {
        throw new Error('Nonce in request does not match nonce in response');
    }
    const payload = decrypted.subarray(timestampLength + nonceLength);

    const responseString = String.fromCharCode.apply(String, new Uint8Array(payload));
    return JSON.parse(responseString);
}

/**
 * Creates an encrypted "envelope" to send to the UID2 API
 * The envelope contains: timestamp, nonce, and the payload (user email)
 * This format is required by the UID2 API for all token generation requests.
 * @param {string} payload - The JSON string to encrypt (e.g., '{"email": "user@example.com"}')
 * @returns {Object} Object containing the encrypted envelope and nonce
 */
function createEnvelope(payload) {
    const millisec = BigInt(Date.now());
    const bufferMillisec = new ArrayBuffer(timestampLength);
    new DataView(bufferMillisec).setBigInt64(0, millisec);

    const nonce = crypto.randomBytes(nonceLength);
    const payloadEncoded = new TextEncoder().encode(payload);
    const body = Buffer.concat([Buffer.from(new Uint8Array(bufferMillisec)), nonce, payloadEncoded]);

    const { ciphertext, iv } = encryptRequest(body, uid2ClientSecret);

    const envelopeVersion =  Buffer.alloc(1, 1);
    const envelope = bufferToBase64(Buffer.concat([envelopeVersion, iv, Buffer.from( new Uint8Array(ciphertext))]));
    return { envelope: envelope, nonce: nonce };
}

// ============================================================================
// API ENDPOINT: Token Generation
// ============================================================================

/**
 * POST /login
 * Generates a UID2 token for the given email address
 * 
 * This endpoint:
 * 1. Receives an email from the front-end
 * 2. Encrypts it and sends to UID2 API's /v2/token/generate endpoint
 * 3. Decrypts the response
 * 4. Returns the UID2 identity (token) as JSON to the front-end
 * 
 * Request body: { email: "user@example.com" }
 * Response: { identity: { advertising_token: "...", refresh_token: "...", ... } }
 */
app.post('/login', async (req, res) => {
    const jsonEmail = JSON.stringify({ email: req.body.email });
    const { envelope, nonce } = createEnvelope(jsonEmail);

    const headers = {
        headers: { Authorization: 'Bearer ' + uid2ApiKey },
    };

    try {
        const encryptedResponse = await axios.post(
            uid2BaseUrl + '/v2/token/generate',
            envelope,
            headers
        );
        const response = decrypt(encryptedResponse.data, uid2ClientSecret, nonce);

        if (response.status === 'optout') {
            // Opt-out is a valid state, return 200 with status
            res.json({ status: 'optout' });
        } else if (response.status !== 'success') {
            res.status(400).json({ error: 'Token generation failed', status: response.status });
        } else if (typeof response.body !== 'object') {
            res.status(400).json({ error: 'Unexpected response format' });
        } else {
            // Return the identity (UID2 token) as JSON
            res.json({ identity: response.body });
        }
    } catch (error) {
        console.error('Error generating token:', error.message);
        res.status(500).json({ error: 'Failed to generate UID2 token', details: error.message });
    }
});

// ============================================================================
// START THE SERVER
// ============================================================================
app.listen(port, () => {
  console.log(`UID2 Prebid Client-Server example listening at http://localhost:${port}`);
  console.log(`Make sure you have set the following environment variables:`);
  console.log(`  - UID2_API_KEY`);
  console.log(`  - UID2_CLIENT_SECRET`);
  console.log(`  - UID2_BASE_URL (optional, defaults to integration environment)`);
});

