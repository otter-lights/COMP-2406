const mongoose = require("mongoose");
const Movie = require("./MovieModel");

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
personSchema.methods.frequentCollabs = function(callback){
  let films = []
  let collabs = []
  films = films.concat(this.actor);
  films = films.concat(this.director);
  films = films.concat(this.writer);
  //console.log(films)
  Movie.find({_id: {$in: films}}).populate("actor director writer", "name").exec(function(err, result){
    let collabs = []
    result.forEach(film=>{
      console.log(film)
      thisFilm = film.director
      thisFilm = thisFilm.concat(film.actor, film.director, film.writer)
      collabs = collabs.concat(thisFilm); 
    })
    //callback(unique(collabs))
    callback(collabs)
  })
}

function unique(collabs){
  let distinct = [...new Set(collabs.map(x => x._id))];
  return(distinct)
}


module.exports = mongoose.model("Person", personSchema);
