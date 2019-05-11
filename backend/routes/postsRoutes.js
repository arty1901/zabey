const express = require('express');
const Post = require('../models/post');

const router = express.Router();

router.get('', (req, res, next) => {
  const postQuery = Post.find();
  postQuery
    .then(posts => {
      res.status(200).json({
        message: 'all ok',
        posts: posts
      })
    });
});

router.get('/:id', (req, res, next) => {
  console.log(req.params.id);
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(400).json({message: 'post not found'});
    }
  });
});

router.post('', (req, res, next) => {
  console.log(req.body);
  const post = new Post({
    postTitle: req.body.postTitle,
    postAuthor: req.body.postAuthor,
    postTags: req.body.postTags,
    postText: req.body.postText,
    postDate: req.body.postDate,
  });

  post
    .save()
    .then(createdPost => {
      res.status(200).json({
        message: 'Post created Successfuly',
        // post: {
        //   ...createdPost,
        //   id: createdPost._id
        // }
      });
    })
});

module.exports = router;
