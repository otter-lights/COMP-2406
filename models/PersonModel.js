const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let personSchema = Schema({
  name: {
    type: String,
    required: true
  },
  followers: {
    type: [Schema.Types.ObjectId, ref: 'User']
  },
  moviesDirected: {
    type: [Schema.Types.ObjectId, ref: 'Movie'],
  },
  moviesWritten: {
    type: [Schema.Types.ObjectId, ref: 'Movie'],
  },
  moviesActed: {
    type: [Schema.Types.ObjectId, ref: 'Movie'],
  },
  commonCollabs: {
    type: [Schema.Types.ObjectId, ref: 'Person'],
  }
});

module.exports = mongoose.model("Person", personSchema);