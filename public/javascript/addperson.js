function verifyLetters(name){
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
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if(this.status==201){
        let id = (JSON.parse(this.responseText))._id;
        window.location.replace(`/people/${id}`);
      }
      else if(this.status==401){
        alert("You are not authorized to add a person to the database.");
      }
      else if(this.status==409){
        alert("This person already exists in the database. You can search for them in the search tab.");
      }
      else{
        alert("There was a problem with the server. Try again.");
      }
		}
	};
	xhttp.open("POST", "/addperson", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify({"name": name}));
}
