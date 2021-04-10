function startFollowing(){
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if (this.status==200){
        let peopleFollowing =  JSON.parse(this.responseText);
        console.log(peopleFollowing);
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
  let personID = window.location.pathname.slice(8);
  peopleFollowing.push(personID);
  console.log(peopleFollowing);
  changePeopleFollowing(peopleFollowing);
}

function changePeopleFollowing(peopleFollowing){
  if(peopleFollowing){
    let xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
  		if(this.readyState==4){
        if(this.status==200){
          alert("Added to people following.");
        }
        else if(this.status==401){
          alert("You are not authorized to add this person to your following list.");
        }
        else{
          alert("There was a problem with the server. Try again.");
        }
  		}
  	};
  	xhttp.open("PUT", "/users/"+userID+"/peopleFollowing", true);
  	xhttp.setRequestHeader("Content-Type", "application/json");
  	xhttp.send(JSON.stringify({"peopleFollowing": peopleFollowing}));
  }
  else{
    alert("Something went wrong with adding this person to your following list.")
  }
}
