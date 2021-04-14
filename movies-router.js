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

 //or queryparser idk whatever we wanna call the functions
router.post("/", express.json(), createMovie); //create a movie and add to the database
//also dave had express.json() as the first step for adding a new product in his store-server example so ig this parses the data.

router.get("/:id", sendMovie); //sends movie with ID (PUG or JSON)
router.get("/:id/reviews", populateReviewIds, sendReviews);
//- Supports response types application/json
//- Retrieves the array of reviews about a particular movie
//now make these functions so the get requests and whatever can be executed :)
*/
router.get("/", queryParse, loadSearch, respondSearch);
router.get("/:id", recommendMovies, inList, sendMovie);
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
    res.status(401).render('./primaries/homepage.pug', {session:req.session});
  }
});

//sessions for logging in and user ID, maybe watchlist.

//title, name, genre

function queryParse(req, res, next){
  let params = [];
  for(prop in req.query){
		  if(prop == "page"){
			   continue;
		  }
		  params.push(prop + "=" + req.query[prop]);
	 }
  
	 req.qstring = params.join("&");
  try{
    req.query.limit = req.query.limit || 10;
    req.query.limit = Number(req.query.limit);
  }
  catch{
    req.query.limit = 10;
  }
  
  try{
    req.query.page = req.query.page || 1;
    req.query.page = Number(req.query.page);
    if(req.query.page < 1){
     req.query.page = 1;
    }
  }
  catch{
    req.query.page = 1;
  }

  if(!req.query.name){
    req.query.name = "";
  }
  if(!req.query.title){
    req.query.title = "";
  }
  if(!req.query.genre){
    req.query.genre = "";
  }
  console.log(req.query)
  next();
}
function loadSearch(req, res, next){
	let startIndex = ((req.query.page-1) * req.query.limit);
	let amount = req.query.limit;
	
	Movie.find({title: new RegExp(req.query.title, 'i'), genres: new RegExp(req.query.genre, 'i')}).limit(amount).skip(startIndex).exec(function(err, results){
		if(err){
			res.status(500).send("Error Finding Movies.");
			console.log(err);
			return;
		}
		res.search = results;
		next();
		return;
	});
}

function respondSearch(req, res, next){
  res.render('./primaries/searchresults', {movies: res.search, session:req.session});
  next();
}


function recommendMovies(req, res, next){
  Movie.getSimilar(req.movie, function(err, result){
    if(err) throw err
    req.recommendedMovies = result
    next();
  })
}
function inList(req, res, next){
  User.inWatchlist(req.session.userID, req.movie, function(err, result){
    req.inList = result
    console.log(result)
    console.log(req.inList)
    next()
  })
}

function sendMovie(req, res, next){
  if(req.session.loggedin){
    //get the current logged in user, and send the watchlist
    //if req.movie._id is in the user's watchlist, give boolean.
    res.format({
  		"application/json": function(){
  			res.status(200).json(req.movie);
  		},
  		"text/html": () => { res.render('./primaries/movieprofile', {movie: req.movie, recommendedMovies: req.recommendedMovies, session: req.session, inList: req.inList});}
  	});
  	next();
  }
  else{
      res.status(401).render('./primaries/homepage.pug', {session:req.session});
      //Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
  }
}

//Export the router so it can be mounted in the main app
module.exports = router;
