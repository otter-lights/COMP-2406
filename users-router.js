const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId;
const Movie = require("./models/MovieModel");
const User = require("./models/UserModel");
const Person = require("./models/PersonModel");
const Review = require("./models/ReviewModel");
const Notifcation = require("./models/NotificationModel");
const express = require('express');
let router = express.Router();


/*
(done) router.get("/:id", sendUser); //sends user with ID (PUG or JSON)
(done) router.post("/signup", express.json(), createAccount);
(done) router.post("/login", loginUser);
(done) router.post("/logout", logoutUserSession);
router.get("/:id/accountType", validateUserSession);
router.put("/:id/accountType", validateUserSession, changeAccountType);
router.get("/:id/peoplefollowing", validateUserSession);
router.get("/:id/usersfollowing", validateUserSession);
router.get("/:id/watchlist", validateUserSession);
router.get("/:id/reviews", validateUserSession);
router.put("/:id/peoplefollowing"); //i got lazy here but you can fill in the functions as you go.
router.put("/:id/usersfollowing");
router.put("/:id/watchlist");
router.get("/:id/reviews", populateReviewIds, sendReviews);
*/

let watchlist = [{"id": "6", "title": "Force Awakens"}, {"id": "43", "title": "Split"}, {"id": "45", "title": "To All The Boys"},
{"id": "654", "title": "The Ugly Truth"}, {"id": "12", "title": "V for Vendetta"}, {"id": "64", "title": "Bleach"}];
router.post("/logout", validateUserSession, logoutUser);
router.get("/:id", validateUserSession, sendUser);
router.post("/login", notLoggedinCheck, loginUser, sendUser);
router.post("/signup", notLoggedinCheck, createUser, loginUser, sendUser)
router.post("/:id/accountType", validateUserSession, changeAccountType); //this needs to be a put
//we will find the user
router.param("id", function(req, res, next, value){
    User.findById(value, function(err, result){
  		if(err){
  			console.log(err);
  			res.status(500).send("Error finding user.");
  			return;
  		}

  		if(!result){
  			res.status(404).send("User ID " + value + " does not exist.");
  			return;
  		}

      User.findById(value).populate("usersFollowing peopleFollowing followers reviews notifications watchlist").exec(function(err, result){
          if(err) throw err;
          req.user = result;
          console.log(result);
          //error codes here check if empty, blah blah blah blah.
          next();
      });
    });
  });





//makes sure there is no logged in user before continuing, otherwise sends them their profile page so they can log out
function notLoggedinCheck(req, res, next){
  if(!req.session.loggedin){
    next();
  }
  else{
    res.status(300).redirect(`/users/${req.session.userID}`);
  }
}




//checks if a user is logged in before continuing, otherwise sends an error
function validateUserSession(req, res, next){
  if(req.session.loggedin){
    next();
  }
  else{
    res.status(404).send('Not logged in.');
  }
}




function createUser(req, res, next){
  if(!req.body.username || !req.body.password){
    res.status(300).redirect("/signup");
  }
  else{
    console.log(req.body);
    //Create a new user document using the Mongoose model
    //Copy over the required basic user data
    let newUser = new User();
    newUser._id = mongoose.Types.ObjectId();
    newUser.username = req.body.username;
    newUser.password = req.body.password;
    newUser.accountType = false; //make them basic users by default
    newUser.save(function(err, user) {
        if (err) {
            console.log(err);
            res.send(400);
        }
        else{
          console.log(newUser);
          next(); //goes to login the user with the info we just made a user in the database wiht
        }
      });
  }
}




function loginUser(req, res, next){
  if(!req.body.username || !req.body.password){
    res.status(300).redirect("/login");
  }
  else{
    User.findByUsername(req.body.username, function(err, results){
      if (err) {
          console.log(err);
          res.status(400).send('Something went wrong.');
      }
      else if(!results){
        res.status(400).send('User not found.');
      }
      else{
        console.log(results);
        if (req.body.password === results.password){
          req.user = results;
          req.session.username = results.username;
          req.session.loggedin = true;
          req.session.admin = results.accountType;
          req.session.userID = results._id;
          next();
        }
        else{
          res.status(400).send('Password incorrect.');
        }
      }
    });
  }
}




function logoutUser(req, res, next){
  req.session.destroy();
  res.status(200).redirect("/")
}




function sendUser(req, res, next){
    console.log(req.session);
    res.format({
		"application/json": function(){
			res.status(200).json(req.user);
		},
		"text/html": () => {
      if(req.session.username === req.user.username){
        res.render('./primaries/userprofile', {user: req.user, recommendedMovies: watchlist, session:req.session});
      }
      else{
        res.render('./primaries/viewingusers', {user: req.user, recommendedMovies: watchlist, session:req.session});
      }
    }
	});
	next();
}


function changeAccountType(req, res, next){
  if(req.session.username === req.user.username){
    req.user.accountType = !req.user.accountType;
    req.user.save(function(err, user) {
        if (err) {
            console.log(err);
            res.status(400).send("Something went wrong.");
        }
        else{
          console.log(req.user);
          req.session.admin = req.user.accountType;
          res.status(201).redirect(`/users/${req.session.userID}`);
        }
      });
  }
  else{
    res.status(404).send("Accessing account that is not logged in.");
  }
}
//now create the functions above! Look at the store-server if confused. Those functions above are just examples btw.

//Export the router so it can be mounted in the main app
module.exports = router;
