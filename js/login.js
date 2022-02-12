let loginBtn = document.getElementById("LoginBtn");

loginBtn.addEventListener("click", () => {
  alert("hi");
  // e.preventDefault();
  let emailId = document.getElementById("login-username").value;
  let paswd = document.getElementById("login-password").value;

  const response = new XMLHttpRequest();
  const json = JSON.stringify({
    email: emailId,
    password: paswd,
  }); //

  const url = "http://localhost:8080/home/genie/user/login";
  const data = { title: "The Matrix", year: "1994" };
  //
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Origin": "*",
    },
    body: json,
    method: "POST",
  })
    .then("data => data.json()))")
    .then((response) => {
      alert("Response: " + response.status);
      response.json();
    })
    .then((user) => {
      myStorage = window.sessionStorage;
      myStorage.setItem("LoggedInUser", JSON.stringify(user));
      alert("Login Successful");
      alert("user:" + user);
      alert("user:" + JSON.stringify(user));
      window.location.href = "/html_Files/index.html";
      console.log("Data: " + user);
    })
    .catch((err) => {
      alert("Error: " + err);
    });
});
