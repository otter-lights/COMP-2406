const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const Movie = require("./models/MovieModel");
const User = require("./models/UserModel");
const Person = require("./models/PersonModel");
const Review = require("./models/ReviewModel");
const Notification = require("./models/NotificationModel");
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
router.post("/", getIDs, createMovie, addMovieToPeople, createNotifications, pushNotificationsToFollowers);

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
  let q = ""
  for(prop in req.query){
		  if(prop == "page"){
			   continue;
		  }
		  params.push(prop + "=" + req.query[prop]);
	 }

	 req.qstring = params.join("&");

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
  else{
    q = q + "&name=" + req.query.name
  }
  
  if(!req.query.title){
    req.query.title = "";
  }
  else{
    q = q + "&title=" + req.query.title
  }
  
  if(!req.query.genre){
    req.query.genre = "";
  }
  else{
    q = q + "&genre=" + req.query.genre
  }
  console.log(q)
  req.test = q

  if(!req.query.person){
    console.log("test")
    req.query.person = ""
    console.log(req.query)
    next();
    return
  }
  if(req.query.person){
    Person.find({name: new RegExp(req.query.person, 'i')}).select("_id").exec(function(err, result){
      console.log("test2")
      console.log(result)
      req.query.pID = result
      console.log(req.query)
      next();
    })
  }
}
function loadSearch(req, res, next){
  let startIndex = ((req.query.page-1) * 10);
  if(req.query.person === ""){
    Movie.find({title: new RegExp(req.query.title, 'i'), genres: new RegExp(req.query.genre, 'i')}).limit(10).skip(startIndex).populate("actor director writer").exec(function(err, results){
      if(err){
        res.status(500).send("Error Finding Movies.");
        console.log(err);
        return;
      }
      res.search = results;
      next();
      return;
    })
  }
  else{
    Movie.find({title: new RegExp(req.query.title, 'i'), genres: new RegExp(req.query.genre, 'i'), $or: [{actor: {$in: req.query.pID}}, {director: {$in: req.query.pID}}, {writer: {$in: req.query.pID}}]}).limit(10).skip(startIndex).populate("actor director writer").exec(function(err, results){
      if(err){
        res.status(500).send("Error Finding Movies.");
        console.log(err);
        return;
      }
      //console.log(results)
      res.search = results;
      next();
      return;
    })
  }
}

function respondSearch(req, res, next){
  res.render('./primaries/searchresults', {movies: res.search, session:req.session, current: req.query.page, query: req.test});
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


/////////////////

function getIDs(req, res, next){
  if(req.session.loggedin && req.session.admin){
    Person.findArrayByName(req.body.director, function(err, result){
      if(err){
        console.log(err);
      }
      else{
        req.directors = result;
        Person.findArrayByName(req.body.actor, function(err, result){
          if(err){
            console.log(err);
          }
          else{
            req.actors = result;
            Person.findArrayByName(req.body.writer, function(err, result){
              if(err){
                console.log(err);
              }
              else{
                req.writers = result;
                next();
              }
            });
          }
        });
      }
    });
  }
  else{
    res.sendStatus(401); //or whatever to indicate unauthorized
  }
}

function createMovie(req, res, next){
    let newMovie = new Movie();
    newMovie._id = mongoose.Types.ObjectId();
    newMovie.title = req.body.title;
    newMovie.year = req.body.year;
    newMovie.plot = req.body.plot;
    newMovie.runtime = req.body.runtime;
    newMovie.writer = req.writers;
    newMovie.actor = req.actors;
    newMovie.director = req.directors;
    newMovie.genres = req.body.genres;
    console.log(newMovie);
    newMovie.save(function(err, movie) {
        if (err) {
          if(err.code == 11000){ //this is duplicate-key error (someone already exists with that name)
            res.send(409); //409 is the correct status code for duplicate resource or resource already exists.
            //it means conflict
          }
          else{
            console.log(err);
            res.send(400); //something else is wrong with the data
          }
        }
        else{
          res.movie = movie;
          next();
        }
    });
}


function addMovieToPeople(req, res, next){
  Person.updateMany({'_id': {$in: res.movie.director}}, { $push: { "director": res.movie._id }}, function(err, results){
    if(err){
      console.log(err);
      res.status(500).send(res.movie);
      //these ids should've already been verified by the server, so if they can't be added then the server has a problem.
    }
    else{
      Person.updateMany({'_id': {$in: res.movie.actor}}, { $push: { "actor": res.movie._id }}, function(err, results){
        if(err){
          console.log(err);
          res.status(500).send(res.movie);
          //these ids should've already been verified by the server, so if they can't be added then the server has a problem.
        }
        else{
          Person.updateMany({'_id': {$in: res.movie.writer}}, { $push: { "writer": res.movie._id }}, function(err, results){
            if(err){
              console.log(err);
              res.status(500).send(res.movie);
              //these ids should've already been verified by the server, so if they can't be added then the server has a problem.
            }
            else{
              next();            }
          });
        }
      });
    }
  });
}

function createNotifications(req, res, next){
  let notifications = [];
  res.movie.writer.forEach(writer=>{
    let newNotification = new Notification();
    newNotification._id = mongoose.Types.ObjectId();
    newNotification.person = writer;
    newNotification.movieId = res.movie._id;
    newNotification.nType = 4;
    notifications.push(newNotification);
  });
  res.movie.actor.forEach(actor=>{
    let newNotification = new Notification();
    newNotification._id = mongoose.Types.ObjectId();
    newNotification.person = actor;
    newNotification.movieId = res.movie._id;
    newNotification.nType = 3;
    notifications.push(newNotification);
  });
  res.movie.director.forEach(director=>{
    let newNotification = new Notification();
    newNotification._id = mongoose.Types.ObjectId();
    newNotification.person = director;
    newNotification.movieId = res.movie._id;
    newNotification.nType = 2;
    notifications.push(newNotification);
  });
  req.notifications = notifications;
  Notification.insertMany(notifications, function(err, result){
    if(err){
      console.log(err);
      res.status(500).send(res.movie);
    }
    else{
      next();
    }
  });

}

async function pushNotificationsToFollowers(req, res, next){
  await req.notifications.forEach(async (notification) => {
    const results = await Person.findById(notification.person);
    try{
      await User.updateMany({'_id': results.followers}, { $push: { "notifications": notification._id }});
    }
    catch(err){
      res.status(500).send(res.movie);
    }
  });
  res.status(201).send(res.movie);
}

//Export the router so it can be mounted in the main app
module.exports = router;
