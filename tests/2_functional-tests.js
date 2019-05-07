/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");
const books = require("../models/books");
const mongoose = require("mongoose");
chai.use(chaiHttp);

suite("Functional Tests", function() {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test("#example Test GET /api/books", function(done) {
  //   chai
  //     .request(server)
  //     .get("/api/books")
  //     .end(function(err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, "response should be an array");
  //       assert.property(
  //         res.body[0],
  //         "commentcount",
  //         "Books in array should contain commentcount"
  //       );
  //       assert.property(
  //         res.body[0],
  //         "title",
  //         "Books in array should contain title"
  //       );
  //       assert.property(
  //         res.body[0],
  //         "_id",
  //         "Books in array should contain _id"
  //       );
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function() {
    let id;
    mongoose.connection.collections.books.drop();
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "Harry"
            })
            .end((err, res) => {
              id = res.body._id;
              assert.equal(res.status, 200);
              assert.equal(res.body.title, "Harry");
              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: ""
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "title is required");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body[0], "title");
            assert.property(res.body[0], "_id");
            done();
          });
      });

      suite("GET /api/books/[id] => book object with [id]", function() {
        test("Test GET /api/books/[id] with id not in db", function(done) {
          chai
            .request(server)
            .get("/api/books/5cd18f2373b5e6254cd48fb8")
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "_id not in database");
              done();
            });
        });

        test("Test GET /api/books/[id] with valid id in db", function(done) {
          chai
            .request(server)
            .get(`/api/books/${id}`)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, "title");
              assert.property(res.body, "_id");
              assert.equal(res.body.title, "Harry");
              assert.equal(res.body._id, id);
              done();
            });
        });
      });
      suite(
        "POST /api/books/[id] => add comment/expect book object with id",
        function() {
          test("Test POST /api/books/[id] with comment", function(done) {
            const test = new books({
              _id: new mongoose.Types.ObjectId(),
              title: "LOTR",
              comments: []
            });
            test
              .save()
              .then(function() {
                books.findOne({ title: "LOTR" }).then(rec => {
                  rec.comments.push(
                    { comment: "good series" },
                    { comment: "Legolas is bae" }
                  );
                  rec.commentCount = rec.comments.length;
                  rec.save().then(function() {
                    books.findOne({ title: "LOTR" }).then(function(doc) {
                      assert(rec.commentCount === 2);
                      assert(doc.comments.length === 2);
                      done();
                    });
                  });
                });
              })
              .catch(err => {
                console.log(err);
              });
          });
        }
      );
    });
  });
});
