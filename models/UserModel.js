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

userSchema.statics.findByUsername = function(username, callback){
  this.findOne({username: new RegExp(username, 'i')}, callback);
}
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
    Movie.find().sort('-rating -year').limit(5).exec(callback)
  }
}

userSchema.statics.inWatchlist = function(userID, movie, callback){
  this.findById(userID).exec(function(err, result){
    if(err) throw err
    callback(err, result.watchlist.includes(movie._id))
  })
}

userSchema.statics.inPeopleFollowing = function(userID, person, callback){
  this.findById(userID).exec(function(err, result){
    if(err) throw err
    callback(err, result.peopleFollowing.includes(person._id))
  })
}
userSchema.statics.inUserFollowing = function(userID, user, callback){
  this.findById(userID).exec(function(err, result){
    if(err) throw err
    callback(err, result.usersFollowing.includes(user._id))
  })
}

module.exports = mongoose.model("User", userSchema);
