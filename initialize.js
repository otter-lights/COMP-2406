const mongoose = require('mongoose');

const User = require("./models/UserModel");
const Review = require("./models/ReviewModel");
const Movie = require("./models/MovieModel");
const Person = require("./models/PersonModel");
const Notification = require("./models/NotificationModel");

const fs = require("fs");
const csv = require('csv-parser')
const results = []

const fileName = "./data/movie-data-2500.json";
const userDataFile = "./data/user-data.json";

let allMovies = [];
let people = {};

let allPeople = [];
let allUsers = [];


function addPersonToMovie(personName, movie, position){
  if(!people.hasOwnProperty(personName)){
    let newPerson = new Person();

    newPerson._id = mongoose.Types.ObjectId();

    newPerson.name = personName;
    newPerson.director = [];
    newPerson.actor = [];
    newPerson.writer = [];

    allPeople.push(newPerson);

    people[newPerson.name] = newPerson;
  }

  let curPerson = people[personName];
  curPerson[position].push(movie._id);
  movie[position].push(curPerson._id);
}


let data = require(fileName);
data.forEach(movie=>{

  let newMovie = new Movie();
  newMovie._id = mongoose.Types.ObjectId();
  newMovie.title = movie.Title;
  newMovie.year = movie.Year;
  newMovie.runtime = movie.Runtime;
  newMovie.genres = movie.Genre;
  newMovie.plot = movie.Plot;


  movie.Actors.forEach(actorName => {
    addPersonToMovie(actorName, newMovie, "actor");
  })


  movie.Director.forEach(directorName => {
    addPersonToMovie(directorName, newMovie, "director");
  })

  movie.Writer.forEach(directorName => {
    addPersonToMovie(directorName, newMovie, "writer");
  })

  allMovies.push(newMovie)
})


let userData = require(userDataFile);
userData.forEach(user=>{

  let newUser = new User();
  newUser._id = mongoose.Types.ObjectId();
  newUser.username = user.username;
  newUser.password = user.password;
  newUser.accountType = user.accountType;

  allUsers.push(newUser)
})

mongoose.connect('mongodb://localhost/moviedata', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  mongoose.connection.db.dropDatabase(function(err, result){

    Movie.insertMany(allMovies, function(err, result){
  	  if(err){
  		  console.log(err);
  		  return;
  	  }

      Person.insertMany(allPeople, function(err, result){
    	  if(err){
    		  console.log(err);
    		  return;
    	  }

        User.insertMany(allUsers, function(err, result){
          if(err){
            console.log(err);
            return;
          }
          console.log("Server has been initialized. :)");
          mongoose.connection.close()
        })
      });
    });
  });
});
