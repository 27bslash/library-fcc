const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: String
});
const comment = mongoose.model("comment", commentSchema);
module.exports = commentSchema;
