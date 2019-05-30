const express = require('express');
const bcrypt = require('bcrypt');
const jswb = require('jsonwebtoken');

const User = require('../models/user');
const router = express.Router();

router.post('/signup', (req, res, next) => {
  /*
  * crypt the password of the user
  *hash(data, salt, progress, cb)
  * */
  bcrypt.hash(req.body.password, 10).then( (hash) => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
      .then(result => {
        res.status(200).json({
          message: 'user is added',
          result: result
        })
      });
  })
});

router.post('/login', (req, res, next) => {

  let foundedUser;
  // Find an user by email
  User.findOne({email: req.body.email})
    .then(user => {

      if (!user) {
        return res.status(401).json({
          message: 'Auth Failed',
          authStatus: false
        })
      }

      // Store the founded user in external variable
      foundedUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then(compareResult => {

      // If user typed a correct password
      if (!compareResult) {
        return res.status(401).json({
          massage: 'Incorrect Password',
          authStatus: true
        });
      }

      const token = jswb.sign({
        email: foundedUser.email,
        userId: foundedUser._id
      },
        'Lorem_ipsum_dolor_sit_amet',
        {
          expiresIn: '1h'
        }
      );

      res.status(200).json({
        userToken: token,
        expireIn: 3600,
        userId: foundedUser._id
      })
    })
});

module.exports = router;
