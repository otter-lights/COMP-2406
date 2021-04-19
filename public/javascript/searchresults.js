
//this function is called when the submit button is clicked on the search page
function sendLink(){
  let title = document.getElementById('title').value
  let name = document.getElementById('cast').value
  let genre = document.getElementById('genre').value
  let qstring = []
  //builds the query
  if(title){
    qstring.push("title=" + title)
  }
  if(name){
    qstring.push("person=" + name)
  }
  if(genre){
    qstring.push("genre=" + genre)
  }
  //makes the request
  window.location.href='/movies?' + qstring.join("&")
}
