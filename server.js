const express = require('express');
const http = require("http");
const pug = require("pug");
let app = express();

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
	res.render('./primaries/movieprofile', {})
})

app.get('/advancedsearch', (req, res) => {
	res.render('./primaries/advancedsearch', {})
})

//This is a shorthand way of creating/initializing the HTTP server
app.listen(3000);
console.log("Server listening at http://localhost:3000");
