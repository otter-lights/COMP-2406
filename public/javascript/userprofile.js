function switchAccountType(){
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if (this.status==200){
       sendChangeRequest(JSON.parse(this.responseText));
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
        window.location.replace("/");
        // session has expired trying to access an account that isn't theirs
      }
      else if(this.status == 401){
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

}

function editUsers(){

}

function editWatchlist(){

}
