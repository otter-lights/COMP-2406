const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const Movie = require("./models/MovieModel");
const User = require("./models/UserModel");
const Person = require("./models/PersonModel");
const Review = require("./models/ReviewModel");
const Notification = require("./models/NotificationModel");
const express = require('express');
let router = express.Router();

router.get("/", queryParse, loadSearch, respondSearch);
router.post("/", getIDs, createMovie, addMovieToPeople, createNotifications, pushNotificationsToFollowers);
router.get("/:id", recommendMovies, inList, sendMovie);

//////////////////////////MOVIE QUERY RESULTS////////////////////////////////////
// parses the query, including page #, title, genre, and person name
function queryParse(req, res, next){
  if(req.session.loggedin){
    let params = [];
    let q = ""
    for(prop in req.query){
  		  if(prop == "page"){
  			   continue;
  		  }
  		  params.push(prop + "=" + req.query[prop]);
  	 }

  	 req.qstring = params.join("&");
    
    //trys to set the page that was requested by the user and attempts to convert to a Number
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

    //adds to the query string if there is a query parameter for title, "" if not
    if(!req.query.title){
      req.query.title = "";
    }
    else{
      q = q + "&title=" + req.query.title
    }
    
    //same method as for title
    if(!req.query.genre){
      req.query.genre = "";
    }
    else{
      q = q + "&genre=" + req.query.genre
    }
    
    //if there is nothing in the person parameter move to the next function, if there is run a contains search on the database to find matching people, the move to the next function
    if(!req.query.person){
      req.query.person = ""
      res.q = q
      next();
      return
    }
    if(req.query.person){
      q = q + "&person=" + req.query.person
      res.q = q
      Person.find({name: new RegExp(req.query.person, 'i')}).select("_id").exec(function(err, result){
        req.query.pID = result
        next();
      })
    }
  }
  else{
    res.redirect("/"); //should be status 401, but redirects so user can log in.
  }
}

//after parsing the query, builds the search results
  function loadSearch(req, res, next){
    let startIndex = ((req.query.page-1) * 10);
    if(req.query.person === ""){
      Movie.find({title: new RegExp(req.query.title, 'i'), genres: new RegExp(req.query.genre, 'i')}).limit(10).skip(startIndex).sort("title").populate("actor director writer").exec(function(err, results){
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
        let maxpages = results.length / 10;
        res.search = results;
        next();
        return;
      })
    }
}

//renders the search results page for the query requested, or sends the requested movies matching the query
function respondSearch(req, res, next){
  res.format({
  "application/json": function(){
  	res.status(200).json(req.search);
  },
	"text/html": () => {
    res.render('./primaries/searchresults', {movies: res.search, session:req.session, current: req.query.page, query: res.q});
  }
});
}

///////////////////////////////ADDS A NEW MOVIE///////////////////////////////

