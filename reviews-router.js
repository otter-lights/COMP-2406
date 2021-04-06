const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const Product = require("./ProductModel");
const express = require('express');
const faker = require('faker');
let router = express.Router();

router.post("/", express.json(), addReview); //adds a new review
router.get("/:id", getReview); //sends review with ID (PUG or JSON)

//now create the functions above! Look at the store-server if confused. Those functions above are just examples btw.

//Export the router so it can be mounted in the main app
module.exports = router;