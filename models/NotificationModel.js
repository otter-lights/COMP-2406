const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let noificationSchema = Schema({
  name: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true
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
