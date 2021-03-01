
function doesPersonExist(name){
  //checks server to see if person with this name exists already
  //if they do, return true
  //if not, return false
  return false;
}

function verifyLetters(name){
  //input verification, make sure it's an actual name.
  if(name.length == 0){
    return false;
  }
  return true;
}

function addPerson(){
  let name = document.getElementById("name").value;
  if(!verifyLetters(name)){
    alert("Please input a valid name into the textfield.")
    return;
  }
  if(!doesPersonExist(name)){
    let newPersonObject = {"Name":name}; //add more
    //add person to database:
    //create new person json object
    //send this object to the server
    document.getElementById("name").value = ""; //clear the content
  }
    else{
      alert("This person already exists in Razara's database.")
      return;
    }
}
