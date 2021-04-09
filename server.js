const express = require('express');
const session = require('express-session');
const http = require("http");
const pug = require("pug");
let mongo = require('mongodb');
const mongoose = require('mongoose');
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

let avengersMovieDummyData = {"id": "3", "title":"The Avengers",
"year":"2012", "runtime":"143 min",
"genres":["Action","Adventure","Sci-Fi"],"director":["Joss Whedon"],"writer":["Joss Whedon","Zak Penn"],
"actor":["Robert Downey Jr.","Chris Evans","Mark Ruffalo","Chris Hemsworth"],
"plot":"Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
"rating": "8.4",
"reviews": ["2", "4", "34"]};
let actorDummyData = {"name": "Chris Evans", "director": ["Before We Go"], "writer": ["Defending Jacob"], "actor":["The Avengers", "Avengers: Endgame", "Knives Out", "Fantastic Four"], "commonCollabs": []};
let userData = {"username": "AngelOnFira", "password": "password", "accountType": "true",
"peopleFollowing": ["Chris Evans", "Chris Hemsworth", "Chris Pratt", "Chrissie Teigen"],
"usersFollowing": ["zaraahlie", "snapracklepop", "LegitAdi", "eriicali", "veronicaSmiles", "preethi12", "kartho"],
"watchlist": ["6", "43", "45", "654", "12", "64"],
"reviews": ["3", "4", "9"]};
let watchlist = [{"id": "6", "title": "Force Awakens"}, {"id": "43", "title": "Split"}, {"id": "45", "title": "To All The Boys"},
{"id": "654", "title": "The Ugly Truth"}, {"id": "12", "title": "V for Vendetta"}, {"id": "64", "title": "Bleach"}];
let users = [userData, userData, userData, userData, userData];
let people = [actorDummyData, actorDummyData, actorDummyData, actorDummyData];
let notificationsArray = [{"name": "snapracklepop", "movieid": "43", "nType": "0"},
{"name": "zaraahlie", "movieId": avengersMovieDummyData, "nType": "1"},
{"name": "Zack Snyder", "movieId": avengersMovieDummyData, "nType": "2"},
{"name": "Rian Johnson", "movieId": avengersMovieDummyData, "nType": "3"},
{"name": "Chris Evans", "movieId": avengersMovieDummyData, "nType": "4"}];
let reviewsDummyData = {"2": {"id": "2", "username": "snapracklepop", "movieId": avengersMovieDummyData, "movieTitle": "The Avengers", "rating": "9", "briefsummary": "Chaotic but fun", "review": "Loki is super cool. The Avengers are okay. But Loki is cool. He also wears green, which is cool."},
    "4": {"id": "4", "username": "AngelOnFira", "movieId": avengersMovieDummyData, "movieTitle": "The Avengers", "rating": "7"},
    "3": {"id": "3", "username": "AngelOnFira", "movieId": avengersMovieDummyData, "movieTitle": "Fantastic Four", "rating": "4", "briefsummary": "Not as jampacked as advertised", "review": "Very slow-paced. Not entertaining. I almost thought it was going to be one of those cool superhero movies. I was wrong."},
    "9": {"id": "9", "username": "AngelOnFira", "movieId": avengersMovieDummyData, "movieTitle": "Knives Out", "rating": "10", "briefsummary": "Chris Evans is really good in this.", "review": "His character is *spoilers* one of the best villains I have seen. Master manipulator. Didn't expect him to be the bad guy."},
    "34": {"id": "34", "username": "zaraahlie", "movieId": avengersMovieDummyData, "movieTitle": "The Avengers", "rating": "10", "briefsummary": "Will rewatch for a long time", "review": "One of my favourite movies of all time. Brings together a bunch of individual movies over the years and ties them into one two hour-long movie. Excited to see the rest."}};
