// Load environment variables from .env file (for local development)
require('dotenv').config({ path: '../../../.env' });

const axios = require('axios');
const ejs = require('ejs');
const express = require('express');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3041;

const uidBaseUrl = process.env.UID_BASE_URL;
const uidApiKey = process.env.UID_API_KEY;
const uidClientSecret = process.env.UID_CLIENT_SECRET;

// JavaScript SDK configuration
const uidJsSdkUrl = process.env.UID_JS_SDK_URL || 'https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js';
const uidJsSdkName = process.env.UID_JS_SDK_NAME || '__uid2';

// Secure Signals configuration
const secureSignalsSdkUrl = process.env.UID_SECURE_SIGNALS_SDK_URL || 'https://cdn.integ.uidapi.com/uid2SecureSignal.js';

// UI/Display configuration
const identityName = process.env.IDENTITY_NAME;
const docsBaseUrl = process.env.DOCS_BASE_URL;

const ivLength = 12;
const nonceLength = 8;
const timestampLength = 8;
const encryptionAlgo = 'aes-256-gcm';

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index', {
    uidBaseUrl,
    uidJsSdkUrl,
    uidJsSdkName,
    secureSignalsSdkUrl,
    identityName,
    docsBaseUrl
  });
});

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

  return { ciphertext: ciphertext, iv: iv };
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
    decipher.final(),
  ]);

  //The following code shows how we could consume timestamp if needed.
  //const timestamp = new DataView(decrypted.subarray(0, timestampLength)).getBigInt64(0);
  //const _date = new Date(Number(timestamp));
  const nonceInResponse = decrypted.subarray(timestampLength, timestampLength + nonceLength);
  if (!isEqual(nonceInRequest, new Uint8Array(nonceInResponse))) {
    throw new Error('Nonce in request does not match nonce in response');
  }
  const payload = decrypted.subarray(timestampLength + nonceLength);

  const responseString = String.fromCharCode.apply(String, new Uint8Array(payload));
  return JSON.parse(responseString);
}

function createEnvelope(payload) {
  const millisec = BigInt(Date.now());
  const bufferMillisec = new ArrayBuffer(timestampLength);
  new DataView(bufferMillisec).setBigInt64(0, millisec);

  const nonce = crypto.randomBytes(nonceLength);
  const payloadEncoded = new TextEncoder().encode(payload);
  const body = Buffer.concat([Buffer.from(new Uint8Array(bufferMillisec)), nonce, payloadEncoded]);

  const { ciphertext, iv } = encryptRequest(body, uidClientSecret);

  const envelopeVersion = Buffer.alloc(1, 1);
  const envelope = bufferToBase64(
    Buffer.concat([envelopeVersion, iv, Buffer.from(new Uint8Array(ciphertext))])
  );
  return { envelope: envelope, nonce: nonce };
}

app.post('/login', async (req, res) => {
  const jsonEmail = JSON.stringify({ email: req.body.email });
  const { envelope, nonce } = createEnvelope(jsonEmail);

  const headers = {
    headers: { Authorization: 'Bearer ' + uidApiKey },
  };

  try {
    const encryptedResponse = await axios.post(
      uidBaseUrl + '/v2/token/generate',
      envelope,
      headers
    ); //if HTTP response code is not 200, this throws and is caught in the catch handler below.
    const response = decrypt(encryptedResponse.data, uidClientSecret, nonce);

    if (response.status === 'optout') {
      res.render('optout', {
        uidBaseUrl,
        uidJsSdkUrl,
        uidJsSdkName,
        secureSignalsSdkUrl,
        identityName,
        docsBaseUrl
      });
    } else if (response.status !== 'success') {
      res.render('error', {
        error: 'Got unexpected token generate status in decrypted response: ' + response.status,
        response,
        identityName,
        docsBaseUrl
      });
    } else if (typeof response.body !== 'object') {
      res.render('error', {
        error: 'Unexpected token generate response format in decrypted response: ' + response,
        response,
        identityName,
        docsBaseUrl
      });
    } else {
      res.render('login', {
        identity: response.body,
        uidBaseUrl,
        uidJsSdkUrl,
        uidJsSdkName,
        secureSignalsSdkUrl,
        identityName,
        docsBaseUrl
      });
    }
  } catch (error) {
    res.render('error', {
      error,
      response: error.response,
      identityName,
      docsBaseUrl
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
