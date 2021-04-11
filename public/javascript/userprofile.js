function switchAccountType(){
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if (this.status==200){
       sendChangeRequest(JSON.parse(this.responseText));
      }
      else if(this.status==403){
        //accessing another user's account, redirect
        alert("You are not authorized.");
        window.location.replace("/");
      }
      else if(this.status==404){
        alert("The user account you are requesting can't be found. Try to log in again.")
      }
      else if(this.status == 401){
        alert("You are not authorized.");
        window.location.replace("/");
        //not logged in
      }
      else{ //500 error code (internal server error)
        alert("The server failed to get your account type. Please try again.");
      }
    }
	};
	xhttp.open("GET", window.location.href+"/accountType", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

function sendChangeRequest(accountType){
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if(this.status==200){
        location.reload();
      }
      else if(this.status == 400){
        alert("Bad request. Try again.");
      }
      else if(this.status == 500){
        alert("Your changed account type couldn't be saved. Tru again.");
      }
      else if(this.status == 403){
        alert("You are not authorized.");
        window.location.replace("/");
        // session has expired trying to access an account that isn't theirs
      }
      else if(this.status == 401){
        alert("You are not authorized.");
        window.location.replace("/");
        //not logged in
      }
      else if(this.status==404){
        alert("The user account you are requesting can't be found. Try to log in again.")
      }
      else{ //500 error code (internal server error)
        alert("The server failed to change your account type. Please try again.");
      }
		}
	};
	xhttp.open("PUT", window.location.href+"/accountType", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify({"accountType": !accountType.accountType}));
}

function editPeople(){
  let collectionOfDivs = document.getElementById("peopleyoufollowcontainer").getElementsByClassName("iconboxes");
  buildList(collectionOfDivs, "peopleFollowing")
}


function editUsers(){
  console.log("Heyy");
  let collectionOfDivs = document.getElementById("usersyoufollowcontainer").getElementsByClassName("iconboxes");
  buildList(collectionOfDivs, "usersFollowing")
}

function editWatchlist(){
  console.log("Heyy");
  let collectionOfDivs = document.getElementById("watchlistcontainer").getElementsByClassName("iconboxes");
  buildList(collectionOfDivs, "watchlist")
}

function buildList(divs, path){
  let stillFollowing = [];
  for (let i = 0; i < divs.length; i++){
    let checkbox = divs[i].getElementsByTagName("input");
    console.log(checkbox[0].checked);
    //If an item isn't checked, we want to keep it
    if(checkbox[0].checked === false){
      stillFollowing.push(divs[i].id);
    }
  }
  console.log(stillFollowing);
  sendItemsToServer(stillFollowing, path);
}

function sendItemsToServer(following, path){
  if(following){
    let xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
  		if(this.readyState==4){
        if(this.status==200){
          alert("Removed from following.");
          location.reload();
        }
        else if(this.status==401){
          alert("You are not authorized to remove from following from this account.");
          window.location.replace("/");
        }
        else{
          alert("There was a problem with the server. Try again.");
        }
  		}
  	};
  	xhttp.open("PUT", window.location.href+'/'+path, true);
  	xhttp.setRequestHeader("Content-Type", "application/json");
    if(path === "peopleFollowing"){
  	   xhttp.send(JSON.stringify({"peopleFollowing": following}));
     }
    else if(path === "usersFollowing"){
      xhttp.send(JSON.stringify({"usersFollowing": following}));
    }
    else if(path === "watchlist"){
      xhttp.send(JSON.stringify({"watchlist": following}));
    }
  }
}
