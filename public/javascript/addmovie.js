let directors=[];
let writers=[];
let actors=[];
let genres = [];

////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////
function addWriters(){
  let input = document.getElementById("writers").value.trim();
  let datalist =  document.getElementById("writerNames");
  let div = document.getElementById("writ");
  let clear = document.getElementById("writers");
  addNames(input, datalist, div, writers, clear);
}

function addDirectors(){
  let input = document.getElementById("directors").value.trim();
  let datalist =  document.getElementById("directorNames");
  let div = document.getElementById("direct");
  let clear = document.getElementById("directors");
  addNames(input, datalist, div, directors, clear);
}

function addActors(){
  let input = document.getElementById("actors").value.trim();
  let datalist =  document.getElementById("actorNames");
  let div = document.getElementById("act");
  let clear = document.getElementById("actors");
  addNames(input, datalist, div, actors, clear);
}

function addNames(input, datalist, div, array, boxToClear){
  for(let i = 0; i < datalist.options.length; i++){
    if(input === datalist.options[i].value){
      boxToClear.value = "";
      if(!isDuplicate(datalist.options[i].value, array)){
        array.push(datalist.options[i].value);
        let names = div.innerHTML;
        if(names === undefined){
          names = "";
        }
        names += "<p>"+datalist.options[i].value+"</p>";
        div.innerHTML = names;
      }
    }
  }
}

////////////////////////////////////////////////////////////////

function addGenres(){
  let input = document.getElementById("genres").value.trim();
  input = capitalize(input);
  if(input.length > 0){
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
    document.getElementById("genres").value = "";
  }
}

function capitalize(string){
  let words = string.toLowerCase().split(' ');
   for (let i = 0; i < words.length; i++) {
       words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
   }
   return words.join(' ');
}

function isDuplicate(name, array){
  return array.includes(name);
}

//////////////////////////////////////////////////////////

function addMovie(){
  let title = capitalize(document.getElementById("title").value).trim();
  let year = document.getElementById("year").value.trim();
  let runtime = document.getElementById("runtime").value.trim();
  let plot = document.getElementById("plot").value.trim();

  if((!verifynumber(year)|| !verifynumber(runtime)) && genres.length > 0 && title.length > 0){
    alert("Please make sure you are entering your answers in numerical format for the year and release year.");
  }

	else if(title.length === 0 || year.length === 0 || runtime.length === 0 || plot.length === 0){
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
    createObject(title, year, runtime, plot);
  }
}

function verifynumber(number){
  console.log(!isNaN(parseInt(number)));
  return(!isNaN(parseInt(number)));
}

function createObject(title, year, runtime, plot){
  let movie = {};
  movie.title = title;
  movie.year = year;
  movie.runtime = runtime + " mins"
  movie.plot = plot;
  movie.genres = genres;
  movie.director = directors;
  movie.actor = actors;
  movie.writer = writers;
  sendServerRequest(movie);
}

function sendServerRequest(movie){
    let xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
  		if(this.readyState==4){
        if(this.status==201){
          let id = (JSON.parse(this.responseText))._id;
          window.location.replace(`/movies/${id}`);
        }
        else if(this.status==401){
          alert("You are not authorized to add a movie to the database.");
        }
        else if(this.status==409){
          alert("A movie with this title already exists in the database. You can search for it in the search tab.");
        }
        else if(this.status == 400){
          alert("Something is wrong with the content.");
        }
        else if(this.status == 500){
          alert("Something went wrong with linking the people you added to the movie.");
          if(JSON.parse(this.responseText).hasOwnProperty("_id")){
            let id = (JSON.parse(this.responseText))._id;
            window.location.replace(`/movies/${id}`);
          }
        }
        else{
          alert("There was a problem with the server. Try again.");
        }
  		}
  	};
  	xhttp.open("POST", "/movies", true);
  	xhttp.setRequestHeader("Content-Type", "application/json");
  	xhttp.send(JSON.stringify(movie));
}
