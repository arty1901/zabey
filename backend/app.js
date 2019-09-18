const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import external routes
const postsRoutes = require('./routes/postsRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoute = require('./routes/searchRoute');

const app = express();

mongoose.connect('mongodb+srv://user:ERlpNaxujaDPieU3@cluster0-esitb.mongodb.net/zabeyDB?retryWrites=true', { useNewUrlParser: true })
  .then(() => {
    console.log('connected')
  })
  .catch(() => {
    console.log('not connected')
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({credentials: true, origin: true}));
/**
 * Any request, witch targeting to the images
 * wil be allowed to continue and fetch their files from there
 */
// app.use('/images', express.static(path.join('backend/images')))

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-with, Content-Type, Accept, Authorization'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PUT, PATCH, DELETE, OPTIONS'
//   );
//   next();
// });

app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoute);

module.exports = app;
