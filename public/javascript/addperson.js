//checks if name is empty
function verifyLetters(name){
  if(name.length == 0){
    return false;
  }
  return true;
}

//capitalizes all the words in a person's name
function capitalize(string){
  let words = string.toLowerCase().split(' ');
   for (let i = 0; i < words.length; i++) {
       words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
   }
   return words.join(' ');
}

function addPerson(){
  let name = document.getElementById("name").value;
  if(!verifyLetters(name)){
    alert("Please input a valid name into the textfield.")
    return;
  }
  name = capitalize(name);

  //makes a POST request to add the person to the server
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if(this.status==201){
        let id = (JSON.parse(this.responseText))._id;
        window.location.replace(`/people/${id}`);
      }
      else if(this.status == 400){
        alert("There is something wrong with the content you provided. Try again.");
      }
      else if(this.status==401){
        alert("You are not logged-in.");
        window.location.replace("/");
      }
      else if(this.status==409){
        alert("This person already exists in the database. You can search for them in the search tab.");
      }
      else{
        alert("There was a problem with the server. Try again.");
      }
		}
	};
	xhttp.open("POST", "/people", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify({"name": name}));
}
