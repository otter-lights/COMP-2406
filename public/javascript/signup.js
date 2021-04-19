//validates input to ensure it's not empty
function validateInput(username, password){
  if(username.length == 0 || password.length == 0){
    alert("Both textfields are required to proceed.")
    return false;
  }
  return true;
}

//creates the user object to send to the server
function createUserObject(username, password){
  let userObject = {"username": username, "password": password};
  return userObject;
}

//called when the button is clicked to sign up.
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
            alert("You cannot create an account while logged-in.");
            //the user is already logged in
          }
          else if(this.status==409){
            //conflict error due to username
            alert("A user exists with this username. Try another one.");
          }
          else if(this.status==400){
            //bad content error
            alert("There was a problem with creating your account. Ensure both fields are filled in or try a different combination.")
          }
          else{
            //500 or other errors
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
