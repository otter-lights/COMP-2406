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
const Notifcation = require("./models/NotificationModel");
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

mongoose.connect('mongodb://localhost/moviedata', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(3000);
console.log("Server listening at http://localhost:3000");
