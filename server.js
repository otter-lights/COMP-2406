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
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({secret: "A very huge secret goes here."}));

//sets up routers for different endpoints
let usersRouter = require("./users-router");
app.use("/users", usersRouter);
let moviesRouter = require("./movies-router");
app.use("/movies", moviesRouter);
let peopleRouter = require("./people-router");
app.use("/people", peopleRouter);
let reviewsRouter = require("./reviews-router");
app.use("/reviews", reviewsRouter);

//homepage endpoint
app.get(['/', '/homepage'], (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.status(200);
	res.render('./primaries/homepage.pug', {session:req.session});
})

//login/signin endpoint
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

//signup endpoint
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

//addmovie page endpoint, only visible for contributing users
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

//addperson page endpoint, only visible for contributing users
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


//search page endpoint
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

//connect to the mongodb database established in initialize.js
mongoose.connect('mongodb://localhost/moviedata', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//listens on port 3000
app.listen(3000);
console.log("Server listening at http://localhost:3000");
