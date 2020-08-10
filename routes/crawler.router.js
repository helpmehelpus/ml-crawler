const express = require('express');

const crawler = require('../controllers/crawler');

const router = express.Router();

router.route('/')
  .post((req, res) => {
    crawler.scrape(req.body.search, req.body.limit, req.body.deepSearch)
      .then((result) => res.json(result))
      .catch((err) => res.status(err.code || 500).send(err));
  });

module.exports = router;