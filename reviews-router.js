const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId;
const Movie = require("./models/MovieModel");
const User = require("./models/UserModel");
const Person = require("./models/PersonModel");
const Review = require("./models/ReviewModel");
const Notification = require("./models/NotificationModel");
const express = require('express');
let router = express.Router();

/*
router.post("/", express.json(), addReview); //adds a new review
router.get("/:id", getReview); //sends review with ID (PUG or JSON)

*/
//now create the functions above! Look at the store-server if confused. Those functions above are just examples btw.
router.post("/", createReview, pushReviewIDtoUser, pushReviewIDtoMovie, getUser, createNotificationObject, pushNotificationIDtoFollowers);

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
            res.sendStatus(400); //bad content
          }
        else{
          //console.log(newReview);
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
      res.sendStatus(500); //server error
    }
    else{
      //console.log("user results" + result);
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
        //console.log("movie results" + result);
        if(!result.rating){
          result.rating = req.body.rating;
          result.save()
        }
        else{
          result.rating = result.calcAvRating(req.body.rating);
          result.save()
        }
        next();
    }
  });
}

function getUser(req, res, next){
  User.findById(req.session.userID, function(err, result){
    if(err){
      res.sendStatus(500);
    }
    else{
      req.user = result;
      next();
    }
  });
}

function createNotificationObject(req, res, next){
  let newNotification = new Notification();
  newNotification._id = mongoose.Types.ObjectId();
  newNotification.user = req.session.userID;
  newNotification.movieId = req.reviewObject.movieId;
  newNotification.nType = 0;
  newNotification.save(function(err, user) {
      if (err) {
          console.log(err);
          res.status(500).send(req.reviewObject); //everything up until this point should've been verified, so this is a server error.
        }
      else{
        req.notification = newNotification;
        next();
      }
    });
}

function pushNotificationIDtoFollowers(req, res, next){
  User.updateMany({'_id': {$in: req.user.followers}}, { $push: { "notifications": req.notification._id }}, function(err, results){
    if(err){
      console.log(err);
      res.status(500).send(req.reviewObject);
      //these ids should've already been verified by the server, so if they can't be added then the server has a problem.
    }
    else{
      console.log(results);
      res.status(201).send(req.reviewObject);
    }
  });
}

//Export the router so it can be mounted in the main app
module.exports = router;
