const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const Product = require("./ProductModel");
const express = require('express');
const faker = require('faker');
let router = express.Router();

router.get("/", searchMovie); //or queryparser idk whatever we wanna call the functions
router.post("/", express.json(), createMovie); //create a movie and add to the database
//also dave had express.json() as the first step for adding a new product in his store-server example so ig this parses the data.

router.get("/:id", sendMovie); //sends movie with ID (PUG or JSON)
router.get("/:id/reviews", populateReviewIds, sendReviews); 
//- Supports response types application/json
//- Retrieves the array of reviews about a particular movie

//now make these functions so the get requests and whatever can be executed :)


//Export the router so it can be mounted in the main app
module.exports = router;