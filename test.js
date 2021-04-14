
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
const Notification = require("./models/NotificationModel");

mongoose.connect('mongodb://localhost/moviedata', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  Movie.find({title: new RegExp("", 'i'), genres: new RegExp("Romance", 'i'), $or: [{actor: {$in: "607706cbb04349aee8d6a7ac"}}, {director: {$in: "607706cbb04349aee8d6a7ac"}}, {writer: {$in: "607706cbb04349aee8d6a7ac"}}]}).limit(5).populate("actor director writer").exec(function(err, results){
    if(err) throw err
    console.log(results)
  })
})