const express = require('express');

const Crawler = require('../controllers/crawler');
const crawler = new Crawler();

const router = express.Router();

router.route('/')
  .post((req, res) => {
    crawler.search(req.body.search, req.body.limit)
      .then((result) => res.json(result))
      .catch((err) => res.status(err.code || 500).send(err));
  });

module.exports = router;