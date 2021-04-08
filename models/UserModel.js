const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

module.exports = mongoose.model("User", userSchema);
