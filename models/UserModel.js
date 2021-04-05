const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({

});

module.exports = mongoose.model("User", userSchema);