//takes the list of names of actors, writers and directors being added to this new movie and finds their Person objects
function getIDs(req, res, next){
  if(req.session.loggedin && req.session.admin){
    Person.findArrayByName(req.body.director, function(err, result){
      if(err){
        console.log(err);
        res.sendStatus(500);
        //these people should've been verified already because they should be names directly from the server
        //therefore it is a 500 server error.
      }
      else{
        req.directors = result;
        Person.findArrayByName(req.body.actor, function(err, result){
          if(err){
            console.log(err);
            res.sendStatus(500);
            //these people should've been verified already because they should be names directly from the server
            //therefore it is a 500 server error.
          }
          else{
            req.actors = result;
            Person.findArrayByName(req.body.writer, function(err, result){
              if(err){
                console.log(err);
                res.sendStatus(500);
                //these people should've been verified already because they should be names directly from the server
                //therefore it is a 500 server error.
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
    res.sendStatus(401);
    //Authentication is required and has failed or has not yet been provided.
  }
}

//creates the new movie object
function createMovie(req, res, next){
    Movie.getTitle(req.body.title, function(err, result){ //
      if(result.length >= 1){
        res.sendStatus(409);
        //checks if there are duplicate titles, if there are then send a 409 conflicting resource error.
      }
      else{
        //creates a new Movie document from the Movie schema.
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
        newMovie.save(function(err, movie) {
            if (err) {
              if(err.code == 11000){ //this is duplicate-key error (someone already exists with that name)
                res.sendStatus(409); //409 is the status code for duplicate resource or resource already exists.
              }
              else if(err.name === 'ValidationError'){
                res.sendStatus(400); //Bad request, the data send by the client failed to get verified and added.
              }
              else{
                console.log(err);
                res.sendStatus(500); //something is wrong with the server that is not due to the content of the new document
              }
            }
            else{
              res.movie = movie;
              next();
            }
        });
      }
    });
}


//pushes the newly made movie document ID to the actors, writers and director's respective arrays to keep the bidirectional many-many relationship.
function addMovieToPeople(req, res, next){
  Person.updateMany({'_id': {$in: res.movie.director}}, { $push: { "director": res.movie._id }}, function(err, results){
    if(err){
      console.log(err);
      res.setHeader('content-type', 'application/json');
      res.status(500).send(res.movie);
      //these ids should've already been verified by the server, so if they can't be added then the server has a problem.
    }
    else{
      Person.updateMany({'_id': {$in: res.movie.actor}}, { $push: { "actor": res.movie._id }}, function(err, results){
        if(err){
          console.log(err);
          res.setHeader('content-type', 'application/json');
          res.status(500).send(res.movie);
          //these ids should've already been verified by the server, so if they can't be added then the server has a problem.
        }
        else{
          Person.updateMany({'_id': {$in: res.movie.writer}}, { $push: { "writer": res.movie._id }}, function(err, results){
            if(err){
              console.log(err);
              res.setHeader('content-type', 'application/json');
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

//creates notifications objects for the writers, actors, and directors to send to their followers.
function createNotifications(req, res, next){
  let notifications = [];
  //create notification documents depending on if it is a writer, director, or actor and pushes them into an array
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

  //adds all the Notification documents into the server
  Notification.insertMany(notifications, function(err, result){
    if(err){
      console.log(err);
      res.setHeader('content-type', 'application/json');
      res.status(500).send(res.movie);
      //the server can't create these notifications, so it's a server error.
      //the content should already be verified at this point
    }
    else{
      next();
    }
  });
}

//pushes the notification document ID to the followers of each respective writer/director/actor
async function pushNotificationsToFollowers(req, res, next){
  //loops through the notifications created
  await req.notifications.forEach(async (notification) => {
    const results = await Person.findById(notification.person);
    try{
      //updates all of the Person objects in their followers array to include the notification ID in their notifications array
      await User.updateMany({'_id': results.followers}, { $push: { "notifications": notification._id }});
    }
    catch(err){
      res.setHeader('content-type', 'application/json');
      res.status(500).send(res.movie);
    }
  });
  res.setHeader('content-type', 'application/json');
  res.status(201).send(res.movie);
}

///////////////////////////////SENDS A MOVIE OBJECT/PAGE///////////////////////////////

//we will find the movie with this id in the parameter.
router.param("id", function(req, res, next, value){
  if(req.session.loggedin){
    Movie.findById(value, function(err, result){
      if(err || !result){
        console.log(err);
        res.sendStatus(404);
        //404 not found to indicate movie cannot be found with this ID.
        return;
      }
      //populates the movie now found
      Movie.findById(value).populate("director writer actor").populate({path: "reviews", populate: {path: "username",  select: 'username'}}).exec(function(err, result){
          if(err){
            console.log(err);
            res.sendStatus(500);
            //500 Internal Server Error
            //the server can't populate the data that it has already verified, making it a server error.
          }
          req.movie = result;
          next();
      });
    });
  }
  else{
    res.redirect("/"); //should be status 401, but redirects so user can log in.
  }
});

//gets the recommended movies for the movie being requested
function recommendMovies(req, res, next){
  if(req.session.loggedin){
    Movie.getSimilar(req.movie, function(err, result){
      if(err){
        console.log(err);
        res.sendStatus(500);
      }
      else{
        req.recommendedMovies = result
        next();
      }
    })
  }
  else{
    res.redirect("/"); //should be status 401, but redirects so user can log in.
  }
}

//checks if this movie being requested is in the logged-in user's watchlist for pug display purposes
function inList(req, res, next){
  User.inWatchlist(req.session.userID, req.movie, function(err, result){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    else{
      req.inList = result
      next()
    }
  })
}

//sends the movie object/movie page
function sendMovie(req, res, next){
  if(req.session.loggedin){
    res.format({
  		"application/json": function(){
  			res.status(200).json(req.movie);
  		},
  		"text/html": () => { res.render('./primaries/movieprofile', {movie: req.movie, recommendedMovies: req.recommendedMovies, session: req.session, inList: req.inList});}
  	});
  	next();
  }
  else{
    res.redirect("/"); //should be status 401, but redirects so user can log in.
  }
}


//Export the router so it can be mounted in the main app
module.exports = router;
