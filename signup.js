function checkForDuplicateUsername(username){
  //if there's a user object with this username, return true.
  return false
}

function signUpUser(){
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if(username.length == 0 || password.length == 0){
    alert("Both textfields are required to proceed with account creation.")
    return;
  }
  if (!checkForDuplicateUsername(username)){
    let newUserObject = {"Username":username, "Password":password};
    //create new user object
    //add to the object above
    //throw the object to the server
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  }
  else{
    alert("This username is already associated with an account. Own this account? Go to the log-in page. Otherwise, pick a difference username.");
  }
}
