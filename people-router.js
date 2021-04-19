const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const Movie = require("./models/MovieModel");
const User = require("./models/UserModel");
const Person = require("./models/PersonModel");
const Review = require("./models/ReviewModel");
const Notification = require("./models/NotificationModel");
const express = require('express');
let router = express.Router();

router.get("/:id", inList, getCollabs, sendPerson);
router.get("/", getCharacters);
router.post("/", createPerson);


//////////////////////////SENDS A PERSON OBJECT/PAGE////////////////////////////////////
//we will find the person with this id in the parameter.
router.param("id", function(req, res, next, value){
  if(req.session.loggedin){
    Person.findById(value, function(err, result){
  		if(err || !result){
  			console.log(err);
  			res.sendStatus(404);
        //404 not found to indicate a person cannot be found with this ID.
  			return;
  		}
      //populates the person object with this id
      Person.findById(value).populate("director writer actor followers").exec(function(err, result){
          if(err){
            console.log(err);
            res.sendStatus(500);
            //500 Internal Server Error
            //the server can't populate the Person with the ID above that it has already verified, making it a server error.
          }
          req.person = result
          next();
      });
    });
  }
  else{
      res.redirect("/"); //should be a 401 error but redirects so user can log in.
  }
});

//gets the most common collaborators of the Person requested
function getCollabs(req, res, next){
    Person.frequentCollabs(req.person, function(err, result){
      if(err){
        console.log(err);
        res.sendStatus(500);
      }
      else{
        Person.find({name: {$in: result}}).exec(function(err, result){
          if(err){
            console.log(err);
            res.sendStatus(500);
          }
          else{
            req.commonCollabs = result;
            next();
          }
        })
      }
    })
}


//checks if the Person requested is followed by the logged-in user for pug display purposes
function inList(req, res, next){
  User.inPeopleFollowing(req.session.userID, req.person, function(err, result){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    else{
      req.inList = result;
      next()
    }
  })
}

//sends the requested person object/page depending on what was requested.
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
    res.redirect("/");
    //should be a 401 but redirects so user can log in instead
  }
}

//////////////////////////DYNAMIC PERSON SEARCH////////////////////////////////////
//this function is specifically to allow users adding a movie to add people directly from the server
//the query should have a 'chars' parameter that will contain characters that will be used to find people whose names contain those characters
//sends back an array of names, limits to 10.
function getCharacters(req, res, next){
  if(req.session.loggedin && req.session.admin){
    if(req.query.chars){
      Person.startsWith(req.query.chars, function(err, result){
        if(err){
          console.log(err);
          res.sendStatus(500);
        }
        else{
          res.setHeader('content-type', 'application/json');
          res.status(200).send({names: result});
        }
      });
    }
    else{
      res.sendStatus(400);
      //the chars query parameter doesn't exist, so this is a bad content error
    }
  }
  else{
    res.sendStatus(401);
    //Authentication is required and has failed or has not yet been provided.
  }
}

//////////////////////////CREATES A NEW PERSON DOCUMENT////////////////////////////////////

//creates a new person only if that person is a contributing server
function createPerson(req, res, next){
  if(req.session.loggedin && req.session.admin){
    //Create a new person document using the Mongoose model
    //Copy over the required basic person data
    let newPerson = new Person();
    newPerson._id = mongoose.Types.ObjectId();
    newPerson.name = req.body.name;
    newPerson.save(function(err, user) {
        if (err) {
          if(err.code == 11000){ //this is duplicate-key error (someone already exists with that name)
            res.send(409); //409 is the status code for a conflict due to a duplicate resource/resource already exists.
          }
          else if(err.name === 'ValidationError'){
            res.sendStatus(400); //Bad request, the data send by the client failed to get verified and added.
          }
          else{
            console.log(err);
            res.send(500);
            ////something is wrong with the server that is not due to the content of the new document
          }
        }
        else{
          res.setHeader('content-type', 'application/json');
          res.status(201).send(newPerson);
          //sends the newly created Person document
        }
      });
  }
  else{
    res.sendStatus(401);
    //Authentication is required and has failed or has not yet been provided.
  }
}

//Export the router so it can be mounted in the main app
module.exports = router;
