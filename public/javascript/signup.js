function validateInput(username, password){
  if(username.length == 0 || password.length == 0){
    alert("Both textfields are required to proceed.")
    return false;
  }
  return true;
}


function createUserObject(username, password){
  let userObject = {"username": username, "password": password};
  return userObject;
}

function signUpUser(){
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if(validateInput){
    let userObject = createUserObject(username, password);
    if(userObject){
      let xhttp = new XMLHttpRequest();
    	xhttp.onreadystatechange = function() {
    		if(this.readyState==4){
          if(this.status==200){
            let id = (JSON.parse(this.responseText))._id;
            window.location.replace(`/users/${id}`);
          }
          else if(this.status==403){
            alert("You are not authorized to signup for an account.");
            //403 Forbidden
            //The request contained valid data and was understood by the server,
            //but the server is refusing action. This may be due to the user not having the necessary permissions for a
            //resource or needing an account of some sort, or attempting a prohibited action
            // (e.g. creating a duplicate record where only one is allowed).
            //Zara ->such as making an account when already logged in for our case
          }
          else if(this.status==409){
            alert("A user exists with this username. Try another one.");
          }
          else if(this.status==400){
            alert("There was a problem with creating your account. Ensure both fields are filled in or try a different combination.")
          }
          else{
            alert("There was a problem with the server. Try again.");
          }
    		}
    	};
    	xhttp.open("POST", "/users/signup", true);
    	xhttp.setRequestHeader("Content-Type", "application/json");
    	xhttp.send(JSON.stringify(userObject));
    }
  }
}
