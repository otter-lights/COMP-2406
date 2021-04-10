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
  console.log(movieID);
  reviewObject.movieID = movieID;
  console.log(reviewObject);
  return reviewObject;
}

function addReview(){
  let rating = document.getElementById("reviewoutof10").value;
  let briefsummary = document.getElementById("briefsummaryinput").value;
  let review = document.getElementById("fullreviewinput").value;

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
        alert("You are not authorized to add a review to this movie.");
      }
      else{
        alert("There was a problem with the server. Try again.");
      }
		}
	};
	xhttp.open("POST", "/reviews", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(reviewObject));
}

function getLoggedinUser(){

}

function addToWatchlist(){
  let movieID = window.location.pathname.slice(8);

  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if (this.status==200){
        let watchlist =  JSON.parse(this.responseText);
        createMovieObject(watchlist.watchlist);
      }
      else if(this.status==403){
        //accessing another user's account, redirect
        window.location.replace("/");
      }
      else if(this.status==404){
        alert("The user account you are requesting from can't be found. Try to log in again.")
      }
      else if(this.status == 401){
        window.location.replace("/");
        //not logged in
      }
      else{ //500 error code (internal server error)
        alert("The server failed to get retrieve your watchlist. Please try again.");
      }
    }
	};
	xhttp.open("GET", "/users/"+userID+"/watchlist", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

function changeWatchlist(watchlist){
  if(watchlist){
    let movieID = window.location.pathname.slice(8);
    let xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
  		if(this.readyState==4){
        if(this.status==200){
          alert("Added to watchlist.");
        }
        else if(this.status==401){
          alert("You are not authorized to add this movie to your watchlist.");
        }
        else{
          alert("There was a problem with the server. Try again.");
        }
  		}
  	};
  	xhttp.open("PUT", "/users/"+userID+"/watchlist", true);
  	xhttp.setRequestHeader("Content-Type", "application/json");
  	xhttp.send(JSON.stringify({"watchlist": watchlist}));
  }
  else{
    alert("Something went wrong with adding this movie to your watchlist.")
  }
}


function createMovieObject(watchlist){
  let movieID = window.location.pathname.slice(8);
  console.log(watchlist);
  watchlist.push(movieID);
  console.log(watchlist);
  changeWatchlist(watchlist);
}
