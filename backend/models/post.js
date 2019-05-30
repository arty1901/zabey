// Импортируем mongoose для создание схемы для БД
const mongoose = require('mongoose');

// Создаем схему для поста
const postSchema = mongoose.Schema({
  postTitle: {type: String, required: true},
  postAuthor: {type: String, required: true},
  postTags: {type: Array, required: true, lowercase: true},
  postText: {type: String, required: true},
  postDate: {type: Date, required: true},
  postCreator: {type: String, required: true}
});

// Экспортируем ее для доступа изнве
module.exports = mongoose.model('Post', postSchema);
