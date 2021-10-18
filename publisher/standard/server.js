const express = require('express')
const app = express()
const port = 3000

const axios = require('axios');
const uid2BaseUrl = process.env.UID2_BASE_URL;
const uid2ApiKey = process.env.UID2_API_KEY;

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.get('/', function(req, res){
  res.render('index', {uid2BaseUrl: uid2BaseUrl});
});
app.post('/login', function(req, res){
  axios.get(uid2BaseUrl + '/v1/token/generate?email=' + encodeURIComponent(req.body.email), {headers: {'Authorization': 'Bearer ' + uid2ApiKey}})
    .then((response) => {
        if (response.data.status !== 'success') {
            res.render('error', {error: 'Got unexpected token refresh status: ' + response.data.status});
        } else if (typeof response.data.body !== 'object') {
            res.render('error', {error: 'Unexpected token refresh response format: ' + response.data});
        } else {
            res.render('login', {identity: response.data.body, uid2BaseUrl: uid2BaseUrl});
        }
    })
    .catch((error) => {
        res.render('error', {error: error});
    });
});
app.post('/logout', function(req, res){
  res.render('logout', {uid2BaseUrl: uid2BaseUrl});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
