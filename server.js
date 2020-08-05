const bodyParser = require('body-parser');
const express = require('express');
const crawler = require('./routes/crawler.router');

const app = express();

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Running server on port ${PORT}`);
});

app.use('/search', crawler);

module.exports = app;
