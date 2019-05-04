/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const books = require("../models/books");
const comments = require("../models/comments");
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
mongoose.connect(process.env.DB);
mongoose.promise = global.Promise;
mongoose.set("debug", true);

module.exports = function(app) {
  app
    .route("/api/books")
    .get(function(req, res) {
      books.find({}, (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          console.log("doc", doc);
          res.send("c");
        }
      });

      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function(req, res) {
      var title = req.body.title;

      books.findOne({ title }, (err, doc) => {
        if (err) {
          console.log(err);
        } else if (doc) {
          console.log("doc", doc);
          res.send(doc);
        } else if (!doc) {
          console.log("g");
          const book = books({
            _id: new mongoose.Types.ObjectId(),
            title: title,
            commentCount: 1
            // comments: [comments]
          });
          book.save();
          res.send(book);
        }
      });
      //response will contain new book object including atleast _id and title
    })

    .delete(function(req, res) {
      books.collection.drop(err => {
        if (err) {
          throw new Error(err);
        } else {
          console.log('deletet')
          res.send("deletion successful");
        }
      });
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      var bookid = req.params.id;
      books.findOne({ _id: bookid }, (err, doc) => {
        if (err) {
          console.log("findError");
        } else if (doc) {
          res.send(doc);
        }
      });
    })
    //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

    .post(function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function(req, res) {
      var bookid = req.params.id;
      if (mongoose.Types.ObjectId.isValid(bookid)) {
        books.findByIdAndDelete({ _id: bookid }, (err, doc) => {
          if (err) {
            console.log(err);
          } else if (doc) {
            res.send("success: deleted " + bookid);
          } else {
            console.log("doc not found");
            res.send("doc not found");
          }
        });
      } else {
        res.send("invalid Id");
      }
      //if successful response will be 'delete successful'
    });
};
