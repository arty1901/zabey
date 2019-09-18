// Импортируем mongoose для создание схемы для БД
const mongoose = require('mongoose');

// Создаем схему для поста
const postSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  postTitle: {type: String, required: true},
  postAuthor: {type: String, required: true},
  authorId: {type: String, required: true},
  postTags: {type: Array, required: true, lowercase: true},
  postText: {type: String, required: true},
  postDate: {type: Date, required: false, default: Date.now},
  postLikeCounter: {type: Number, default: 0},
  postLikedBy: {type: [String]},
  postComments: [{
    text: {type: String, required: true},
    author: {type: String, required: true},
    date: {type: Date, required: false, default: Date.now},
  }]
});

// Экспортируем ее для доступа изнве
module.exports = mongoose.model('Post', postSchema);
