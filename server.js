const express = require('express');
const http = require("http");
const pug = require("pug");
let app = express();

let avengersMovieData = {"Title":"The Avengers","Year":"2012","Rated":"PG-13","Released":"04 May 2012","Runtime":"143 min","Genre":["Action","Adventure","Sci-Fi"],"Director":["Joss Whedon"],"Writer":["Joss Whedon","Zak Penn"],"Actors":["Robert Downey Jr.","Chris Evans","Mark Ruffalo","Chris Hemsworth"],"Plot":"Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.","Awards":"Nominated for 1 Oscar. Another 38 wins & 79 nominations.","Poster":"https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg"};

app.set("view engine", "pug");
app.set("views", "./views");

//Serve static resources from public, if they exist
app.use(express.static("static_pgs"));

//app.use = for ANY request
//We will see ways to specify route-specific handlers soon
app.use(function(req,res,next){
	console.log(req.method);
	console.log(req.url);
	console.log(req.path);
	next();
});

//If the resource wasn't in other, continue the chain
app.get(['/', '/profile'], (req, res) => {
	res.render('./primaries/userprofile', {})
})

app.get('/addmovie', (req, res) => {
	res.render('./primaries/addamovie', {})
})

app.get('/addperson', (req, res) => {
	res.render('./primaries/addaperson', {})
})

app.get('/logout', (req, res) => {
	res.redirect('signin.html');
})

app.get('/signin', (req, res) => {
	res.redirect('signin.html');
})

app.get('/signup', (req, res) => {
	res.redirect('signup.html');
})

app.get('/viewuser', (req, res) => {
	res.render('./primaries/viewingusers', {})
})

app.get('/viewpeople', (req, res) => {
	res.render('./primaries/viewingpeople', {})
})

app.get('/movieprofile', (req, res) => {
	res.render('./primaries/movieprofile', {movie: avengersMovieData})
})

app.get('/advancedsearch', (req, res) => {
	res.render('./primaries/advancedsearch', {})
})

app.get('/searchresults', (req, res) => {
	res.render('./primaries/searchresults', {})
})

//This is a shorthand way of creating/initializing the HTTP server
app.listen(3000);
console.log("Server listening at http://localhost:3000");
