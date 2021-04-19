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


//this function adds a Person to a movie
//if they don't exist, creates a new Person document
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
    //also builds up a database of People documents
  }

  let curPerson = people[personName];
  curPerson[position].push(movie._id);
  movie[position].push(curPerson._id);
}


//creates new movie documents
let data = require(fileName);
data.forEach(movie=>{

  let newMovie = new Movie();
  newMovie._id = mongoose.Types.ObjectId();
  newMovie.title = movie.Title;
  newMovie.year = movie.Year;
  newMovie.runtime = movie.Runtime;
  newMovie.genres = movie.Genre;
  newMovie.plot = movie.Plot;

  //adds all the actors to the movie
  movie.Actors.forEach(actorName => {
    addPersonToMovie(actorName, newMovie, "actor");
  })

//adds all the directors to the movie
  movie.Director.forEach(directorName => {
    addPersonToMovie(directorName, newMovie, "director");
  })
 //adds all the writers to the movie
  movie.Writer.forEach(directorName => {
    addPersonToMovie(directorName, newMovie, "writer");
  })

  allMovies.push(newMovie)
})


//goes through user dummy data and creates an array of documents of Users
let userData = require(userDataFile);
userData.forEach(user=>{

  let newUser = new User();
  newUser._id = mongoose.Types.ObjectId();
  newUser.username = user.username;
  newUser.password = user.password;
  newUser.accountType = user.accountType;

  allUsers.push(newUser)
})

//connects to Mongo and inserts all the Movie documents, Person documents, and User documents.
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
