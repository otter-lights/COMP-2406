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
