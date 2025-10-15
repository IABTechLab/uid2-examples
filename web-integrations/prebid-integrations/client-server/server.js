// UID2 Prebid.js Client-Server Integration - Server
// Generates UID2 tokens server-side for use with Prebid.js

require('dotenv').config({path: '../../../.env'});

const axios = require('axios');
const express = require('express');
const crypto = require('crypto');
const ejs = require('ejs');

const app = express();
const port = 3052;

// UID2 API Configuration (set via .env file)
const uid2BaseUrl = process.env.UID2_BASE_URL || 'https://operator-integ.uidapi.com';
const uid2ApiKey = process.env.UID2_API_KEY;
const uid2ClientSecret = process.env.UID2_CLIENT_SECRET;
const UID2_STORAGE_KEY = process.env.UID2_STORAGE_KEY || '__uid2_advertising_token';

// Encryption constants
const ivLength = 12;
const nonceLength = 8;
const timestampLength = 8;
const encryptionAlgo = 'aes-256-gcm';

// Middleware
app.use(express.static('public'));
app.use('/prebid.js', express.static('../prebid.js')); // Serve shared prebid.js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up EJS templating
app.engine('.html', ejs.__express);
app.set('views', './public'); // Use public directory for views
app.set('view engine', 'html');

// ============================================================================
// Encryption/Decryption Helpers
// ============================================================================

function bufferToBase64(arrayBuffer) {
    return Buffer.from(arrayBuffer).toString('base64');
}

function base64ToBuffer(base64) {
    return Buffer.from(base64, 'base64');
}

function encryptRequest(message, base64Key) {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(encryptionAlgo, base64ToBuffer(base64Key), iv);
    const ciphertext = Buffer.concat([cipher.update(message), cipher.final(), cipher.getAuthTag()]);
    return { ciphertext, iv };
}

function isEqual(array1, array2) {
    for (let i = 0; i < array1.byteLength; i++) {
        if (array1[i] !== array2[i]) return false;
    }
    return true;
}

function decrypt(base64Response, base64Key, nonceInRequest) {
    const responseBytes = base64ToBuffer(base64Response);
    const iv = responseBytes.subarray(0, ivLength);

    const decipher = crypto.createDecipheriv(encryptionAlgo, base64ToBuffer(base64Key), iv);

    const tagLength = 16;
    const tag = responseBytes.subarray(responseBytes.length - tagLength);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
        decipher.update(responseBytes.subarray(ivLength, responseBytes.length - tagLength)),
        decipher.final()
    ]);

    const nonceInResponse = decrypted.subarray(timestampLength, timestampLength + nonceLength);
    if (!isEqual(nonceInRequest, new Uint8Array(nonceInResponse))) {
        throw new Error('Nonce mismatch');
    }

    const payload = decrypted.subarray(timestampLength + nonceLength);
    const responseString = String.fromCharCode.apply(String, new Uint8Array(payload));
    return JSON.parse(responseString);
}

// Creates encrypted envelope for UID2 API request
function createEnvelope(payload) {
    const millisec = BigInt(Date.now());
    const bufferMillisec = new ArrayBuffer(timestampLength);
    new DataView(bufferMillisec).setBigInt64(0, millisec);

    const nonce = crypto.randomBytes(nonceLength);
    const payloadEncoded = new TextEncoder().encode(payload);
    const body = Buffer.concat([Buffer.from(new Uint8Array(bufferMillisec)), nonce, payloadEncoded]);

    const { ciphertext, iv } = encryptRequest(body, uid2ClientSecret);

    const envelopeVersion = Buffer.alloc(1, 1);
    const envelope = bufferToBase64(Buffer.concat([envelopeVersion, iv, Buffer.from(new Uint8Array(ciphertext))]));
    return { envelope, nonce };
}

// ============================================================================
// API Endpoints
// ============================================================================

// GET / - Render the main page
app.get('/', (req, res) => {
    res.render('index', { UID2_STORAGE_KEY: UID2_STORAGE_KEY });
});

// POST /login - Generates UID2 token for email address
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
            res.json({ status: 'optout' });
        } else if (response.status !== 'success') {
            res.status(400).json({ error: 'Token generation failed', status: response.status });
        } else if (typeof response.body !== 'object') {
            res.status(400).json({ error: 'Unexpected response format' });
        } else {
            res.json({ identity: response.body });
        }
    } catch (error) {
        console.error('Error generating token:', error.message);
        res.status(500).json({ error: 'Failed to generate UID2 token', details: error.message });
    }
});

// ============================================================================
// Start Server
// ============================================================================

app.listen(port, () => {
    console.log(`UID2 Prebid Client-Server example listening at http://localhost:${port}`);
});
