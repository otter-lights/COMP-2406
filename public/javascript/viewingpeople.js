function startFollowing(){
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if (this.status==200){
        let peopleFollowing =  JSON.parse(this.responseText);
        createObject(peopleFollowing.peopleFollowing);
      }
      else if(this.status==403){
        //accessing another user's account, redirect
        window.location.replace("/");
      }
      else if(this.status==404){
        alert("The user account you are requesting can't be found. Try to log in again.")
      }
      else if(this.status == 401){
        window.location.replace("/");
        //not logged in
      }
      else{ //500 error code (internal server error)
        alert("The server failed to get your following list. Please try again.");
      }
    }
	};
	xhttp.open("GET", "/users/"+userID+"/peopleFollowing", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

function createObject(peopleFollowing){
  let object = {};
  let personID = window.location.pathname.slice(8);
  peopleFollowing.push(personID);
  object.peopleFollowing = peopleFollowing;
  object.addedPerson = personID;
  changePeopleFollowing(object);
}

function changePeopleFollowing(object){
  if(object){
    let xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
  		if(this.readyState==4){
        if(this.status==200){
          alert("Added to people following.");
          location.reload();
        }
        else if(this.status==401){
          alert("You are not authorized to add this person to your following list.");
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
  }
}
