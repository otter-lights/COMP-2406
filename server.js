const express = require('express');
const http = require("http");
const pug = require("pug");
let app = express();

let avengersMovieDummyData = {"Title":"The Avengers",
"Year":"2012", "Released":"04 May 2012", "Runtime":"143 min",
"Genre":["Action","Adventure","Sci-Fi"],"Director":["Joss Whedon"],"Writer":["Joss Whedon","Zak Penn"],
"Actors":["Robert Downey Jr.","Chris Evans","Mark Ruffalo","Chris Hemsworth"],
"Plot":"Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
"Rating": "8.4",
"Reviews": ["2", "4", "34"]};

let dummyIDTitleMovieData = {"1": {"Title": "Before We Go"}, "2": {"Title": "Knives Out"}, "3": {"Title": "The Avengers"}, "4": {"Title": "Avengers: Endgame"}, "5": {"Title": "Fantastic Four"}};

let actorDummyData = {"Name": "Chris Evans", "Directed": ["1"], "Written": [""], "Acted":["2", "4", "3", "5"], "Collaborators": [""]};
//
let userData = {"Username": "AngelOnFira", "Password": "password", "Contributing": "True",
"peopleFollowing": ["Chris Evans", "Chris Hemsworth", "Chris Pratt", "Chrissie Teigen"],
"usersFollowing": ["zaraahlie", "snapracklepop", "LegitAdi", "eriicali", "veronicaSmiles", "preethi12", "kartho"],
"watchlist:" ["2", "3"],
"reviews": ["3", "4", "9"],
"notifications": ["{}", "{}", "{}"]}; //Recommendations are algorithmically generated

let reviewsDummyData = {"2": "{}", "4": "{}", "6": "{}", "34": "{}""};  //format: id# as key, review data as object value.-

//all movies will have an array of review ids that we can use to get from this reviews object
//all users will have an array of review ids that we can use to get from this reviews object

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
	let reviewObjects = [];
	if(avengersMovieDummyData.hasOwnProperty("reviews")){
		reviewObjects = getReviewObjects(avengersMovieDummyData);
	}
	res.render('./primaries/movieprofile', {movie: avengersMovieDummyData, reviews: reviewObjects});
})

app.get('/advancedsearch', (req, res) => {
	res.render('./primaries/advancedsearch', {})
})

app.get('/searchresults', (req, res) => {
	res.render('./primaries/searchresults', {})
})

function getReviewObjects(movie){
	let reviewObjects = [];
	movie["reviews"].forEach(id =>{
		if(reviewsDummyData.hasOwnProperty(id)){
			reviews.push(reviewsDummyData[id]);
		}
	});
	return reviewObjects;
}

//This is a shorthand way of creating/initializing the HTTP server
app.listen(3000);
console.log("Server listening at http://localhost:3000");
