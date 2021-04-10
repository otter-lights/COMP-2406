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
/*
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
      thisFilm = []
      thisFilm = thisFilm.concat(film.actor, film.director, film.writer)
      console.log(thisFilm)
      let dist = unique(thisFilm)
      collabs = collabs.concat(dist); 
    })
    console.log(collabs)
    personSchema.find({})
    personSchema.find({name: {$in: collabs}}).exec(function(err, result){
      console.log(result)
      callback(result)
    })
  })
}*/
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
    })
    let final = sortByFrequency(collabs)
    callback(final.slice(0,5))
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
