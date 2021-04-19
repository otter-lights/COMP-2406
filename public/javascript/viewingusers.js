//this function is called when the button is clicked on a user's page to start following them.
function startFollowing(){
  //sends a GET request to get the following list of the user logged-in
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if (this.status==200){
        let usersFollowing =  JSON.parse(this.responseText);
        createObject(usersFollowing.usersFollowing);
        //creates the new followed list with the user to follow
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
	xhttp.open("GET", "/users/"+userID+"/usersFollowing", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

//creates the new followed list with the user to follow
function createObject(usersFollowing){
  let object = {};
  let userID = window.location.pathname.slice(7);
  usersFollowing.push(userID);
  object.usersFollowing = usersFollowing;
  object.addedUser = userID;
  changeUsersFollowing(object);
}

//sends the newly changed user following list to the server with a PUT request
function changeUsersFollowing(object){
  if(object){
    let xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
  		if(this.readyState==4){
        if(this.status==200){
          alert("Added to users following.");
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
          alert("You are not logged in");
          window.location.replace("/");
        }
        else{
          alert("There was a problem with the server. Try again.");
          location.reload();
        }
  		}
  	};
  	xhttp.open("PUT", "/users/"+userID+"/usersFollowing", true);
  	xhttp.setRequestHeader("Content-Type", "application/json");
  	xhttp.send(JSON.stringify(object));
  }
  else{
    alert("Something went wrong with adding this user to your following list.");
    location.reload();
  }
}
