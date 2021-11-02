const axios = require('axios');
const session = require('cookie-session');
const ejs = require('ejs');
const express = require('express');
const nocache = require('nocache');

const app = express();
const port = 3000;

const uid2BaseUrl = process.env.UID2_BASE_URL;
const uid2ApiKey = process.env.UID2_API_KEY;

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
  if (!identity.refresh_token) {
    return false;
  }
  return true;
}
async function refreshIdentity(identity) {
  try {
    const response = await axios.get(
      uid2BaseUrl + '/v1/token/refresh?refresh_token=' + encodeURIComponent(identity.refresh_token),
      { headers: { 'Authorization': 'Bearer ' + uid2ApiKey } });
    if (response.data.status === 'optout') {
      return undefined;
    } else if (response.data.status !== 'success') {
      throw new Error('Got unexpected token refresh status: ' + response.data.status);
    } else if (isRefreshableIdentity(response.data.body) || response.data.body.identity_expires <= Date.now()) {
      throw new Error('Invalid identity in token refresh response: ' + response.data);
    }
    return response.data.body;
  } catch (err) {
    console.error('Identity refresh failed: ' + err);
    return Date.now() >= identity.identity_expires ? undefined : identity;
  }
}
async function verifyIdentity(req) {
  if (!isRefreshableIdentity(req.session.identity)) {
    return false;
  }
  if (Date.now() >= identity.refresh_from || Date.now() >= identity.identity_expires) {
    req.session.identity = await refreshIdentity(req.session.identity);
    return !!req.session.identity;
  }
  return !!req.session.identity;
}
async function protected(req, res, next){
  if (await verifyIdentity(req)) {
    next();
  } else {
    req.session = null;
    res.redirect('/login');
  }
}

app.get('/', protected, (req, res) => {
  res.render('index', { identity: req.session.identity });
});
app.get('/content1', protected, (req, res) => {
  res.render('content', { identity: req.session.identity, content: 'First Sample Content' });
});
app.get('/content2', protected, (req, res) => {
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
app.post('/login', (req, res) => {
  axios.get(uid2BaseUrl + '/v1/token/generate?email=' + encodeURIComponent(req.body.email), { headers: { 'Authorization': 'Bearer ' + uid2ApiKey } })
    .then((response) => {
      if (response.data.status !== 'success') {
        res.render('error', { error: 'Got unexpected token generate status: ' + response.data.status, response: response });
      } else if (typeof response.data.body !== 'object') {
        res.render('error', { error: 'Unexpected token generate response format: ' + response.data, response: response });
      } else {
        req.session.identity = response.data.body;
        res.redirect('/');
      }
    })
    .catch((error) => {
        res.render('error', { error: error, response: error.response });
    });
});
app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
