const express = require('express');
const Post = require('../models/post');

const router = express.Router();

router.get('', (req, res, next) => {
  res.status(200).json({message: 'all ok'});
});

router.post('', (req, res, next) => {
  const post = new Post({
    postName: req.body.postName,
    postAuthor: req.body.postAuthor,
    postTags: req.body.postTags,
    postText: req.body.postText,
    postDate: req.body.postDate,
  });

  post.save()
    .then(createdPost => {
      res.status(200).json({
        message: 'Post created Successfuly',
        post: {
          ...createdPost,
          id: createdPost._id
        }
      })
    })
});

module.exports = router;
