const express = require('express');
const http = require("http");
const pug = require("pug");
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

var path = require('path');
let app = express();
app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));
let searchResults = require("./movie-data-10.json");

let usersRouter = require("./user-router");
app.use("/users", usersRouter);
let moviesRouter = require("./movies-router");
app.use("/movies", moviesRouter);
let peopleRouter = require("./people-router");
app.use("/people", peopleRouter);
let reviewsRouter = require("./reviews-router");
app.use("/reviews", reviewsRouter);

app.get(['/', '/logout'], (req, res) => {
	res.setHeader('content-type', 'text/html');
	res.status(200);
	res.render('./primaries/homepage.pug', {});
})

app.get('/signin', (req, res) => {
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
	res.render('./primaries/addamovie', {});
})

app.get('/addperson', (req, res) => {
	res.setHeader('content-type', 'text/html');
	res.status(200);
	res.render('./primaries/addaperson', {});
})

app.get('/advancedsearch', (req, res) => {
	res.setHeader('content-type', 'text/html');
	res.status(200);
	res.render('./primaries/advancedsearch', {});
})

app.get('/searchresults', (req, res) => {
	res.setHeader('content-type', 'text/html');
	res.status(200);
	res.render('./primaries/searchresults', {movies: searchResults})
})

app.get('/profile', (req, res) => {
	let watchlist = [{"id": "6", "Title": "Force Awakens"}, 
					 {"id": "43", "Title": "Split"}, 
					 {"id": "45", "Title": "To All The Boys"},
					 {"id": "654", "Title": "The Ugly Truth"}, 
					 {"id": "12", "Title": "V for Vendetta"}, 
					 {"id": "64", "Title": "Bleach"}];
	let recommendedMovies = ["The Phantom Menace", "Heist", "Coraline", "SuckerPunch", "Wall-E"];
	res.setHeader('content-type', 'text/html');
	res.status(200);
	res.render('./primaries/userprofile', {user: userData, recommended: recommendedMovies, watchlist: watchlist});
})

app.get('/viewuser', (req, res) => {
	let reviewObjects = [];
	let watchlist = [{"id": "6", "Title": "Force Awakens"}, 
				     {"id": "43", "Title": "Split"}, 
				     {"id": "45", "Title": "To All The Boys"},
				     {"id": "654", "Title": "The Ugly Truth"}, 
				     {"id": "12", "Title": "V for Vendetta"}, 
				     {"id": "64", "Title": "Bleach"}];
	if(userData.hasOwnProperty("Reviews")){
		reviewObjects = getReviewObjects(userData);
	}
	res.setHeader('content-type', 'text/html');
	res.status(200);
	res.render('./primaries/viewingusers', {user: userData, reviews: reviewObjects, watchlist: watchlist});
})

app.get('/viewpeople', (req, res) => {
	let frequentCollaborators = ["Scarlett Johansson", "Robert Downey Jr.", "Chris Hemsworth", "Jeremy Renner", "Mark Ruffalo"];
	actorDummyData["Collaborators"] = frequentCollaborators;
	res.setHeader('content-type', 'text/html');
	res.status(200);
	res.render('./primaries/viewingpeople', {person: actorDummyData});
})

app.get('/movieprofile', (req, res) => {
	let recommendedMovies = [
	  						{"Title": "Guardians of the Galaxy", "Plot": "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.", "Rating": "8.0", "Genres": ["Action", "Adventure", "Comedy"]},
  							{"Title": "Ironman", "Plot": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.", "Rating": "7.9", "Genres": ["Action", "Adventure", "Sci-Fi"]},
  							{"Title": "Sherlock Holmes", "Plot": "When the police are desperate they call upon Mr Sherlock Holmes and his unconventional methods of deduction to shed light on the matter.", "Rating": "9.1", "Genres": ["Crime", "Drama", "Mystery"]},
  							{"Title": "Knives Out", "Plot": "A detective investigates the death of a patriarch of an eccentric, combative family.", "Rating": "7.9", "Genres": ["Comedy", "Crime", "Drama"]},
  							{"Title": "Sucker Punch", "Plot": "A young girl institutionalized by her abusive stepfather retreats to an alternative reality as a coping strategy and envisions a plan to help her escape.", "Rating": "6.0", "Genres": ["Action", "Adventure", "Fantasy"]},];
	let reviewObjects = [];
	if(avengersMovieDummyData.hasOwnProperty("Reviews")){
		reviewObjects = getReviewObjects(avengersMovieDummyData);
	}
	res.setHeader('content-type', 'text/html');
	res.status(200);
	res.render('./primaries/movieprofile', {movie: avengersMovieDummyData, reviews: reviewObjects, recommended: recommendedMovies});
})

function getReviewObjects(data){
	let reviewObjects = [];
	data["Reviews"].forEach(id =>{
		if(reviewsDummyData.hasOwnProperty(id)){
			reviewObjects.push(reviewsDummyData[id]);
		}
	});
	return reviewObjects;
}

app.listen(3000);
console.log("Server listening at http://localhost:3000");
