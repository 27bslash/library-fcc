/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";


const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const books = require("../models/books");
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
          res.json(doc);
        }
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentCount": num_of_comments },...]
    })

    .post(function(req, res) {
      var title = req.body.title;
      let result = {};
      if (!title) {
        res.send("title is required");
      } else {
        books.findOne({ title }, (err, doc) => {
          if (err) {
            console.log(err);
          } else if (doc) {
            res.send(doc);
          } else if (!doc) {
            const book = books({
              _id: new mongoose.Types.ObjectId(),
              title: title
            });
            book.save();
            result._id = book._id;
            result.title = book.title;
            res.send(result);
          }
        });
      }
      //response will contain new book object including atleast _id and title
    })

    .delete(function(req, res) {
      books.collection.drop(err => {
        if (err) {
          throw new Error(err);
        } else {
          res.send("complete delete successful");
        }
      });
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      var bookid = req.params.id;
      if (mongoose.Types.ObjectId.isValid(bookid)) {
        books.findOne({ _id: bookid }, (err, doc) => {
          if (err) {
            console.log("findError");
          } else if (doc) {
            res.json(doc);
          } else {
            res.send("_id not in database");
          }
        });
      } else {
        res.send("invalid _id");
      }
    })
    //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

    .post(function(req, res) {
      var bookid = req.params.id;
      var commStr = req.body.comment;
      let title;
      let result = {
        _id: bookid,
        title,
        comments: []
      };
      if (!commStr) {
        res.send("please enter a comment");
      } else if (mongoose.Types.ObjectId.isValid(bookid)) {
        books
          .findOne({ _id: bookid })
          .then(function(doc) {
            doc.comments.push({ comment: commStr });
            doc.commentCount = doc.comments.length;
            doc.save();
            result.title = doc.title;
            result.commentCount = doc.commentCount;
            result.comments = doc.comments;
            res.send(result);
          })
          .catch(err => {
            console.log(err);
            res.send("_id not in DB");
          });
      } else {
        res.send("invalid _id");
      }
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
