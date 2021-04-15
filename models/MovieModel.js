const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let movieSchema = Schema({
  //movieID from the Data Model will be the associated MongoDB id
  title: {
    type: String,
    required: true,
    unique: true
  },
  plot: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  runtime: {
    type: String,
    required: true
  },
  rating: {
    type: String
  },
  genres: {
    type: [String],
    required: true
  },
  director: {
    type: [Schema.Types.ObjectId],
    ref: 'Person',
    required: true
  },
  actor: {
    type: [Schema.Types.ObjectId],
    ref: 'Person',
    required: true
  },
  writer: {
    type: [Schema.Types.ObjectId],
    ref: 'Person',
    required: true
  },
  reviews: {
    type: [Schema.Types.ObjectId],
    ref: 'Review',
  }
});


movieSchema.statics.getTitle = function(title, callback){
  this.find({title: title}).exec(callback);
}

movieSchema.statics.getSimilar = function(movie, callback){
	this.find({genres: {$in: movie.genres}, _id: {$ne: movie._id}}).select("title year genres plot rating").sort('-rating -year').limit(5).exec(callback)
}

movieSchema.methods.calcAvRating = function(newRating){
  if(this.reviews.length === 0){
    return newRating
  }
  else{
    return(((parseFloat(this.rating) * (this.reviews.length-1)) + parseFloat(newRating))/this.reviews.length)
  }
}

movieSchema.methods.getPeople = function(){
  let people = [];
  people = people.concat(this.actor);
  people = people.concat(this.director);
  people = people.concat(this.writer);
  console.log(people)
  return(people)
}

module.exports = mongoose.model("Movie", movieSchema);
