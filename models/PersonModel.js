const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let personSchema = Schema({
  name: {
    type: String,
    required: true
  },
  followers: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },
  director: {
    type: [Schema.Types.ObjectId],
    ref: 'Person',
  },
  writer: {
    type: [Schema.Types.ObjectId],
    ref: 'Person',
  },
  actor: {
    type: [Schema.Types.ObjectId],
    ref: 'Person',
  },
  commonCollabs: {
    type: [Schema.Types.ObjectId],
    ref: 'Person',
  }
});

module.exports = mongoose.model("Person", personSchema);