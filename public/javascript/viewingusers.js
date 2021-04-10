function startFollowing(){
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if (this.status==200){
        let usersFollowing =  JSON.parse(this.responseText);
        console.log(usersFollowing);
        createObject(usersFollowing.usersFollowing);
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
	xhttp.open("GET", "/users/"+userID+"/usersFollowing", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

function createObject(usersFollowing){
  let personID = window.location.pathname.slice(7);
  usersFollowing.push(personID);
  console.log(usersFollowing);
  changeUsersFollowing(usersFollowing);
}

function changeUsersFollowing(usersFollowing){
  if(usersFollowing){
    let xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
  		if(this.readyState==4){
        if(this.status==200){
          alert("Added to users following.");
        }
        else if(this.status==401){
          alert("You are not authorized to add this user to your following list.");
        }
        else{
          alert("There was a problem with the server. Try again.");
        }
  		}
  	};
  	xhttp.open("PUT", "/users/"+userID+"/usersFollowing", true);
  	xhttp.setRequestHeader("Content-Type", "application/json");
  	xhttp.send(JSON.stringify({"usersFollowing": usersFollowing}));
  }
  else{
    alert("Something went wrong with adding this user to your following list.")
  }
}
