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
    type: Number
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

movieSchema.statics.getSimilar = function(movie, callback){
	this.model("Movie").find({genres: {$in: movie.genres}}).select("title year genres").sort('-rating -year').limit(10).exec(callback)
}

module.exports = mongoose.model("Movie", movieSchema);
