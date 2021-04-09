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
    Movie.findById(value, function(err, result){
  		if(err){
  			console.log(err);
  			res.status(500).send("Error finding movie.");
  			return;
  		}

  		if(!result){
  			res.status(404).send("Movie ID " + value + " does not exist.");
  			return;
  		}

      Movie.findById(value).populate("director writer actor reviews").exec(function(err, result){
        /*
        result.reviews.populate("id").exec(function(err, result){
            if(err) throw err;
            req.movie = result;
            //error codes here check if empty, blah blah blah blah.
            next();
        });
        */
          if(err) throw err;
          req.movie = result;
          console.log(result);
          //error codes here check if empty, blah blah blah blah.
          next();
      });
    });
  });

//sessions for logging in and user ID, maybe watchlist.

function recommendMovies(req, res, next){
  req.recommendedMovies = [{"title": "Guardians of the Galaxy", "plot": "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.", "rating": "8.0", "genres": ["Action", "Adventure", "Comedy"]},
  {"title": "Ironman", "plot": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.", "rating": "7.9", "genres": ["Action", "Adventure", "Sci-Fi"]},
  {"title": "Sherlock Holmes", "plot": "When the police are desperate they call upon Mr Sherlock Holmes and his unconventional methods of deduction to shed light on the matter.", "rating": "9.1", "genres": ["Crime", "Drama", "Mystery"]},
  {"title": "Knives Out", "plot": "A detective investigates the death of a patriarch of an eccentric, combative family.", "rating": "7.9", "genres": ["Comedy", "Crime", "Drama"]},
  {"title": "Sucker Punch", "plot": "A young girl institutionalized by her abusive stepfather retreats to an alternative reality as a coping strategy and envisions a plan to help her escape.", "rating": "6.0", "genres": ["Action", "Adventure", "Fantasy"]}];
  next();
}

function sendMovie(req, res, next){
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

//Export the router so it can be mounted in the main app
module.exports = router;
