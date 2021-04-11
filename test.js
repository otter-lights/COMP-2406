
function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
}

function sortByFrequency(array) {
    var frequency = {};

    array.forEach(function(value) { frequency[value] = 0; });

    var uniques = array.filter(function(value) {
        return ++frequency[value] == 1;
    });

    return uniques.sort(function(a, b) {
        return frequency[b] - frequency[a];
    });
}

const mongoose = require('mongoose');
const User = require("./models/UserModel");
const Review = require("./models/ReviewModel");
const Movie = require("./models/MovieModel");
const Person = require("./models/PersonModel");
const Notification = require("./models/NotificationModel");mongoose.connect('mongodb://localhost/moviedata', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  Movie.findById("60723e8a13a48aa8a0c191cb").populate("reviews").exec(function(err, result){
    console.log(result.calcAvRating("9"))
    
  })
  /*
  Person.findOne({name: "Robin Williams"}).exec(function(err, result){
    if(err)throw err;
    console.log(result);
    Person.frequentCollabs(result, function(result){
      console.log(result);
    });*/
})


