const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
//const Product = require("./ProductModel");
const express = require('express');
//const faker = require('faker');
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

//now create the functions above! Look at the store-server if confused. Those functions above are just examples btw.

//Export the router so it can be mounted in the main app
module.exports = router;