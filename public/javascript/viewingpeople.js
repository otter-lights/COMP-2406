//this function is called when the button is clicked on a person's page to start following them.
function startFollowing(){
  //sends a get request to get the following list of the user logged-in
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if (this.status==200){
        let peopleFollowing =  JSON.parse(this.responseText);
        createObject(peopleFollowing.peopleFollowing);
        //creates the new followed list with the person to follow
      }
      else if(this.status==403){
        //accessing another user's account, redirect
        window.location.replace("/");
      }
      else if(this.status==404){
        alert("The user account you are requesting can't be found.");
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
	xhttp.open("GET", "/users/"+userID+"/peopleFollowing", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

//creates the new followed list with the person to follow
function createObject(peopleFollowing){
  let object = {};
  let personID = window.location.pathname.slice(8);
  peopleFollowing.push(personID);
  object.peopleFollowing = peopleFollowing;
  object.addedPerson = personID;
  changePeopleFollowing(object);
}

//sends the newly changed people following list to the server with a PUT request
function changePeopleFollowing(object){
  if(object){
    let xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
  		if(this.readyState==4){
        if(this.status==200){
          alert("Added to people following.");
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
  	xhttp.open("PUT", "/users/"+userID+"/peopleFollowing", true);
  	xhttp.setRequestHeader("Content-Type", "application/json");
  	xhttp.send(JSON.stringify(object));
  }
  else{
    alert("Something went wrong with adding this person to your following list.")
    location.reload();
  }
}
