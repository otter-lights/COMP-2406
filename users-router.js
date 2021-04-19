const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId;
const Movie = require("./models/MovieModel");
const User = require("./models/UserModel");
const Person = require("./models/PersonModel");
const Review = require("./models/ReviewModel");
const Notifcation = require("./models/NotificationModel");
const express = require('express');
let router = express.Router();

router.post("/login", loginUser);
router.post("/signup", createUser, loginUser)
router.post("/logout", logoutUser);
router.get("/:id", inList, recMovies, sendUser);
router.put("/:id/accountType", changeAccountType);
router.get("/:id/accountType", sendAccountType);
router.get("/:id/watchlist", sendWatchlist);
router.put("/:id/watchlist", changeWatchlist);
router.get("/:id/peopleFollowing", sendPeopleFollowing);
router.put("/:id/peopleFollowing", changePeopleFollowing, changePeopleFollowers);
router.get("/:id/usersFollowing", sendUsersFollowing);
router.put("/:id/usersFollowing", changeUsersFollowing, changeUsersFollowers);


//////////////////////////SIGNING-IN/LOGGING-IN USERS////////////////////////////////////
//creates a new user using the information sent in the request
function createUser(req, res, next){
  if(!req.session.loggedin){
    if(!req.body.username || !req.body.password){
      res.sendStatus(400); //400 Bad Request due to no body
    }
    else{
      //Create a new user document using the User model schema
      let newUser = new User();
      newUser._id = mongoose.Types.ObjectId();
      newUser.username = req.body.username;
      newUser.password = req.body.password;
      newUser.accountType = false; //make them basic users by default
      newUser.save(function(err, user) {
        if (err) {
          if(err.code == 11000){ //this is duplicate-key error (someone already exists with that name)
            res.sendStatus(409); //409 is the status code for duplicate resource or to indicate the resource already exists.
          }
          else if(err.name == 'ValidationError'){
            res.sendStatus(400); //Bad request, the data send by the client failed to get verified and added.
          }
          else{
            console.log(err);
            res.sendStatus(500); //something went wrong in the server
          }
        }
        else{
          next(); //logs the user in
        }
      });
    }
  }
  else{
    res.sendStatus(403); //403 Forbidden
    //The request contained valid data and was understood by the server, but the server is refusing action.
    //the user is already logged in and attempting to create an account, causing this error.
  }
}

//logs in the user using the information sent in the request
function loginUser(req, res, next){
  if(!req.session.loggedin){
    if(!req.body.username || !req.body.password){
      res.sendStatus(400); //400 Bad Request no body
    }
    else{
      User.findByUsername(req.body.username, function(err, results){
        if (err || !results) {
            console.log(err);
            res.sendStatus(404); //404 Not Found. The user document with this username could not be found.
        }
        else{
          if (req.body.password === results.password){
            req.user = results;
            req.session.username = results.username;
            req.session.loggedin = true;
            req.session.admin = results.accountType;
            req.session.userID = results._id;
            res.status(200).send(req.user);
          }
          else{
            res.sendStatus(403);
            //403 forbidden, the server understood the request, but is refusing to fulfill it.
            //the password is incorrect, in this case, although the user object has been found.
          }
        }
      });
    }
  }
  else{
    res.sendStatus(403); //403 Forbidden
    //The request contained valid data and was understood by the server, but the server is refusing action.
    //the user is already logged in and attempting to login again, causing this error.
  }
}


//Logs out the user. Doesn't check if they're logged in, just destroys the session and redirects them.
function logoutUser(req, res, next){
  req.session.destroy();
  res.status(200).redirect("/")
}

///////////////////////////////SENDS A USER OBJECT/PAGE///////////////////////////////

//finds the user with the id in the URL
router.param("id", function(req, res, next, ID){
  if(req.session.loggedin){
    User.findById(ID, function(err, result){
  		if(err || !result){
  			console.log(err);
  			res.sendStatus(404);  //404 not found to indicate a user cannot be found with this ID.
  			return;
  		}
      //populates the user now found
      User.findById(ID).populate("usersFollowing peopleFollowing watchlist").populate({path: "reviews", populate: {path: "movieId",  select: 'title'}}).populate({path: "notifications", populate: [{path: "person",  select: 'name'},{path: "user",  select: 'username'}]}).exec(function(err, result){
          if(err){
            console.log(err);
            res.sendStatus(500);
            //500 Internal Server Error
            //the server can't populate the data that it has already verified, making it a server error.
          }
          req.user = result;
          next();
      });
    });
  }
  else{
    res.redirect("/"); //this should be a 401, but redirects so the user can login.
  }
});

//checks if the user who is being requested is in the following list of the user logged in for pug display purposes.
function inList(req, res, next){
  if(req.session.loggedin){
    User.inUserFollowing(req.session.userID, req.user, function(err, result){
      if(err){
        console.log(err);
        res.sendStatus(500);
      }
      else{
        req.inList = result
        next()
      }
    })
  }
  else{
    res.redirect("/");
    //should be a 401 but redirecting so user can log in.
  }
}

