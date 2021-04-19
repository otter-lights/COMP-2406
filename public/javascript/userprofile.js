
/////////////////////CHANGE ACCOUNT TYPE////////////////////////

//called when the button is clicked to change account type.
function switchAccountType(){
  //sends a GET request to get the user's account type.
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if (this.status==200){
       sendChangeRequest(JSON.parse(this.responseText));
       //sends the response to the next function
      }
      else if(this.status==403){
        //accessing another user's account, redirect
        alert("You are not authorized to access this account.");
        window.location.replace("/");
      }
      else if(this.status==404){
        alert("The user account you are requesting can't be found. Try to log in again.")
        window.location.replace("/");
      }
      else if(this.status == 401){
        alert("You are not logged in.");
        window.location.replace("/");
      }
      else{ //500 error code (internal server error)
        alert("The server failed to get your account type. Please try again.");
        location.reload();
      }
    }
	};
	xhttp.open("GET", window.location.href+"/accountType", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

//sends a PUT request to change the account type
function sendChangeRequest(accountType){
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if(this.status==200){
        //refreshes the page to reflect the changes
        location.reload();
      }
      else if(this.status == 400){
        alert("Bad request. Try again.");
      }
      else if(this.status == 500){
        alert("Your changed account type couldn't be saved. Try again.");
      }
      else if(this.status == 403){
        alert("You are not authorized to change the account type of this user.");
        window.location.replace("/");
      }
      else if(this.status == 401){
        alert("You are not logged in.");
        window.location.replace("/");
      }
      else if(this.status==404){
        alert("The user account you are requesting can't be found. Try to log in again.");
        window.location.replace("/");
      }
      else{ //500 error code (internal server error) or something else
        alert("The server failed to change your account type. Please try again.");
        location.reload();
      }
		}
	};
	xhttp.open("PUT", window.location.href+"/accountType", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify({"accountType": !accountType.accountType}));
}

//////////////////////EDITING WATCHLIST/FOLLOWING LISTS////////////////////////
//called when remove button is clicked for people followed
function editPeople(){
  let collectionOfDivs = document.getElementById("peopleyoufollowcontainer").getElementsByClassName("iconboxes");
  buildList(collectionOfDivs, "peopleFollowing")
}

//called when remove button is clicked for users followed
function editUsers(){
  let collectionOfDivs = document.getElementById("usersyoufollowcontainer").getElementsByClassName("iconboxes");
  buildList(collectionOfDivs, "usersFollowing")
}

//called when remove button is clicked for watchlist
function editWatchlist(){
  let collectionOfDivs = document.getElementById("watchlistcontainer").getElementsByClassName("iconboxes");
  buildList(collectionOfDivs, "watchlist")
}

//looks at divs and checks what is checked (for removal) and what is not
function buildList(divs, path){
  let stillFollowing = [];
  let unfollowed = [];
  for (let i = 0; i < divs.length; i++){
    let checkbox = divs[i].getElementsByTagName("input");
    //If an item isn't checked, we want to keep it
    if(checkbox[0].checked === false){
      stillFollowing.push(divs[i].id);
    }
    else{
      unfollowed.push(divs[i].id);
    }
  }
  if(stillFollowing.length < divs.length){
    createObject(stillFollowing, unfollowed, path);
  }
}

//creates an object depending on whether it is watchlist, users followed or people followed
function createObject(stillFollowing, unfollowed, path){
  let object = {};
  if(path === "peopleFollowing"){
     object.peopleFollowing = stillFollowing;
     object.removed = unfollowed;
   }
  else if(path === "usersFollowing"){
    object.usersFollowing = stillFollowing;
    object.removed = unfollowed;
  }
  else if(path === "watchlist"){
    object.watchlist = stillFollowing;
    object.removed = unfollowed;
  }
  sendItemsToServer(object, path);
}

//sends the PUT request to the server for the path depending on whether it is watchlist, users followed or people followed changed
function sendItemsToServer(object, path){
  if(object){
    let xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
  		if(this.readyState==4){
        if(this.status==200){
          alert("Removed from following.");
          location.reload();
        }
        else if(this.status== 400){
          alert("Something went wrong.");
          location.reload();
        }
        else if(this.status == 404){
          alert("The user you are requesting cannot be found.");
          window.location.replace("/");
        }
        else if(this.status == 403){
          alert("You are not authorized to remove from following from this account.");
          window.location.replace("/");
        }
        else if(this.status==401){
          alert("You are not logged in.");
          window.location.replace("/");
        }
        else{ //500 or some other error.
          alert("There was a problem with the server. Try again.");
          location.reload();
        }
  		}
  	};
  	xhttp.open("PUT", window.location.href+'/'+path, true);
  	xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(object));
  }
}
