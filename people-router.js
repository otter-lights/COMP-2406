const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const Movie = require("./models/MovieModel");
const User = require("./models/UserModel");
const Person = require("./models/PersonModel");
const Review = require("./models/ReviewModel");
const Notification = require("./models/NotificationModel");
const express = require('express');
let router = express.Router();

/*
router.get("/", queryparser); //or seachPeople idk whatever we wanna call the functions
router.post("/", express.json(), addPerson); //create a person and add to the database
router.get("/:id", sendUser); //sends person with ID (PUG or JSON)

*/
router.get("/:id", inList, getCollabs, sendPerson);
router.get("/", getCharacters);
router.post("/", createPerson);

//we will find the user
router.param("id", function(req, res, next, value){
  if(req.session.loggedin){
    Person.findById(value, function(err, result){
  		if(err || !result){
  			console.log(err);
  			res.sendStatus(404);
        //404 Not Found
  			return;
  		}

      Person.findById(value).populate("director writer actor followers").exec(function(err, result){
          if(err){
            throw err;
            res.sendStatus(500);
            //500 Internal Server Error
            //the server can't populate the data that it has already verified, making it a server error.
          }
          req.person = result
          //error codes here check if empty, blah blah blah blah.
          next();
      });
    });
  }
  else{
      res.status(401).render('./primaries/homepage.pug', {session:req.session});
  }
});

function getCollabs(req, res, next){
  Person.frequentCollabs(req.person, function(err, result){
    if(err) throw err
    Person.find({name: {$in: result}}).exec(function(err, result){
      req.commonCollabs = result
      next();
    })
  })
}
function inList(req, res, next){
  User.inPeopleFollowing(req.session.userID, req.person, function(err, result){
    req.inList = result
    next()
  })
}

function sendPerson(req, res, next){
  if(req.session.loggedin){
      res.format({
  		"application/json": function(){
  			res.status(200).json(req.person);
  		},
  		"text/html": () => { res.render('./primaries/viewingpeople', {session: req.session, person: req.person, inList: req.inList, commonCollabs: req.commonCollabs});}
  	});
  	next();
  }
  else{
    res.status(401).render('./primaries/homepage.pug', {session:req.session});
    //Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
  }
}
//now create the functions above! Look at the store-server if confused. Those functions above are just examples btw.

function getCharacters(req, res, next){
  if(req.query.chars){
    Person.startsWith(req.query.chars, function(err, result){
      if(err){
        console.log(err);
        res.sendStatus(404);
      }
      else{
        res.status(200).send({names: result});
      }
    });
  }
  else{
    res.sendStatus(400); //bad content
  }
}

////////////
function createPerson(req, res, next){
  if(req.session.loggedin && req.session.admin){
    console.log(req.body);
    //Create a new person document using the Mongoose model
    //Copy over the required basic person data
    let newPerson = new Person();
    newPerson._id = mongoose.Types.ObjectId();
    newPerson.name = req.body.name;
    newPerson.save(function(err, user) {
        if (err) {
          if(err.code == 11000){ //this is duplicate-key error (someone already exists with that name)
            res.send(409); //409 is the correct status code for duplicate resource or resource already exists.
            //it means conflict
          }
          else{
            console.log(err);
            res.send(400);
          }
        }
        else{
          res.status(201).send(newPerson);
        }
      });
  }
  else{
    res.sendStatus(401); //or whatever to indicate unauthorized
  }
}

//Export the router so it can be mounted in the main app
module.exports = router;
