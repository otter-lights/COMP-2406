
function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
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
  Person.findOne({name: "Robin Williams"}).exec(function(err, result){
    if(err)throw err;
    console.log(result);
    result.frequentCollabs(function(result){
      console.log(result);
      console.log(result[4] === result[5]);
      console.log(result[0]);
      console.log(getOccurrence(result, result[0]))
    });
})
})

