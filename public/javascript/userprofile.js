
function reloadPage(){
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			merge(JSON.parse(this.responseText));
			renderList(); //call function to fill in the list div
		}
	};
	xhttp.open("GET", "http://localhost:3000/list", true);
	xhttp.send();
}

function switchAccountType(){
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if (this.status==200){
        console.log(JSON.parse(this.responseText));
        sendChangeRequest(JSON.parse(this.responseText));
      }
      else{
        alert("The server failed to get your account type. Please try again.");
      }
    }
	};
	xhttp.open("GET", window.location.href+"/accountType", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

function sendChangeRequest(accountType){
  let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState==4){
      if(this.status==200){
        location.reload();
      }
      else{
        alert("The server failed to change your account type.");
      }
		}
	};
	xhttp.open("PUT", window.location.href+"/accountType", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify({"accountType": !accountType.accountType}));
}

function editPeople(){

}

function editUsers(){

}

function editWatchlist(){

}
