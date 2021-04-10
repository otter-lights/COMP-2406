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
