let directors=[];
let writers=[];
let actors=[];
let genres = [];

function verifynumber(number){
  console.log(!isNaN(parseInt(number)));
  return(!isNaN(parseInt(number)));
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

function addWriters(){
  let input = document.getElementById("writers").value.trim();
  let datalist =  document.getElementById("writerNames");
  let div = document.getElementById("writ");

  addNames(input, datalist, div, writers);
}

function addNames(input, datalist, div, array){
  for(let i = 0; i < datalist.options.length; i++){
    if(input === datalist.options[i].value){
      if(!isDuplicate(datalist.options[i].value, array)){
        array.push(datalist.options[i].value);
        let names = div.innerHTML;
        if(names === undefined){
          names = "";
        }
        names += "<p>"+datalist.options[i].value+"</p>";
        console.log(names);
        div.innerHTML = names;
        console.log(div);
      }
    }
  }
}

function addDirectors(){
  let input = document.getElementById("directors").value.trim();
  let datalist =  document.getElementById("directorNames");
  let div = document.getElementById("direct");
  addNames(input, datalist, div, directors);
}

function addActors(){
  let input = document.getElementById("actors").value.trim();
  let datalist =  document.getElementById("actorNames");
  let div = document.getElementById("act");
  addNames(input, datalist, div, actors);
}
//The page must give the user a way to dynamically search for people within the
//database to add to the movie (e.g., using AJAX).
//The user should not be required to type in the full name of the person,
//but instead should be able to add the person as a writer, director, or actor
//directly from the search results.

//ADD EVENT LISTENERS FOR THE WRITERS, DIRECTORS, ACTORS BOXES SO THE SEARCH RESULTS AUTO UPDATE

function addGenres(){
  let input = document.getElementById("genres").value.trim();
  if(!isDuplicate(input, genres)){
    genres.push(input);
    let div = document.getElementById("gen");
    let gen = div.innerHTML;
    if(gen === undefined){
      gen = "";
    }
    gen += "<p>"+input+"</p>";
    console.log(gen);
    div.innerHTML = gen;
    console.log(div);
  }
}

function isDuplicate(name, array){
  return array.includes(name);
}

function addMovie(){
  let title = document.getElementById("title").value.trim();
  let year = document.getElementById("year").value.trim();
  let runtime = document.getElementById("runtime").value.trim();

  if((!verifynumber(year)|| !verifynumber(runtime)) && genres.length > 0 && title.length > 0){
    console.log(year);
    console.log(runtime);
    alert("Please make sure you are entering your answers in numerical format for the year and release year.");
  }

	else if(title.length == 0 || year.length == 0 || runtime.length == 0 || genres.length == 0){
		alert("All fields are required to add a movie.");
		return;
	}
  else if(directors.length < 0 || actors.length < 0 || writers.length < 0){
    alert("At least one director, writer and actor is needed to add a movie to the database.");
  }
  else if(genres.length < 0){
    alert("At least one genre must be added.");
  }
  else{
    createObject(title, year, runtime);
  }
    //now have array of each.
    //let newMovie = {"Title": title, "Year":releaseyear, "Runtime": runtime + " min", "Genre":genres, "Director": directors, "Writer": writers, "Actors": actors};
    //send movie to server
  //}
}

function createObject(title, year, runtime){
  let movie = {};
  movie.title = title;
  movie.year = year;
  movie.runtime = runtime;
  movie.genres = genres;
  movie.director = directors;
  movie.actor = actors;
  movie.writer = writers;
}

function sendServerRequest(){
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
