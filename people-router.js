const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const Movie = require("./models/MovieModel");
const User = require("./models/UserModel");
const Person = require("./models/PersonModel");
const Review = require("./models/ReviewModel");
const express = require('express');
let router = express.Router();

/*
router.get("/", queryparser); //or seachPeople idk whatever we wanna call the functions
router.post("/", express.json(), addPerson); //create a person and add to the database
router.get("/:id", sendUser); //sends person with ID (PUG or JSON)

*/
router.get("/:id", sendPerson);
userData = {"accountType": "true"};

//we will find the user
router.param("id", function(req, res, next, value){
    Person.findById(value, function(err, result){
  		if(err){
  			console.log(err);
  			res.status(500).send("Error finding user.");
  			return;
  		}

  		if(!result){
  			res.status(404).send("Person ID " + value + " does not exist.");
  			return;
  		}

      Person.findById(value).populate("director writer actor followers commonCollabs").exec(function(err, result){
          if(err) throw err;
          req.person = result;
          console.log(result);
          //error codes here check if empty, blah blah blah blah.
          next();
      });
    });
});


function sendPerson(req, res, next){
    res.format({
		"application/json": function(){
			res.status(200).json(req.person);
		},
		"text/html": () => { res.render('./primaries/viewingpeople', {user: userData, person: req.person});}
	});
	next();
}

//now create the functions above! Look at the store-server if confused. Those functions above are just examples btw.

//Export the router so it can be mounted in the main app
module.exports = router;
