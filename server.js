const express = require('express');
const http = require("http");
const pug = require("pug");
let app = express();

let avengersMovieDummyData = {"id": "3", "Title":"The Avengers",
"Year":"2012", "Released":"04 May 2012", "Runtime":"143 min",
"Genre":["Action","Adventure","Sci-Fi"],"Director":["Joss Whedon"],"Writer":["Joss Whedon","Zak Penn"],
"Actors":["Robert Downey Jr.","Chris Evans","Mark Ruffalo","Chris Hemsworth"],
"Plot":"Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
"Rating": "8.4",
"Reviews": ["2", "4", "34"]};

let dummyIDTitleMovieData = {"1": {"Title": "Before We Go"}, "2": {"Title": "Knives Out"}, "3": {"Title": "The Avengers"}, "4": {"Title": "Avengers: Endgame"}, "5": {"Title": "Fantastic Four"}};
//let actorDummyData = {"Name": "Chris Evans", "Directed": ["1"], "Written": [""], "Acted":["2", "4", "3", "5"], "Collaborators": [""]};
let actorDummyData = {"Name": "Chris Evans", "Directed": ["Before We Go"], "Written": ["Defending Jacob"], "Acted":["The Avengers", "Avengers: Endgame", "Knives Out", "Fantastic Four"], "Collaborators": []};

let userData = {"username": "AngelOnFira", "password": "password", "contributing": "True",
"peopleFollowing": ["Chris Evans", "Chris Hemsworth", "Chris Pratt", "Chrissie Teigen"],
"usersFollowing": ["zaraahlie", "snapracklepop", "LegitAdi", "eriicali", "veronicaSmiles", "preethi12", "kartho"],
"watchlist": ["6", "43", "45", "654", "12", "64"],
"Reviews": ["3", "4", "9"],
"notifications": [{"name": "snapracklepop", "movieid": "43", "type": "0"},
{"name": "zaraahlie", "movieid": "23", "type": "1"},
{"name": "Zack Snyder", "movieid": "6", "type": "2"},
{"name": "Rian Johnson", "movieid": "85", "type": "3"},
{"name": "Chris Evans", "movieid": "3", "type": "4"}]};

let reviewsDummyData = {"2": {"id": "2", "username": "snapracklepop", "movieid": "3", "movieTitle": "The Avengers", "rating": "9", "summary": "Chaotic but fun", "fullreview": "Loki is super cool. The Avengers are okay. But Loki is cool. He also wears green, which is cool."},
    "4": {"id": "4", "username": "AngelOnFira", "movieid": "3", "movieTitle": "The Avengers", "rating": "7"},
    "3": {"id": "3", "username": "AngelOnFira", "movieid": "5", "movieTitle": "Fantastic Four", "rating": "4", "summary": "Not as jampacked as advertised", "fullreview": "Very slow-paced. Not entertaining. I almost thought it was going to be one of those cool superhero movies. I was wrong."},
    "9": {"id": "9", "username": "AngelOnFira", "movieid": "2", "movieTitle": "Knives Out", "rating": "10", "summary": "Chris Evans is really good in this.", "fullreview": "His character is *spoilers* one of the best villains I have seen. Master manipulator. Didn't expect him to be the bad guy."},
    "34": {"id": "34", "username": "zaraahlie", "movieid": "3", "movieTitle": "The Avengers", "rating": "10", "summary": "Will rewatch for a long time", "fullreview": "One of my favourite movies of all time. Brings together a bunch of individual movies over the years and ties them into one two hour-long movie. Excited to see the rest."}};
    //format: id# as key, review data as object value.

//all movies will have an array of review ids for the movie that we can use to get from the reviews object
//all users will have an array of review ids that they created that we can use to get from the reviews object

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
app.get('/', (req, res) => {
	res.render('./primaries/homepage.pug', {})
})

app.get('/profile', (req, res) => {
  let watchlist = [{"id": "6", "Title": "Force Awakens"}, {"id": "43", "Title": "Split"}, {"id": "45", "Title": "To All The Boys"},
  {"id": "654", "Title": "The Ugly Truth"}, {"id": "12", "Title": "V for Vendetta"}, {"id": "64", "Title": "Bleach"}];
  let recommendedMovies = ["The Phantom Menace", "Heist", "Coraline", "SuckerPunch", "Wall-E"];
	res.render('./primaries/userprofile', {user: userData, recommended: recommendedMovies, watchlist: watchlist});
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
  let reviewObjects = [];
  let watchlist = [{"id": "6", "Title": "Force Awakens"}, {"id": "43", "Title": "Split"}, {"id": "45", "Title": "To All The Boys"},
  {"id": "654", "Title": "The Ugly Truth"}, {"id": "12", "Title": "V for Vendetta"}, {"id": "64", "Title": "Bleach"}];
	if(userData.hasOwnProperty("Reviews")){
		reviewObjects = getReviewObjects(userData);
	}
	res.render('./primaries/viewingusers', {user: userData, reviews: reviewObjects, watchlist: watchlist});
})

app.get('/viewpeople', (req, res) => {
  let frequentCollaborators = ["Scarlett Johansson", "Robert Downey Jr.", "Chris Hemsworth", "Jeremy Renner", "Mark Ruffalo"];
  actorDummyData["Collaborators"] = frequentCollaborators;
	res.render('./primaries/viewingpeople', {person: actorDummyData});
})

app.get('/movieprofile', (req, res) => {
  let recommendedMovies = [{"Title": "Guardians of the Galaxy", "Plot": "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.", "Rating": "8.0", "Genres": ["Action", "Adventure", "Comedy"]},
  {"Title": "Ironman", "Plot": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.", "Rating": "7.9", "Genres": ["Action", "Adventure", "Sci-Fi"]},
  {"Title": "Sherlock Holmes", "Plot": "When the police are desperate they call upon Mr Sherlock Holmes and his unconventional methods of deduction to shed light on the matter.", "Rating": "9.1", "Genres": ["Crime", "Drama", "Mystery"]},
  {"Title": "Knives Out", "Plot": "A detective investigates the death of a patriarch of an eccentric, combative family.", "Rating": "7.9", "Genres": ["Comedy", "Crime", "Drama"]},
  {"Title": "Sucker Punch", "Plot": "A young girl institutionalized by her abusive stepfather retreats to an alternative reality as a coping strategy and envisions a plan to help her escape.", "Rating": "6.0", "Genres": ["Action", "Adventure", "Fantasy"]},];
	let reviewObjects = [];
	if(avengersMovieDummyData.hasOwnProperty("Reviews")){
		reviewObjects = getReviewObjects(avengersMovieDummyData);
	}
	res.render('./primaries/movieprofile', {movie: avengersMovieDummyData, reviews: reviewObjects, recommended: recommendedMovies});
})

app.get('/advancedsearch', (req, res) => {
	res.render('./primaries/advancedsearch', {})
})

app.get('/searchresults', (req, res) => {
	res.render('./primaries/searchresults', {})
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

//This is a shorthand way of creating/initializing the HTTP server
app.listen(3000);
console.log("Server listening at http://localhost:3000");
