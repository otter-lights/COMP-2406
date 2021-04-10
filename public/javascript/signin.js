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

function loginUser(){
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if(validateInput(username, password)){
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
            alert("You are not authorized to login to this account. Try again.");
          }
          else if(this.status==400){
            alert("Both textfields are required to proceed.");
          }
          else if(this.status == 404){
            alert("This account does not exist. Go to the signup page to register this username.");
          }
          else{
            alert("There was a problem with the server. Try again.");
          }
    		}
    	};
    	xhttp.open("POST", "/users/login", true);
    	xhttp.setRequestHeader("Content-Type", "application/json");
    	xhttp.send(JSON.stringify(userObject));
    }
  }
}
