let loginBtn = document.getElementById("LoginBtn");
const url = "http://localhost:8080/home/genie/user/login";
const UserSessionStorageKey = "LoggedInUser";

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // e.preventDefault();
  let emailId = document.getElementById("login-email").value;
  let paswd = document.getElementById("login-password").value;

  const response = new XMLHttpRequest();
  const json = JSON.stringify({
    email: emailId,
    password: paswd,
  }); //

  postData(url, json)
    .then((userData) => {
      // User Data from DB
      let logInUser = JSON.stringify(userData);
      console.log("Data: " + logInUser);
      console.log(logInUser.hasOwnProperty("message"));
      console.log("message" in userData);
      if ("message" in userData) {
        alert("Login Failed");
      } else {
        alert("Login Successful");
        UpdateStorageSessions(UserSessionStorageKey, logInUser);
        window.location.href = "/html_Files/index.html";
      }
    })
    .catch((err) => {
      alert(err);
    });
});

async function postData(url = "", data) {
  // Default options are marked with *
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Origin": "*",
    },
    body: data,
    method: "POST",
  }).catch((err) => {
    return err;
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const UpdateStorageSessions = (key, value) => {
  myStorage = window.sessionStorage;

  if (myStorage.getItem(key) == null) {
    myStorage.setItem(key, value);
  } else {
    myStorage.removeItem(key);
    myStorage.setItem(key, value);
  }
};