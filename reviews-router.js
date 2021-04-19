const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId;
const Movie = require("./models/MovieModel");
const User = require("./models/UserModel");
const Person = require("./models/PersonModel");
const Review = require("./models/ReviewModel");
const Notification = require("./models/NotificationModel");
const express = require('express');
let router = express.Router();

router.post("/", createReview, pushReviewIDtoUser, pushReviewIDtoMovie, getUser, createNotificationObject, pushNotificationIDtoFollowers);

//////////////////////////CREATES A NEW REVIEW RESOURCE////////////////////////////////////

//creates a review document based off of the Review schema
function createReview(req, res, next){
  if(req.session.loggedin){
    //creates a Review document based off provided information
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
    //saves the document
    newReview.save(function(err, user) {
        if (err){
          if(err.name === 'ValidationError'){
            res.sendStatus(400); //Bad request, the data send by the client failed to get verified and added.
          }
          else{
            console.log(err);
            res.sendStatus(500);
            //the server had an error saving this document that did not involve validation
          }
        }
        else{
          req.reviewObject = newReview;
          next();
        }
      });
  }
  else{
    res.sendStatus(401);
    //Authentication is required and has failed or has not yet been provided.

  }
}

//pushes the newly made review's ID to the logged in user's list of reviews
function pushReviewIDtoUser(req, res, next){
  User.findByIdAndUpdate(req.session.userID,
  {$push: {"reviews": req.reviewObject._id}},
  { "new": true, "upsert": true },
  function(err, result){
    if(err){
      console.log(err);
      res.sendStatus(500);
      //the logged in user's ID in session has already been verified, and the review ID was just created
      //so this is a server error
    }
    else{
      next();
    }
  });
}


//appends the newly made review's ID to the movie it was created for
function pushReviewIDtoMovie(req, res, next){
  Movie.findByIdAndUpdate(req.reviewObject.movieId,
  {$push: {"reviews": req.reviewObject._id}},
  { "new": true, "upsert": true },
  function(err, result){
    if(err){
      console.log(err);
      res.sendStatus(500);
      //the movie ID came straight from the URL where the review was made, and the review ID was just created
      //so this is a server error
    }
    else{
        //calculates the average rating of the movie with the newly added review
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

//gets the user object of the user in session (logged-in user)
function getUser(req, res, next){
  User.findById(req.session.userID, function(err, result){
    if(err){
      res.sendStatus(500);
      //the logged in user's ID in session has already been verified, so this is a server error
    }
    else{
      req.user = result;
      next();
    }
  });
}

//creates a Notification object so that the followers of the logged-in user can get an alert that a review has been made
function createNotificationObject(req, res, next){
  //creates a new Notification document
  let newNotification = new Notification();
  newNotification._id = mongoose.Types.ObjectId();
  newNotification.user = req.session.userID;
  newNotification.movieId = req.reviewObject.movieId;
  newNotification.nType = 0;
  //saves the document
  newNotification.save(function(err, user) {
      if (err) {
          console.log(err);
          res.status(500).send(req.reviewObject);
          //everything up until this point should've been verified, so this is a server error.
        }
      else{
        req.notification = newNotification;
        next();
      }
    });
}

//pushes the Notification object ID to the notifications array of each of the followers on the logged-in user
function pushNotificationIDtoFollowers(req, res, next){
  User.updateMany({'_id': {$in: req.user.followers}}, { $push: { "notifications": req.notification._id }}, function(err, results){
    if(err){
      console.log(err);
      res.status(500).send(req.reviewObject);
      //these ids should've already been verified by the server, so if they can't be added then the server has a problem.
    }
    else{
      res.status(201).send(req.reviewObject);
      //sends back the newly made review object
    }
  });
}

//Export the router so it can be mounted in the main app
module.exports = router;
