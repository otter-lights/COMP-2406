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
  director: {
    type: [Schema.Types.ObjectId, ref: 'Movie'],
  },
  writer: {
    type: [Schema.Types.ObjectId, ref: 'Movie'],
  },
  actor: {
    type: [Schema.Types.ObjectId, ref: 'Movie'],
  },
  commonCollabs: {
    type: [Schema.Types.ObjectId, ref: 'Person'],
  }
});

module.exports = mongoose.model("Person", personSchema);