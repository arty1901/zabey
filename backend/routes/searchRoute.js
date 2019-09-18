const express = require('express');
const Post = require('../models/post');
const algoliasearch = require('algoliasearch');

const client = algoliasearch('7US0C5AKLU', '5dc7aa0e120f41ce971b56f3b6b772a7');
const index = client.initIndex('posts');

const router = express.Router();

// Search posts by tag
router.get('/tag', (req, res) => {
  const query = req.query.request;

  Post.find({'postTags.name': query}, (error, data) => {
    res.status(200).json({data});
  })
});

router.get('/query', (req, res, next) => {
  const query = req.query.q;

  index.search({query}, (err, {hits} = {}) => {

    if (err) throw err;


    res.status(200).json({
      result: hits
    });
  });
});

module.exports = router;
