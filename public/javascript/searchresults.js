function sendLink(){
  let title = document.getElementById('title').value
  let name = document.getElementById('cast').value
  let genre = document.getElementById('genre').value
  let qstring = []
  if(title){
    qstring.push("title=" + title)
  }
  if(name){
    qstring.push("person=" + name)
  }
  if(genre){
    qstring.push("genre=" + genre)
  }
  console.log(qstring.join("&"))
  //console.log("?title=" + title + "&person=" + name + "&genre=" + genre)
  window.location.href='/movies?' + qstring.join("&")
}