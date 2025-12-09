"use strict";

const axios = require('axios');
const session = require('cookie-session');
const ejs = require('ejs');
const express = require('express');
const nocache = require('nocache');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3033;

const uidBaseUrl = process.env.UID_SERVER_BASE_URL;
const uidApiKey = process.env.UID_API_KEY;
const uidClientSecret = process.env.UID_CLIENT_SECRET;

// UI/Display configuration
const identityName = process.env.IDENTITY_NAME;
const docsBaseUrl = process.env.DOCS_BASE_URL;

const ivLength = 12;
const nonceLength = 8;
const timestampLength = 8;
const encryptionAlgo = 'aes-256-gcm';


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

function decrypt(base64Response, base64Key, isRefreshResponse, nonceInRequest)  {
  const responseBytes = base64ToBuffer(base64Response);
  const iv = responseBytes.subarray(0, ivLength);

  const decipher = crypto.createDecipheriv(encryptionAlgo, base64ToBuffer(base64Key), iv);

  const tagLength = 16;
  const tag = responseBytes.subarray(responseBytes.length - tagLength);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(responseBytes.subarray(ivLength, responseBytes.length - tagLength)), decipher.final()]);

  let payload;
  if (!isRefreshResponse) {
    //The following code shows how we could consume timestamp if needed.
    //const timestamp = new DataView(decrypted.subarray(0, timestampLength)).getBigInt64(0);
    //const _date = new Date(Number(timestamp));
    const nonceInResponse = decrypted.subarray(timestampLength, timestampLength + nonceLength);
    if (!isEqual(nonceInRequest, new Uint8Array(nonceInResponse))) {
      throw new Error('Nonce in request does not match nonce in response');
    }
    payload = decrypted.subarray(timestampLength + nonceLength);
  } else {
    payload = decrypted;
  }

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

  const envelopeVersion =  Buffer.alloc(1, 1);
  const envelope = bufferToBase64(Buffer.concat([envelopeVersion, iv, Buffer.from( new Uint8Array(ciphertext))]));
  return { envelope: envelope, nonce: nonce };
}


app.use(session({
  keys: [ process.env.SESSION_KEY ],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Healthcheck endpoint for Kubernetes probes
app.get('/ops/healthcheck', (req, res) => {
  res.status(200).send('healthy\n');
});

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(nocache());

function isRefreshableIdentity(identity){
  if (!identity || typeof identity !== 'object') {
    return false;
  }
  if (!identity.refresh_expires || Date.now() >= identity.refresh_expires) {
    return false;
  }
  return !!identity.refresh_token;
}

async function refreshIdentity(identity) {
  const headers = {
    headers: { 'Authorization': 'Bearer ' + uidApiKey  }
  };

  try {
    const encryptedResponse = await axios.post(uidBaseUrl + '/v2/token/refresh', identity.refresh_token, headers);

    let response;
    if (identity.refresh_response_key) {
      response = decrypt(encryptedResponse.data, identity.refresh_response_key, true);
    } else {
      response = encryptedResponse.data;
    }

    if (response.status === 'optout') {
      return undefined;
    } else if (response.status !== 'success') {
      throw new Error('Got unexpected token refresh status: ' + response.status);
    } else if (!isRefreshableIdentity(response.body) || response.body.identity_expires <= Date.now()) {
      throw new Error('Invalid identity in token refresh response: ' + response);
    }
    return response.body;
  } catch (err) {
    console.error('Identity refresh failed: ' + err);
    return Date.now() >= identity.identity_expires ? undefined : identity;
  }
}

async function getValidIdentity(req) {
  if (!isRefreshableIdentity(req.session.identity)) {
    return null;
  }

  if (Date.now() >= req.session.identity.refresh_from || Date.now() >= req.session.identity.identity_expires) {
    req.session.identity = await refreshIdentity(req.session.identity);
  }

  return req.session.identity;
}

// Main page - shows login form or identity state
app.get('/', async (req, res) => {
  const identity = await getValidIdentity(req);
  
  res.render('index', { 
    identity: identity,
    isOptout: false,
    identityName,
    docsBaseUrl
  });
});

app.post('/login', async (req, res) => {
  const jsonEmail = JSON.stringify({ 'email': req.body.email });
  const { envelope, nonce } = createEnvelope(jsonEmail);

  const headers = {
    headers: { 'Authorization': 'Bearer ' + uidApiKey  }
  };

  try {
    const encryptedResponse = await axios.post(uidBaseUrl + '/v2/token/generate', envelope, headers);
    const response = decrypt(encryptedResponse.data, uidClientSecret, false, nonce);

    if (response.status === 'optout') {
      // User has opted out - show optout state
      req.session.identity = null;
      res.render('index', { 
        identity: null,
        isOptout: true,
        identityName,
        docsBaseUrl
      });
    } else if (response.status !== 'success') {
      // Error - show error state
      res.render('index', { 
        identity: null,
        isOptout: false,
        error: 'Got unexpected token generate status: ' + response.status,
        identityName,
        docsBaseUrl
      });
    } else if (typeof response.body !== 'object') {
      // Error - show error state
      res.render('index', { 
        identity: null,
        isOptout: false,
        error: 'Unexpected token generate response format',
        identityName,
        docsBaseUrl
      });
    } else {
      // Success - store identity and show logged in state
      req.session.identity = response.body;
      res.render('index', { 
        identity: response.body,
        isOptout: false,
        identityName,
        docsBaseUrl
      });
    }
  } catch (error) {
    console.error('Token generation failed:', error);
    res.render('index', { 
      identity: null,
      isOptout: false,
      error: 'Token generation failed: ' + error.message,
      identityName,
      docsBaseUrl
    });
  }
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
