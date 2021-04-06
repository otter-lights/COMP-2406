const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = Schema({
  //reviewID from the Data Model will be the associated MongoDB id
  username: {
    type: Schema.Types.ObjectId, ref: 'User', 
    required: true
  },
  movieId: {
    type: Schema.Types.ObjectId, ref: 'Person', 
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  briefsummary: {
    type: String
  },
  review: {
    type: String
  }
});

module.exports = mongoose.model("Review", reviewSchema);