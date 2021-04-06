const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
  username: {
    type: String, 
    required: true
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
  reviews: {
    type: [Schema.Types.ObjectId],
    ref: 'Review'
  },
  notifications: {
    type: [Schema.Types.ObjectId],
    ref: 'Notification'
  } 
});

module.exports = mongoose.model("User", userSchema);