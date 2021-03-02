const express = require('express');
let app = express();

//app.use = for ANY request
//We will see ways to specify route-specific handlers soon
app.use(function(req,res,next){
	console.log(req.method);
	console.log(req.url);
	console.log(req.path);
	next();
});

//Serve static resources from public, if they exist
app.use(express.static("static_pgs"));

//If the resource wasn't in other, continue the chain

//This is a shorthand way of creating/initializing the HTTP server
app.listen(3000);
console.log("Server listening at http://localhost:3000");