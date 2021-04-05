const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let noificationSchema = Schema({

});

module.exports = mongoose.model("Notification", noificationSchema);