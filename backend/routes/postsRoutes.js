const express = require('express');
const Post = require('../models/post');
const authCheck = require('../middleware/checkAuth');

const router = express.Router();

// Fetch all posts
router.get('', (req, res, next) => {

  // Store query params
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery
    .then((posts) => {
      fetchedPosts = posts;

      return Post.countDocuments();
    })
    .then(countPost => {
      res.status(200).json({
        posts: fetchedPosts,
        maxPosts: countPost
      })
    });
});

// Get post with specified ID
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(400).json({message: 'post not found'});
    }
  });
});

// Add a new post to DB
router.post('', authCheck,(req, res, next) => {

  const post = new Post({
    postTitle: req.body.postTitle,
    postAuthor: req.body.postAuthor,
    postTags: req.body.postTags,
    postText: req.body.postText,
    postDate: req.body.postDate,
    postCreator: req.userData.userId
  });

  post.save()
    .then(res.status(200).json(true));
});

// Edit post
router.put('/:id', authCheck, (req, res, next) => {
  const post = {
    _id: req.params.id,
    postTitle: req.body.postTitle,
    postAuthor: req.body.postAuthor,
    postTags: req.body.postTags,
    postText: req.body.postText,
    postDate: req.body.postDate,
  };
  Post.updateOne({_id: req.params.id}, post)
    .then(() => {
      res.status(200).json({message: 'post has been updated'})
    });
});

// Delete post
router.delete('/:id', authCheck, (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(
    res.status(200).json({message: 'post deleted'})
  );
});

module.exports = router;
