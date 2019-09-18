const express = require('express');
const Post = require('../models/post');
const authCheck = require('../middleware/checkAuth');
const algoliasearch = require('algoliasearch');

const client = algoliasearch('7US0C5AKLU', '0ff92ba3000c69672407b95ac47513f6');
const index = client.initIndex('posts');

const router = express.Router();

// TODO: add a helper function, witch cover a request for posts for all posts and users posts
// TODO: add algolia's CRUD methods
// TODO: add errors handlers

// Get all posts
router.get('', (req, res) => {

  // Store query params
  const pageSize = +req.query.pageSize;
  const page = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && page) {
    postQuery
      .skip(pageSize * (page - 1))
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

//get all user`s posts
router.get('/userPosts', authCheck, (req, res) => {

  // Store query params
  const pageSize = +req.query.pageSize;
  const page = +req.query.page;
  const userId = req.userData.userId;

  index.search({
    query: userId,
    hitsPerPage: pageSize,
    page: page - 1
  }, (err, {hits, nbHits} = {}) => {

    if (err) res.status(404);

    res.status(200).json({
      posts: hits,
      count: nbHits
    })
  });
});

// Get post with specified ID
router.get('/:id', (req, res) => {

  index.getObject(req.params.id, (error, content) => {
    if (error) res.status(404);

    res.status(200).json(content);
  });
});

// Add a new post to DB
router.post('', authCheck, (req, res, next) => {

  const post = new Post({
    postTitle: req.body.postTitle,
    postAuthor: req.body.postAuthor,
    authorId: req.userData.userId,
    postTags: req.body.postTags,
    postText: req.body.postText,
    postDate: req.body.postDate,
  });

  index.addObject(post, (error, {objectID} = {}) => {
    post._id = objectID;

    post.save().then(() => {
      res.status(200).json(true);
    })
  });
});

// Edit post
router.put('/edit/:id', authCheck, (req, res) => {

  const post = {
    postTitle: req.body.postTitle,
    postTags: req.body.postTags,
    postText: req.body.postText,
    postDate: req.body.postDate,
  };
  const objectID = req.params.id;

  index.partialUpdateObject({...post, objectID}, (err) => {
    if (err) res.status(400).json(false);
  });

  Post.updateOne({_id: req.params.id}, post)
    .then(() => {
      res.status(200).json(true);
    })
    .catch(error => {
      res.status(400);
    })
});

// Delete post
router.delete('/:id', authCheck, (req, res) => {

  Post.deleteOne({_id: req.params.id})
    .then(() => {
      res.status(200).json(true);
    })
    .catch(() => {
      res.status(400).json(false);
    });

  index.deleteObject(req.params.id, (err) => {
    if (err) res.status(400).json(false)
  });

});

// Add comment to the post
router.post('/comment', (req, res, next) => {
  const comment = {
    author: req.body.author,
    text: req.body.text
  };
  const id = req.body.id;
  let postComments = [];

  // TODO: add algolia post`s update by post id

  index.getObject(id)
    .then(content => {
      postComments = content.postComments;
      postComments.push(comment);

      index.partialUpdateObject({postComments, objectID: id})
        .then(() => {
          Post.findOne({_id: id})
            .then(post => {
              post.postComments.push(comment);
              post.save()
                .then(() => {
                  res.status(200).json(true);
                })
            });
        })
    });
});

// Add/Remove like
router.put('/likePost', authCheck, (req, res, next) => {

  const userId = req.userData.userId;
  Post.findById(req.body.id)
    .then(post => {

      if (post.postLikedBy.includes(userId)) {

        let arrayIndex = post.postLikedBy.indexOf(userId);

        // Если пользователь найден, то лайк убираем
        post.postLikeCounter--;
        post.postLikedBy.splice(arrayIndex, 1);
        post.save()
          .then(res.status(200).json('like reduced'));
      } else {

        // Если пользователь не найден, то добавляем лайк
        post.postLikeCounter++;
        post.postLikedBy.push(userId);
        post.save()
          .then(res.status(200).json('like added'));
      }

    });
});

function searchRequest(query = '', page = 0, pageSize = 0) {

  index.search({
    query: query,
    page: page,
    hitsPerPage: pageSize
  }, (err, {hits, nbHits} = {}) => {

    if (err) throw err;
    console.log(hits);
    return {hits, nbHits}
  })
}


module.exports = router;
