const axios = require('axios');
const session = require('cookie-session');
const ejs = require('ejs');
const express = require('express')
const nocache = require('nocache');

const app = express()
const port = 3000

const uid2BaseUrl = process.env.UID2_BASE_URL;
const uid2ApiKey = process.env.UID2_API_KEY;

app.use(session({
  keys: [ process.env.SESSION_KEY ],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(nocache());

function loggedIn(identity, now){
  if (!identity || typeof identity !== 'object') {
    return false;
  }
  if (!identity.refresh_expires || now >= identity.refresh_expires) {
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
    if (response.data.status !== 'success') {
      throw new Error('Got unexpected token generate status: ' + response.data.status);
    } else if (typeof response.data.body !== 'object') {
      throw new Error('Unexpected token generate response format: ' + response.data);
    }
    return response.data.body;
  } catch (err) {
    console.log('Identity refresh failed: ' + err);
    return undefined;
  }
}
async function refreshIdentityIfNecessary(identity, now) {
  if (!loggedIn(identity, now)) {
    return undefined;
  }
  if (now >= identity.refresh_from) {
    const updatedIdentity = await refreshIdentity(identity);
    if (!updatedIdentity) {
      return now >= identity.identity_expires ? undefined : identity;
    } else {
      return updatedIdentity;
    }
  }

  return identity;
}
async function protected(req, res, next){
  const now = Date.now();
  req.session.identity = await refreshIdentityIfNecessary(req.session.identity, now);
  if (loggedIn(req.session.identity, now)) {
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
app.get('/login', (req, res) => {
  if (loggedIn(req)) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});
app.post('/login', (req, res) => {
  axios.get(uid2BaseUrl + '/v1/token/generate?email=' + encodeURIComponent(req.body.email), { headers: { 'Authorization': 'Bearer ' + uid2ApiKey } })
    .then((response) => {
      if (response.data.status !== 'success') {
        res.render('error', { error: 'Got unexpected token generate status: ' + response.data.status });
      } else if (typeof response.data.body !== 'object') {
        res.render('error', { error: 'Unexpected token generate response format: ' + response.data });
      } else {
        req.session.identity = response.data.body;
        res.redirect('/');
      }
    })
    .catch((error) => {
        res.render('error', { error: error });
    });
});
app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
