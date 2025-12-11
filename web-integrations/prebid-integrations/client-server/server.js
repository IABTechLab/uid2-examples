// UID2/EUID Prebid.js Client-Server Integration - Server
// Generates UID2/EUID tokens server-side for use with Prebid.js

require('dotenv').config({path: '../../../.env'});

const axios = require('axios');
const express = require('express');
const crypto = require('crypto');
const ejs = require('ejs');

const app = express();
const port = 3052;

// UID2/EUID API Configuration (set via .env file)
const uidBaseUrl = process.env.UID_SERVER_BASE_URL || process.env.UID2_BASE_URL || 'https://operator-integ.uidapi.com';
const uidApiKey = process.env.UID_API_KEY || process.env.UID2_API_KEY;
const uidClientSecret = process.env.UID_CLIENT_SECRET || process.env.UID2_CLIENT_SECRET;
const uidStorageKey = process.env.UID_STORAGE_KEY || '__uid2_advertising_token';
const identityName = process.env.IDENTITY_NAME || 'UID2';
const docsBaseUrl = process.env.DOCS_BASE_URL || 'https://unifiedid.com/docs';

// Encryption constants
const ivLength = 12;
const nonceLength = 8;
const timestampLength = 8;
const encryptionAlgo = 'aes-256-gcm';

// Middleware
app.use('/prebid.js', express.static('../prebid.js'));
app.use('/app.css', express.static('public/app.css'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('.html', ejs.__express);
app.set('views', './public');
app.set('view engine', 'html');

// Healthcheck endpoint for Kubernetes probes
app.get('/ops/healthcheck', (req, res) => {
    res.status(200).send('healthy\n');
});

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

// Creates encrypted envelope for UID2/EUID API request
function createEnvelope(payload) {
    const millisec = BigInt(Date.now());
    const bufferMillisec = new ArrayBuffer(timestampLength);
    new DataView(bufferMillisec).setBigInt64(0, millisec);

    const nonce = crypto.randomBytes(nonceLength);
    const payloadEncoded = new TextEncoder().encode(payload);
    const body = Buffer.concat([Buffer.from(new Uint8Array(bufferMillisec)), nonce, payloadEncoded]);

    const { ciphertext, iv } = encryptRequest(body, uidClientSecret);

    const envelopeVersion = Buffer.alloc(1, 1);
    const envelope = bufferToBase64(Buffer.concat([envelopeVersion, iv, Buffer.from(new Uint8Array(ciphertext))]));
    return { envelope, nonce };
}

// ============================================================================
// API Endpoints
// ============================================================================

// GET / - Render the main page
app.get('/', (req, res) => {
    res.render('index', { 
        uidStorageKey,
        identityName,
        docsBaseUrl
    });
});

// POST /login - Generates UID2/EUID token for email address
app.post('/login', async (req, res) => {
    const jsonEmail = JSON.stringify({ email: req.body.email, policy: 1 });
    const { envelope, nonce } = createEnvelope(jsonEmail);

    const headers = {
        headers: { Authorization: 'Bearer ' + uidApiKey },
    };

    try {
        const encryptedResponse = await axios.post(
            uidBaseUrl + '/v2/token/generate',
            envelope,
            headers
        );
        
        const response = decrypt(encryptedResponse.data, uidClientSecret, nonce);

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
        console.error('Token generation failed:', error.message);
        res.status(500).json({ error: `Failed to generate ${identityName} token`, details: error.message });
    }
});

// ============================================================================
// Start Server
// ============================================================================

app.listen(port, () => {
    console.log(`${identityName} Prebid Client-Server example listening at http://localhost:${port}`);
});
