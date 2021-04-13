const express = require('express');
const session = require('express-session');
const http = require("http");
const pug = require("pug");
let mongo = require('mongodb');
const mongoose = require('mongoose');
const ObjectId= require('mongoose').Types.ObjectId
const Movie = require("./models/MovieModel");
const User = require("./models/UserModel");
const Person = require("./models/PersonModel");
const Review = require("./models/ReviewModel");
const Notification = require("./models/NotificationModel");
let MongoClient = mongo.MongoClient;


var path = require('path');
let app = express();
app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true})); //for form data. It converts the stream to strings.
//Automatically parse application/json data
app.use(express.json());
app.use(session({secret: "A very huge secret goes here."}));
//this is our session object. Can also add a maxAge if we want.

let usersRouter = require("./users-router");
app.use("/users", usersRouter);
let moviesRouter = require("./movies-router");
app.use("/movies", moviesRouter);
let peopleRouter = require("./people-router");
app.use("/people", peopleRouter);
let reviewsRouter = require("./reviews-router");
app.use("/reviews", reviewsRouter);

app.post("/addperson", createPerson);
app.post("/addmovie", getIDs, createMovie, addMovieToPeople, createNotifications);


let searchResults = [{"id": "6", "title": "Force Awakens", "genres":["Action","Adventure","Sci-Fi"]}, {"id": "43", "title": "Split", "genres":["Action","Adventure","Sci-Fi"]}, {"id": "45", "title": "To All The Boys","genres":["Action","Adventure","Sci-Fi"]},
{"id": "654", "title": "The Ugly Truth", "genres":["Action","Adventure","Sci-Fi"]}, {"id": "12", "title": "V for Vendetta","genres":["Action","Adventure","Sci-Fi"]}, {"id": "64", "title": "Bleach","genres":["Action","Adventure","Sci-Fi"]}, {"id": "6", "title": "Force Awakens", "genres":["Action","Adventure","Sci-Fi"]}, {"id": "43", "title": "Split", "genres":["Action","Adventure","Sci-Fi"]}, {"id": "45", "title": "To All The Boys", "genres":["Action","Adventure","Sci-Fi"]},
{"id": "654", "title": "The Ugly Truth", "genres":["Action","Adventure","Sci-Fi"]}];


app.get(['/', '/homepage'], (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.status(200);
	res.render('./primaries/homepage.pug', {session:req.session});
})

app.get('/login', (req, res) => {
  if(!req.session.loggedin){
    res.setHeader('content-type', 'text/html');
    res.status(200);
    res.sendFile(path.join(__dirname + '/views/primaries/signin.html'));
  }
  else{
    res.status(400).redirect(`/users/${req.session.userID}`);
  }
})

app.get('/signup', (req, res) => {
  if(!req.session.loggedin){
    res.setHeader('content-type', 'text/html');
    res.status(200);
    res.sendFile(path.join(__dirname + '/views/primaries/signup.html'));
  }
  else{
    res.status(400).redirect(`/users/${req.session.userID}`);
  }
})

app.get('/addmovie', (req, res) => {
  if(req.session.loggedin && req.session.admin){
    res.setHeader('content-type', 'text/html');
    res.status(200);
  	res.render('./primaries/addamovie', {session:req.session});
  }
  else{
    res.status(401).redirect("/");
  }
})

app.get('/addperson', (req, res) => {
  if(req.session.loggedin && req.session.admin){
    res.setHeader('content-type', 'text/html');
    res.status(200);
  	res.render('./primaries/addaperson', {session:req.session});
  }
  else{
    res.status(401).redirect("/");
  }
})

app.get('/advancedsearch', (req, res) => {
  if(req.session.loggedin){
    res.setHeader('content-type', 'text/html');
    res.status(200);
  	res.render('./primaries/advancedsearch', {session:req.session});
  }
  else{
    res.status(401).redirect("/");
  }
})

app.get('/searchresults', (req, res) => {
  if(req.session.loggedin){
    res.setHeader('content-type', 'text/html');
    res.status(200);
  	res.render('./primaries/searchresults', {movies: searchResults, session:req.session});
  }
  else{
    res.status(401).redirect("/");
  }
})

function createPerson(req, res, next){
  if(req.session.loggedin && req.session.admin){
    console.log(req.body);
    //Create a new person document using the Mongoose model
    //Copy over the required basic person data
    let newPerson = new Person();
    newPerson._id = mongoose.Types.ObjectId();
    newPerson.name = req.body.name;
    newPerson.save(function(err, user) {
        if (err) {
          if(err.code == 11000){ //this is duplicate-key error (someone already exists with that name)
            res.send(409); //409 is the correct status code for duplicate resource or resource already exists.
            //it means conflict
          }
          else{
            console.log(err);
            res.send(400);
          }
        }
        else{
          res.status(201).send(newPerson);
        }
      });
  }
  else{
    res.sendStatus(401); //or whatever to indicate unauthorized
  }
}

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
  console.log(notifications);
  /*Notification.insertMany(notifications, function(err, result){
    if(err){
      console.log(err);
      res.status(500).send(res.movie);
    }
  });*/
  res.status(201).send(res.movie);
}

function pushWriterNotifcationToFollowers(req, res, next){
  let newNotification = new Notification();
  newNotification._id = mongoose.Types.ObjectId();
  newNotification.person = req.session.userID;
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
  User.updateMany({'_id': {$in: res.user.followers}}, { $push: { "notifications": req.notification._id }}, function(err, results){
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


function pushNotificationIDtoFollowers(req, res, next){

}

mongoose.connect('mongodb://localhost/moviedata', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(3000);
console.log("Server listening at http://localhost:3000");
