const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let movieSchema = Schema({
  //movieID from the Data Model will be the associated MongoDB id
  title: {
    type: String, 
    required: true
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

module.exports = mongoose.model("Movie", movieSchema);