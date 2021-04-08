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

router.get("/:id", sendUser); //sends user with ID (PUG or JSON)
router.post("/signup", express.json(), createAccount);
router.post("/login", loginUser);
router.post("/logout", logoutUserSession);
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
//probs have to make a populate function

router.get("/:id", sendUser);

router.post("/signup", (req, res) => {
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
          res.status(200).redirect(`/users/${newUser._id}`);
        }
      });
  }
})

router.post("/login", (req, res) => {
  if(!req.body.username || !req.body.password){
    res.status(300).redirect("/login");
  }
  else{
    let username = req.body.username;
    let password = req.body.password;
    console.log(req.body);
    res.status(200).redirect("/profile");
  }
})


let watchlist = [{"id": "6", "title": "Force Awakens"}, {"id": "43", "title": "Split"}, {"id": "45", "title": "To All The Boys"},
{"id": "654", "title": "The Ugly Truth"}, {"id": "12", "title": "V for Vendetta"}, {"id": "64", "title": "Bleach"}];

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


function sendUser(req, res, next){
    res.format({
		"application/json": function(){
			res.status(200).json(req.user);
		},
		"text/html": () => { res.render('./primaries/userprofile', {user: req.user, recommendedMovies: watchlist});}
	});
	next();
}

//now create the functions above! Look at the store-server if confused. Those functions above are just examples btw.

//Export the router so it can be mounted in the main app
module.exports = router;