//generates recommended movies for the user
function recMovies(req, res, next){
  User.getRecs(req.user, function(err, result){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    else{
      req.reccomendedMovies = result
      next();
    }
  })
}

//sends the user object or user page depending on what is requested.
function sendUser(req, res, next){
  if(req.session.loggedin){
      res.format({
  		"application/json": function(){
  			res.status(200).json(req.user);
  		},
  		"text/html": () => {
        if(req.session.username === req.user.username){
          res.render('./primaries/userprofile', {user: req.user, recommendedMovies: req.reccomendedMovies, session:req.session});
        }
        else{
          res.render('./primaries/viewingusers', {user: req.user, session:req.session, inList: req.inList});
        }
      }
  	});
  }
  else{
    res.redirect("/");
    //should be a 401 but redirecting so user can log in.
  }
}

//////////////////////////////USER ACCOUNT TYPE////////////////////////////////////////

//sends the account type (basic/contributing) of the requested user in the url request.
function sendAccountType(req, res, next){
  if(req.session.loggedin){
    if(req.session.username === req.user.username){
      res.setHeader('content-type', 'application/json');
      res.status(200).json({"accountType": req.user.accountType});
    }
    else{
      res.sendStatus(403);
      //403 forbidden, the server understood the request, but is refusing to fulfill it.
      //the user is logged in, but they are requesting another user's data.
    }
  }
  else{
    res.sendStatus(401);
    //Authentication is required and has failed or has not yet been provided.
  }
}

//accepts the account type in req.body and changes it for the requested user in the url request.
function changeAccountType(req, res, next){
  if(req.session.loggedin){
    if(req.session.username === req.user.username){
      req.user.accountType = req.body.accountType;
      req.user.save(function(err, user) {
          if (err) {
            if(err.name === 'ValidationError'){
              res.sendStatus(400); //Bad request, the data send by the client failed to get verified and added.
            }
            else{
              res.sendStatus(500);
              //500 Internal Server Error
              //something has gone wrong with the server, and it's not validating the user to save it.
            }
          }
          else{
            req.session.admin = req.user.accountType;
            res.setHeader('content-type', 'application/json');
            res.status(200).send({"accountType": req.user.accountType});
          }
        });
    }
    else{
      res.sendStatus(403);
      //403 forbidden, the server understood the request, but is refusing to fulfill it.
      //the user is logged in, but they are requesting to change another user's data.
    }
  }
  else{
    res.sendStatus(401);
    //authentication is required and has failed or has not yet been provided.
  }
}

//////////////////////////////USER WATCHLIST////////////////////////////////////////

//sends the watchlist of the requested user in the url
function sendWatchlist(req, res, next){
  if(req.session.loggedin){
    if(req.session.username === req.user.username){
      res.setHeader('content-type', 'application/json');
      res.status(200).send({"watchlist": req.user.watchlist});
    }
    else{
      res.sendStatus(403);
      //403 forbidden, the server understood the request, but is refusing to fulfill it.
      //the user is logged in, but they are requesting another user's data.
    }
  }
  else{
    res.sendStatus(401);
    //Authentication is required and has failed or has not yet been provided.
  }
}

//changes the watchlist of the requested user in the url
function changeWatchlist(req, res, next){
    if(req.session.loggedin){
      if(req.session.username === req.user.username){
        req.user.watchlist = req.body.watchlist;
        req.user.save(function(err, user) {
            if (err) {
              console.log(err);
              if(err.name === 'ValidationError'){
                res.sendStatus(400); //Bad request, the data send by the client failed to get verified and added.
              }
              else{
                res.sendStatus(500);
                //500 Internal Server Error
                //the server has encountered a problem in saving that does not involve validation
              }
            }
            else{
              res.setHeader('content-type', 'application/json');
              res.status(200).send({"watchlist": req.user.watchlist});
            }
          });
      }
      else{
        res.sendStatus(403);
        //403 forbidden, the server understood the request, but is refusing to fulfill it.
        //the user is logged in, but they are requesting to change another user's data.
      }
    }
    else{
      res.sendStatus(401);
      //403 forbidden, the server understood the request, but is refusing to fulfill it.
    }
}

//////////////////////////////USER'S PEOPLE FOLLOWING////////////////////////////////////////

//sends the list of people being followed by the requested user in the url
function sendPeopleFollowing(req, res, next){
  if(req.session.loggedin){
    if(req.session.username === req.user.username){
      res.setHeader('content-type', 'application/json');
      res.status(200).send({"peopleFollowing": req.user.peopleFollowing});
    }
    else{
      res.sendStatus(403);
      //403 forbidden, the server understood the request, but is refusing to fulfill it.
      //the user is logged in, but they are requesting another user's data.
    }
  }
  else{
    res.sendStatus(401);
    //authentication is required and has failed or has not yet been provided.
  }
}

