let directors=[];
let writers=[];
let actors=[];

function verifynumber(year){
  if (typeof year == 'number'){
    return true;
  } //checks if it's a number
  return false;
}

function movieIsInServer(){
  return false;
}

function getDirectors(){
  let input = document.getElementById("directors").value;
  if(input.length > 0){
    sendRequest("directors", input);
  }
}
function getActors(){
  let input = document.getElementById("actors").value;
  if(input.length > 0){
    sendRequest("actors", input);
  }
}

function getWriters(){
  let input = document.getElementById("writers").value;
  if(input.length > 0){
    sendRequest("writers", input);
  }
}

function sendRequest(path, input){
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if (this.status==200){
        let result = JSON.parse(this.responseText);
        display(result, path);
      }
      else{ //500 error code (internal server error)
        alert("The server failed to get retrieve the list. Please try again.");
      }
    }
	};
	xhttp.open("GET", `/people?chars=${input}`, true);
	xhttp.send();
}

function display(result, path){
  let div;
  if (path === "writers"){
    div = document.getElementById("writerNames");
  }
  else if(path==="actors"){
    div = document.getElementById("actorNames");
  }
  else if(path==="directors"){
    div = document.getElementById("directorNames");
  }
  else{
    return;
  }
  let names = "";
  (result.names).forEach(name => names+= "<option value='"+name.name + "'/>");
  div.innerHTML = names;
}
//The page must give the user a way to dynamically search for people within the
//database to add to the movie (e.g., using AJAX).
//The user should not be required to type in the full name of the person,
//but instead should be able to add the person as a writer, director, or actor
//directly from the search results.

//ADD EVENT LISTENERS FOR THE WRITERS, DIRECTORS, ACTORS BOXES SO THE SEARCH RESULTS AUTO UPDATE

function addMovie(){
  let title = document.getElementById("title").value;
  let year = document.getElementById("year").value;
  let runtime = document.getElementById("runtime").value;
  let genres = document.getElementById("genres").value;
  let writers = document.getElementById("writers").value;
  let directors = document.getElementById("directors").value;
  let actors = document.getElementById("actors").value;

	if(title.length == 0 || year.length == 0 || runtime.length == 0 || genres.length == 0){
		alert("All fields are required to add a movie.");
		return;
	}
  else if(!verifynumber(releaseyear)|| !verifynumber(runtime)){
    alert("Please make sure you are entering your answers in numerical format when a number is required.")
  }

	if(!movieIsInServer()){ //checks server to see if the movie is in the server or not
    genres = genres.split(",");//splits genres by comma
    writers = writers.split(",");//most likely need to trim off whitespace
    directors = directors.split(",");
    actors = actors.split(",");
    //now have array of each.
    let newMovie = {"Title": title, "Year":releaseyear, "Runtime": runtime + " min", "Genre":genres, "Director": directors, "Writer": writers, "Actors": actors};
    //send movie to server
  }
}
