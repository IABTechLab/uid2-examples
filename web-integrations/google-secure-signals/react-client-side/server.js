require('dotenv').config({ path: '../../../.env' });

console.log('process.env', process.env);

const ejs = require('ejs');

const express = require('express');

const app = express();

const port = process.env.PORT || 3044;

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(express.static('public', { type: 'application/javascript' }));

app.get('/', (req, res) => {
  res.render('index', {});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