//changes the list of people being followed by the requested user in the url
function changePeopleFollowing(req, res, next){
  if(req.session.loggedin){
    if(req.session.username === req.user.username){
      req.user.peopleFollowing = req.body.peopleFollowing;
      req.user.save(function(err, user) {
          if (err) {
            console.log(err);
            if(err.name === 'ValidationError'){
              res.sendStatus(400); //Bad request, the data send by the client failed to get verified and added.
            }
            else{
              res.sendStatus(500);
              //500 Internal Server Error: the server has encountered a problem in saving that does not involve validation
            }
          }
          else{
            next();
          }
        });
    }
    else{
      res.sendStatus(403);
      //403 forbidden, the server understood the request, but is refusing to fulfill it.
      //the user is logged in, but they are requesting to change another user's data.
    }
  }
  else{
    res.sendStatus(401);
    //authentication is required and has failed or has not yet been provided.
  }
}

//goes to the removed/added people in the user's following list and removes/adds the logged-in user in their list of followers
//this followers list is for getting notifications out
function changePeopleFollowers(req, res, next){
  if(req.body.hasOwnProperty("removed")){ //this is a person(s) who has been removed from the following list
    Person.updateMany({'_id': {$in: req.body.removed}}, { $pull: { "followers": req.user._id }}, function(err, results){
      if(err){
        res.setHeader('content-type', 'application/json');
        res.status(500).send({"peopleFollowing": req.user.peopleFollowing});
        //these ids should've already been verified by the server, so if they can't be added then the server has a problem.
      }
      else{
        res.setHeader('content-type', 'application/json');
        res.status(200).send({"peopleFollowing": req.user.peopleFollowing});
      }
    });
  }
  else if(req.body.hasOwnProperty("addedPerson")){ //this is a person who has been added to the following list
    Person.findByIdAndUpdate(req.body.addedPerson,
    {$push: {"followers": req.user._id}},
    { "new": true, "upsert": true},
    function(err, result){
      if(err){
        console.log(err);
        res.setHeader('content-type', 'application/json');
        res.status(500).send({"peopleFollowing": req.user.peopleFollowing});
        //if we're at this point, the server has already added this new personID to the user's following, which means the
        //personID should be verified. This error must be a server error.
      }
      else{
        res.setHeader('content-type', 'application/json');
        res.status(200).send({"peopleFollowing": req.user.peopleFollowing});
        //finally sends back the new list of people being followed
      }
    });
  }
}

//////////////////////////////USER'S USERS FOLLOWING////////////////////////////////////////

//sends the list of users being followed by the requested user in the url
function sendUsersFollowing(req, res, next){
  if(req.session.loggedin){
    if(req.session.username === req.user.username){
      res.setHeader('content-type', 'application/json');
      res.status(200).send({"usersFollowing": req.user.usersFollowing});
    }
    else{
      res.sendStatus(403);
      //The server understood the request, but is refusing to fulfill it.
      //the user is logged in, but they are requesting another user's data.
    }
  }
  else{
    res.sendStatus(401);
    //Authentication is required and has failed or has not yet been provided.
  }
}

//changes the list of users being followed by the requested user in the url
function changeUsersFollowing(req, res, next){
  if(req.session.loggedin){
    if(req.session.username === req.user.username){
      req.user.usersFollowing = req.body.usersFollowing;
      req.user.save(function(err, user) {
          if (err) {
            console.log(err);
            if(err.name === 'ValidationError'){
              res.sendStatus(400); //Bad request, the data send by the client failed to get verified and added.
            }
            else{
              res.sendStatus(500);
              //500 Internal Server Error: the server has encountered a problem in saving that does not involve validation
            }
          }
          else{
            next();
          }
        });
    }
    else{
      res.sendStatus(403);
      //403 forbidden, the server understood the request, but is refusing to fulfill it.
      //the user is logged in, but they are requesting to change another user's data.
    }
  }
  else{
    res.sendStatus(401);
    //Authentication is required and has failed or has not yet been provided.
  }
}

//goes to the removed/added people in the user's following list and removes/adds the logged-in user in their list of followers
//this followers list is for getting notifications out
function changeUsersFollowers(req, res, next){
  if(req.body.hasOwnProperty("removed")){
    User.updateMany({'_id': {$in: req.body.removed}}, { $pull: { "followers": req.user._id }}, function(err, results){
      if(err){
        console.log(err);
        res.setHeader('content-type', 'application/json');
        res.status(500).send({"usersFollowing": req.user.usersFollowing});
        //these ids should've already been verified by the server, so if they can't be added then the server has a problem.
      }
      else{
        res.setHeader('content-type', 'application/json');
        res.status(200).send({"usersFollowing": req.user.usersFollowing});
      }
    });
  }
  else if(req.body.hasOwnProperty("addedUser")){
    User.findByIdAndUpdate(req.body.addedUser,
    {$push: {"followers": req.user._id}},
    { "new": true, "upsert": true},
    function(err, result){
      if(err){
        console.log(err);
        res.setHeader('content-type', 'application/json');
        res.status(500).send({"usersFollowing": req.user.usersFollowing});
        //if we're at this point, the server has already added this new userID to the user's following, which means the
        //userID should be verified. This error must be a server error.
      }
      else{
        res.setHeader('content-type', 'application/json');
        res.status(200).send({"usersFollowing": req.user.usersFollowing});
        //finally sends back the new list of users being followed
      }
    });
  }
}
///////////////////////////////////

//Export the router so it can be mounted in the main app
module.exports = router;
