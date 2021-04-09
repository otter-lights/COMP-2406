const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let personSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  followers: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },
  director: {
    type: [Schema.Types.ObjectId],
    ref: 'Movie',
  },
  writer: {
    type: [Schema.Types.ObjectId],
    ref: 'Movie',
  },
  actor: {
    type: [Schema.Types.ObjectId],
    ref: 'Movie',
  },
  commonCollabs: {
    type: [Schema.Types.ObjectId],
    ref: 'Person',
  }
});

personSchema.statics.startsWith = function(username, callback){
  this.find({username: new RegExp(username, 'i')}, callback);
}

personSchema.statics.findByName = function(name, callback){
  this.findOne({username: new RegExp(username, 'i')}, callback);
}

module.exports = mongoose.model("Person", personSchema);
