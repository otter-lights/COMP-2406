
function findUser(username, password){
  //look for user with username that matches
  //if can't be found, return false and display alert message
  //else, check if password matches in user object
  //if password doesn't match, return false and display alert message
  return true; //return user object?
}

function signInUser(){
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if(username.length == 0 || password.length == 0){
    alert("Both textfields are required to proceed.")
    return;
  }
  if(findUser(username, password)){
    //enter website
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    return;
  }
  else{
    return;
  }
}
