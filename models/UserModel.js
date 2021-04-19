const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Movie = require("./MovieModel");


let userSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accountType: {
    type: Boolean,
    required: true
  },
  peopleFollowing: {
    type: [Schema.Types.ObjectId],
    ref: 'Person'
  },
  usersFollowing: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
  },
  followers: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
  },
  watchlist:{
    type: [Schema.Types.ObjectID],
    ref: 'Movie'
  },
  reviews: {
    type: [Schema.Types.ObjectId],
    ref: 'Review'
  },
  notifications: {
    type: [Schema.Types.ObjectId],
    ref: 'Notification'
  }
});

//finds one User document that matches the username
userSchema.statics.findByUsername = function(username, callback){
  this.findOne({username: new RegExp(username, 'i')}, callback);
}

//returns recommendations for movies for the user document passed in based off of watchlist
userSchema.statics.getRecs = function(user, callback){
  if(user.watchlist.length > 0){
    let allgenres = []
    user.watchlist.forEach(film=>{
      allgenres = allgenres.concat(film.genres)
    })
    Movie.find({genres: {$in: allgenres}, _id: {$nin: user.watchlist}}).sort('-rating -year').limit(5).exec(function(err, result){
      callback(err, result)
    })
  }
  else{
    //if there is nothing in the watchlist, gives the 5 highest-rated movies.
    Movie.find().sort('-rating -year').limit(5).exec(callback)
  }
}

//checks if the movie passed in is in the user's watchlist
userSchema.statics.inWatchlist = function(userID, movie, callback){
  this.findById(userID).exec(function(err, result){
    if(err) throw err
    callback(err, result.watchlist.includes(movie._id))
  })
}

//checks if the person passed in is followed by the user passed in
userSchema.statics.inPeopleFollowing = function(userID, person, callback){
  this.findById(userID).exec(function(err, result){
    if(err) throw err
    callback(err, result.peopleFollowing.includes(person._id))
  })
}

//checks if the first user passed in is followed by the second user passed in
userSchema.statics.inUserFollowing = function(userID, user, callback){
  this.findById(userID).exec(function(err, result){
    if(err) throw err
    callback(err, result.usersFollowing.includes(user._id))
  })
}

module.exports = mongoose.model("User", userSchema);
