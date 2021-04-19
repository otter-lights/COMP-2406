
/////////////////////ADDS REVIEW////////////////////////
//this function is called when the submit button is clicked on a review
function addReview(){
  let rating = document.getElementById("reviewoutof10").value;
  let briefsummary = document.getElementById("briefsummaryinput").value;
  let review = document.getElementById("fullreviewinput").value;

  //verifies input and creates an object to send to the server
  let reviewObject = createObject(rating, briefsummary, review);
  if (!reviewObject){
    return;
  }


  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if(this.status==201){
        location.reload();
      }
      else if(this.status==401){
        alert("You are not logged in.");
        window.location.replace("/");
      }
      else if(this.status==400){
        alert("There was something wrong with the content of your review. Try again.");
      }
      else{
        alert("There was a problem with the server.");
        location.reload();
      }
		}
	};
	xhttp.open("POST", "/reviews", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(reviewObject));
}


function createObject(rating, briefsummary, review){
  let reviewObject = {};
  if (rating === ""){
    alert("The rating field is required.")
    return;
  }
  else{
    reviewObject.rating = rating;
  }
  if(!(briefsummary === "")){
    reviewObject.briefsummary = briefsummary;
  }
  if(!(review === "")){
    reviewObject.review = review;
  }
  let movieID = window.location.pathname.slice(8);
  reviewObject.movieID = movieID;
  return reviewObject;
}

/////////////////////ADD MOVIE TO WATCHLIST////////////////////////
//this function is called when the add to watchlist button is clicked
function addToWatchlist(){
  //sends a GET request to the server to get the currently logged-in user's watchlist
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if (this.status==200){
        let watchlist =  JSON.parse(this.responseText);
        createWatchlistObject(watchlist.watchlist);
        //creates the new watchlist with the person to follow
      }
      else if(this.status==403){
        //accessing another user's account, redirect
        window.location.replace("/");
      }
      else if(this.status==404){
        alert("The user account you are requesting to add to watchlist of cannot be found.");
        window.location.replace("/");
      }
      else if(this.status == 401){
        alert("You are not logged in.");
        window.location.replace("/");
      }
      else{ //500 error code (internal server error)
        alert("The server failed to get your following list. Please try again.");
        location.reload();
      }
    }
	};
	xhttp.open("GET", "/users/"+userID+"/watchlist", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

//creates the new watchlist with the movie
function createWatchlistObject(watchlist){
  let object = {};
  let movieID = window.location.pathname.slice(8);
  watchlist.push(movieID);
  object.watchlist = watchlist;
  object.addedMovie = movieID;
  changeWatchlist(object);
}

//sends the newly changed user watchlist to the server with a PUT request
function changeWatchlist(object){
  if(object){
    let xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
  		if(this.readyState==4){
        if(this.status==200){
          alert("Added to watchlist.");
          location.reload();
        }
        else if(this.status == 400){
          alert("Something went wrong.");
          location.reload();
        }
        else if(this.status==403){
          //accessing another user's account, redirect
          window.location.replace("/");
        }
        else if(this.status==404){
          alert("The user account you are requesting can't be found.");
          window.location.replace("/");
        }
        else if(this.status==401){
          alert("You are not logged in.");
          window.location.replace("/");
        }
        else{
          alert("There was a problem with the server. Try again.");
          location.reload();
        }
  		}
  	};
  	xhttp.open("PUT", "/users/"+userID+"/watchlist", true);
  	xhttp.setRequestHeader("Content-Type", "application/json");
  	xhttp.send(JSON.stringify(object));
  }
  else{
    alert("Something went wrong with adding this movie to your watchlist.")
    location.reload();
  }
}
