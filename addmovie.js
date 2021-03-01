
function verifynumber(year){
  if (typeof year == 'number'){
    return true;
  } //checks if it's a number
  return false;
}

function movieIsInServer(){
  return false;
}

//The page must give the user a way to dynamically search for people within the
//database to add to the movie (e.g., using AJAX).
//The user should not be required to type in the full name of the person,
//but instead should be able to add the person as a writer, director, or actor
//directly from the search results.

//ADD EVENT LISTENERS FOR THE WRITERS, DIRECTORS, ACTORS BOXES SO THE SEARCH RESULTS AUTO UPDATE

function addMovie(){
  let title = document.getElementById("title").value;
  let releaseyear = document.getElementById("releaseYear").value;
  let runtime = document.getElementById("runtime").value;
  let genres = document.getElementById("genres").value;
  let writers = document.getElementById("writers").value;
  let directors = document.getElementById("directors").value;
  let actors = document.getElementById("actors").value;

	if(title.length == 0 || releaseyear.length == 0 || runtime.length == 0 || genres.length == 0 || writers.length == 0 || directors.length == 0 || actors.length == 0 ){
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
