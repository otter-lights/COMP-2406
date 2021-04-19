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
  }
});

//returns an array of 10 person documents that contain the 'name' passed in.
personSchema.statics.startsWith = function(name, callback){
  this.find({name: new RegExp(name, 'i')}, callback).select("name").limit(10);
}

//returns an array of person documents that match the IDs in the array passed in
personSchema.statics.findArrayByName = function(array, callback){
  this.find({'name': {$in: array}}, callback);
}

//returns the five common collaborators of the person passed in.
personSchema.statics.frequentCollabs = function(person, callback){
  let films = []
  let collabs = []
  films = films.concat(person.actor);
  films = films.concat(person.director);
  films = films.concat(person.writer);

  Movie.find({_id: {$in: films}}).populate("actor director writer", "name").exec(function(err, result){
    let collabs = []
    result.forEach(film=>{
      thisFilm = []
      thisFilm = thisFilm.concat(film.actor, film.director, film.writer)
      let dist = unique(thisFilm)
      collabs = collabs.concat(dist);
      collabs.splice(collabs.indexOf(person.name), 1)
    })
    let final = sortByFrequency(collabs)
    callback(err, final.slice(0,5))
  })
}

//makes sure there is uniqueness
function unique(collabs){
  let distinct = [...new Set(collabs.map(x => x.name))];
  return(distinct)
}

//sorts results by frequency to display the most common collaborators
function sortByFrequency(array) {
    var frequency = {};

    array.forEach(function(value) { frequency[value] = 0; });

    var uniques = array.filter(function(value) {
        return ++frequency[value] == 1;
    });

    return uniques.sort(function(a, b) {
        return frequency[b] - frequency[a];
    });
}

module.exports = mongoose.model("Person", personSchema);
