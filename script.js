function UserAction() {
    // console.log(e);
    // e.preventDefault();
    fname = document.getElementById('firstname').value;
    lname = document.getElementById('lastname').value;
    emailId = document.getElementById('email').value;
    paswd = document.getElementById('password').value;
    console.log(fname);
    const response = new XMLHttpRequest();

    const json = JSON.stringify({
        firstName: fname,
        lastName: lname,
        email: emailId,
        password:paswd
    });    //
    // response.onreadystatechange = function() {
        //  if (this.readyState == 4 && this.status == 200) {
            //  alert(this.responseText);
        //  }
    // };
    // response.open("POST", "http://localhost:8080/home/genie/signup");
    // response.setRequestHeader('Content-type', 'application/json');
    // response.send(json);
    // response.onload = (e) => {
        // alert(response.response);
    // }
    const url = 'http://localhost:8080/home/genie/user/signup';
    const data = { title: "The Matrix", year: "1994" };
// 
fetch(url, {
        headers: { "Content-Type": "application/json","Accept":"*","Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Origin": "*"   },
        body: json,
        method: "POST"
    }
)
.then("data => data.json()))")
.then(
    alert('Success:'));
}