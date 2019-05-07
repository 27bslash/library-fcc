const mongoose = require("mongoose");
const commentSchema = require("./comments");


const bookSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, unique: true },
  title: { type: String, required: true },
  commentCount: Number,
  comments: [commentSchema]
});

const book = mongoose.model("book", bookSchema);
module.exports = book;
