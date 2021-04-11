const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const Movie = require("./models/MovieModel");
const User = require("./models/UserModel");
const Person = require("./models/PersonModel");
const Review = require("./models/ReviewModel");
const Notifcation = require("./models/NotificationModel");
const express = require('express');
let router = express.Router();

/*

router.get("/", searchMovie); //or queryparser idk whatever we wanna call the functions
router.post("/", express.json(), createMovie); //create a movie and add to the database
//also dave had express.json() as the first step for adding a new product in his store-server example so ig this parses the data.

router.get("/:id", sendMovie); //sends movie with ID (PUG or JSON)
router.get("/:id/reviews", populateReviewIds, sendReviews);
//- Supports response types application/json
//- Retrieves the array of reviews about a particular movie
//now make these functions so the get requests and whatever can be executed :)
*/

router.get("/:id", recommendMovies, sendMovie);
userData = {"accountType": "true"};

//we will find the user
router.param("id", function(req, res, next, value){
  if(req.session.loggedin){
    Movie.findById(value, function(err, result){
      if(err || !result){
        console.log(err);
        res.sendStatus(404);   //404 Not Found
        return;
      }

      Movie.findById(value).populate("director writer actor").populate({path: "reviews", populate: {path: "username",  select: 'username'}}).exec(function(err, result){
          if(err){
            console.log(err);
            res.sendStatus(500);
            //500 Internal Server Error
            //the server can't populate the data that it has already verified, making it a server error.
          }
          req.movie = result;
          //console.log(result);
          //error codes here check if empty, blah blah blah blah.
          next();
      });
    });
  }
  else{
    res.status(403);
    res.redirect("/");
  }
});

//sessions for logging in and user ID, maybe watchlist.

function recommendMovies(req, res, next){
  Movie.getSimilar(req.movie, function(err, result){
    if(err) throw err
    console.log(result)
    req.recommendedMovies = result
    console.log(req.reccomendMovies)
    next();
  })
}

function sendMovie(req, res, next){
  if(req.session.loggedin){
    //get the current logged in user, and send the watchlist
    //
    //if req.movie._id is in the user's watchlist, give boolean.
    res.format({
  		"application/json": function(){
  			res.status(200).json(req.movie);
  		},
  		"text/html": () => { res.render('./primaries/movieprofile', {movie: req.movie, recommendedMovies: req.recommendedMovies, session: req.session});}
  	});
  	next();
  }
  else{
      res.status(401).redirect("/");
      //Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
  }
}

//Export the router so it can be mounted in the main app
module.exports = router;
