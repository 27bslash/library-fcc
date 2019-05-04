const mongoose = require("mongoose");
const comments = require("./comments.js");

const bookSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, unique: true },
  title: { type: String, required: true },
  commentCount: Number,
  comments: [comments]
});

const book = mongoose.model("book", bookSchema);
module.exports = book;