let searchResults = [{"id": "6", "title": "Force Awakens", "genres":["Action","Adventure","Sci-Fi"]}, {"id": "43", "title": "Split", "genres":["Action","Adventure","Sci-Fi"]}, {"id": "45", "title": "To All The Boys","genres":["Action","Adventure","Sci-Fi"]},
{"id": "654", "title": "The Ugly Truth", "genres":["Action","Adventure","Sci-Fi"]}, {"id": "12", "title": "V for Vendetta","genres":["Action","Adventure","Sci-Fi"]}, {"id": "64", "title": "Bleach","genres":["Action","Adventure","Sci-Fi"]}, {"id": "6", "title": "Force Awakens", "genres":["Action","Adventure","Sci-Fi"]}, {"id": "43", "title": "Split", "genres":["Action","Adventure","Sci-Fi"]}, {"id": "45", "title": "To All The Boys", "genres":["Action","Adventure","Sci-Fi"]},
{"id": "654", "title": "The Ugly Truth", "genres":["Action","Adventure","Sci-Fi"]}];

actorDummyData.commonCollabs = people;
actorDummyData.director = watchlist;
actorDummyData.actor = watchlist;
actorDummyData.writer = watchlist;
avengersMovieDummyData.director = [actorDummyData];
avengersMovieDummyData.writer = [actorDummyData,actorDummyData];
avengersMovieDummyData.actor = people;
userData.peopleFollowing = people;
userData.usersFollowing = users;
userData.watchlist = watchlist;
userData.notifications = notificationsArray;
if(avengersMovieDummyData.hasOwnProperty("reviews")){
  avengersMovieDummyData.reviews = getReviewObjects(avengersMovieDummyData);
}
if(userData.hasOwnProperty("reviews")){
  userData.reviews = getReviewObjects(userData);
}

app.get(['/', '/homepage'], (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.status(200);
	res.render('./primaries/homepage.pug', {session:req.session});
})

app.get('/login', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.status(200);
  res.sendFile(path.join(__dirname + '/views/primaries/signin.html'));
})

app.get('/signup', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.status(200);
  res.sendFile(path.join(__dirname + '/views/primaries/signup.html'));
})

app.get('/addmovie', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.status(200);
	res.render('./primaries/addamovie', {session:req.session});
})

app.get('/addperson', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.status(200);
	res.render('./primaries/addaperson', {session:req.session});
})

app.get('/advancedsearch', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.status(200);
	res.render('./primaries/advancedsearch', {session:req.session});
})

app.get('/searchresults', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.status(200);
	res.render('./primaries/searchresults', {movies: searchResults, session:req.session});
})

app.get('/profile', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.status(200);
	res.render('./primaries/userprofile', {user: userData, recommendedMovies: watchlist, session:req.session});
})

app.get('/viewuser', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.status(200);

	res.render('./primaries/viewingusers', {user: userData, session:req.session});
})

app.get('/viewpeople', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.status(200);
	res.render('./primaries/viewingpeople', {person: actorDummyData,  session:req.session});
})
app.get('/movieprofile', (req, res) => {
  let recommendedMovies = [{"title": "Guardians of the Galaxy", "plot": "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.", "rating": "8.0", "genres": ["Action", "Adventure", "Comedy"]},
  {"title": "Ironman", "plot": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.", "rating": "7.9", "genres": ["Action", "Adventure", "Sci-Fi"]},
  {"title": "Sherlock Holmes", "plot": "When the police are desperate they call upon Mr Sherlock Holmes and his unconventional methods of deduction to shed light on the matter.", "rating": "9.1", "genres": ["Crime", "Drama", "Mystery"]},
  {"title": "Knives Out", "plot": "A detective investigates the death of a patriarch of an eccentric, combative family.", "rating": "7.9", "genres": ["Comedy", "Crime", "Drama"]},
  {"title": "Sucker Punch", "plot": "A young girl institutionalized by her abusive stepfather retreats to an alternative reality as a coping strategy and envisions a plan to help her escape.", "rating": "6.0", "genres": ["Action", "Adventure", "Fantasy"]}];
  res.setHeader('content-type', 'text/html');
  res.status(200);
	res.render('./primaries/movieprofile', {movie: avengersMovieDummyData, recommendedMovies: recommendedMovies, session:req.session});
})

function getReviewObjects(data){
	let reviewObjects = [];
	data["reviews"].forEach(id =>{
		if(reviewsDummyData.hasOwnProperty(id)){
			reviewObjects.push(reviewsDummyData[id]);
		}
	});
	return reviewObjects;
}

mongoose.connect('mongodb://localhost/moviedata', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(3000);
console.log("Server listening at http://localhost:3000");
