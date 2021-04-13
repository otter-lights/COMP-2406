const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let noificationSchema = Schema({
  user: {
    type: Schema.Types.ObjectId, ref: 'User',
  },
  person: {
    type: Schema.Types.ObjectId, ref: 'Person',
  },
  movieId: {
    type: Schema.Types.ObjectId, ref: 'Movie',
    required: true
  },
  nType: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Notification", noificationSchema);
