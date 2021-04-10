const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId;
const Movie = require("./models/MovieModel");
const User = require("./models/UserModel");
const Person = require("./models/PersonModel");
const Review = require("./models/ReviewModel");
const Notifcation = require("./models/NotificationModel");
const express = require('express');
let router = express.Router();

/*
router.post("/", express.json(), addReview); //adds a new review
router.get("/:id", getReview); //sends review with ID (PUG or JSON)

*/
//now create the functions above! Look at the store-server if confused. Those functions above are just examples btw.
router.post("/", createReview, pushReviewIDtoUser, pushReviewIDtoMovie);

function createReview(req, res, next){
  if(req.session.loggedin){
    let newReview = new Review();
    newReview._id = mongoose.Types.ObjectId();
    newReview.username = req.session.userID;
    newReview.movieId = mongoose.Types.ObjectId(req.body.movieID);
    newReview.rating = req.body.rating;
    if(req.body.hasOwnProperty("briefsummary")){
      newReview.briefsummary = req.body.briefsummary;
    }
    if(req.body.hasOwnProperty("review")){
      newReview.review = req.body.review;
    }
    newReview.save(function(err, user) {
        if (err) {
            console.log(err);
            res.send(400); //bad content
          }
        else{
          console.log(newReview);
          req.reviewObject = newReview;
          next();
        }
      });
  }
  else{
    res.sendStatus(401); //or whatever to indicate unauthorized
  }
}

function pushReviewIDtoUser(req, res, next){
  User.findByIdAndUpdate(req.session.userID,
  {$push: {"reviews": req.reviewObject._id}},
  { "new": true, "upsert": true },
  function(err, result){
    if(err){
      console.log(err);
      res.sendStatus(400); //bad content
    }
    else{
      console.log("user results" + result);
      next();
    }
  });
}

function pushReviewIDtoMovie(req, res, next){
  Movie.findByIdAndUpdate(req.reviewObject.movieId,
  {$push: {"reviews": req.reviewObject._id}},
  { "new": true, "upsert": true },
  function(err, result){
    if(err){
      console.log(err);
      res.sendStatus(400); //bad content
    }
    else{
        console.log("movie results" + result);
        res.status(201).send(req.reviewObject);
    }
  });
}


//Export the router so it can be mounted in the main app
module.exports = router;
