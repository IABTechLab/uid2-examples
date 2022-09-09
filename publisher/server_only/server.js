// Copyright (c) 2022 The Trade Desk, Inc
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice,
//    this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
"use strict";

const axios = require('axios');
const session = require('cookie-session');
const ejs = require('ejs');
const express = require('express');
const nocache = require('nocache');
const { subtle, getRandomValues } = require('crypto').webcrypto;

const app = express();
const port = process.env.PORT || 3000;

const uid2BaseUrl = process.env.UID2_BASE_URL;
const uid2ApiKey = process.env.UID2_API_KEY;
const uid2ClientSecret = process.env.UID2_CLIENT_SECRET;

function bufferToBase64(arrayBuffer) {
  return Buffer.from(arrayBuffer).toString('base64');
}

function base64ToBuffer(base64) {
  return Buffer.from(base64, 'base64');
}


async function encryptRequest(message, base64Key) {
  const cryptoKey = await importKey(base64Key);
  const iv = getRandomValues(new Uint8Array(12));
  const ciphertext = await subtle.encrypt( { name: "AES-GCM", iv: iv }, cryptoKey, message);

  return { ciphertext: ciphertext, iv: iv };
}

function isEqual(array1, array2) {
  for (let i = 0; i < array1.byteLength; i++) {
    if (array1[i] !== array2[i]) return false;
  }
  return true;
}

async function decrypt(base64Response, base64Key, isRefreshResponse, nonceInRequest)  {
  const responseBytes = base64ToBuffer(base64Response);
  const key = await importKey(base64Key);
  const ivLength = 12;
  const iv = responseBytes.subarray(0, ivLength);

  const decrypted = await subtle.decrypt({ "name":"AES-GCM", "iv":iv, tagLength: 128 }, key, responseBytes.subarray(ivLength));

  let payload;
  if (!isRefreshResponse) {
    //The following code shows how we could consume timestamp if needed.
    //const timestamp = new DataView(decrypted.slice(0,8)).getBigInt64(0);
    //const _date = new Date(Number(timestamp));
    const nonceInResponse = decrypted.slice(8, 16);
    if (!isEqual(nonceInRequest, new Uint8Array(nonceInResponse))) {
      throw new Error('Nonce in request does not match nonce in response');
    }
    payload = decrypted.slice(16);
  } else {
    payload = decrypted;
  }

  const responseString = String.fromCharCode.apply(String, new Uint8Array(payload));
  return JSON.parse(responseString);
}

async function importKey(base64Key) {
  const keyArrayBuffer = base64ToBuffer(base64Key);
  return await subtle.importKey("raw", keyArrayBuffer, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

async function createEnvelope(payload) {
  const millisec = BigInt(Date.now());
  const bufferMillisec = new ArrayBuffer(8);
  new DataView(bufferMillisec).setBigInt64(0, millisec);

  const nonce = getRandomValues(new Uint8Array(8));
  const payloadEncoded = new TextEncoder().encode(payload);
  const body = Buffer.concat([Buffer.from(new Uint8Array(bufferMillisec)), nonce, payloadEncoded]);

  const { ciphertext, iv } = await encryptRequest(body, uid2ClientSecret);

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
  return identity.refresh_token;
}

async function refreshIdentity(identity) {
  const headers = {
    headers: { 'Authorization': 'Bearer ' + uid2ApiKey  }
  };

  try {
    const encryptedResponse = await axios.post(uid2BaseUrl + '/v2/token/refresh', identity.refresh_token, headers);

    const response = await decrypt(encryptedResponse.data, identity.refresh_response_key, true);

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
async function verifyIdentity(req) {
  if (!isRefreshableIdentity(req.session.identity)) {
    return false;
  }

  if (Date.now() >= req.session.identity.refresh_from || Date.now() >= req.session.identity.identity_expires) {
    req.session.identity = await refreshIdentity(req.session.identity);
    return !!req.session.identity;
  }
  return !!req.session.identity;
}
async function protect(req, res, next){
  if (await verifyIdentity(req)) {
    next();
  } else {
    req.session = null;
    res.redirect('/login');
  }
}

app.get('/', protect, (req, res) => {
  res.render('index', { identity: req.session.identity });
});
app.get('/content1', protect, (req, res) => {
  res.render('content', { identity: req.session.identity, content: 'First Sample Content' });
});
app.get('/content2', protect, (req, res) => {
  res.render('content', { identity: req.session.identity, content: 'Second Sample Content' });
});
app.get('/login', async (req, res) => {
  if (await verifyIdentity(req)) {
    res.redirect('/');
  } else {
    req.session = null;
    res.render('login');
  }
});

app.post('/login', async (req, res) => {

  const jsonEmail = JSON.stringify({ 'email': req.body.email });
  const { envelope, nonce } = await createEnvelope(jsonEmail);

  const headers = {
    headers: { 'Authorization': 'Bearer ' + uid2ApiKey  }
  };

  try {
    const encryptedResponse = await axios.post(uid2BaseUrl + '/v2/token/generate', envelope, headers); //if HTTP response code is not 200, this throws and is caught in the catch handler below.
    const response = await decrypt(encryptedResponse.data, uid2ClientSecret, false, nonce);

    if (response.status !== 'success') {
      res.render('error', { error: 'Got unexpected token generate status in decrypted response: ' + response.status, response: response });
    } else if (typeof response.body !== 'object') {
      res.render('error', { error: 'Unexpected token generate response format in decrypted response: ' + response, response: response });
    } else {
      req.session.identity = response.body;
      res.redirect('/');
    }
  } catch (error) {
    res.render('error', { error: error, response: error.response });
  }

});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
