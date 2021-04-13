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

personSchema.statics.startsWith = function(name, callback){
  this.find({name: new RegExp(name, 'i')}, callback).select("name").limit(10);
}

personSchema.statics.findArrayByName = function(array, callback){
  this.find({'name': {$in: array}}, callback);
}

personSchema.statics.frequentCollabs = function(person, callback){
  let films = []
  let collabs = []
  films = films.concat(person.actor);
  films = films.concat(person.director);
  films = films.concat(person.writer);
  console.log(films)

  Movie.find({_id: {$in: films}}).populate("actor director writer", "name").exec(function(err, result){
    let collabs = []
    result.forEach(film=>{
      console.log(film)
      thisFilm = []
      thisFilm = thisFilm.concat(film.actor, film.director, film.writer)
      console.log(thisFilm)
      let dist = unique(thisFilm)
      collabs = collabs.concat(dist);
      collabs.splice(collabs.indexOf(person.name), 1)
    })
    let final = sortByFrequency(collabs)
    callback(err, final.slice(0,5))
  })
}

function unique(collabs){
  let distinct = [...new Set(collabs.map(x => x.name))];
  return(distinct)
}

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
