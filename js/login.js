let loginBtn = document.getElementById("LoginBtn");
const url = "http://localhost:8080/home/genie/user/login";
const UserSessionStorageKey = "LoggedInUser";

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // e.preventDefault();
  let emailId = document.getElementById("login-email").value;
  let paswd = document.getElementById("login-password").value;

  if (emailId === "" || paswd === "") {
    alert("Field(s) cannot be left blank");
    return;
  }

  const response = new XMLHttpRequest();
  const json = JSON.stringify({
    email: emailId,
    password: paswd,
  }); //

  postData(url, json)
    .then((userData) => {
      console.log("status: " + userData.status);
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
      console.log("ERROR:" + err);
    });
});

async function postData(url = "", data) {
  // Default options are marked with *
  const request = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Origin": "*",
    },
    body: data,
    method: "POST",
  }).catch((error) => {
    console.log("Only Network Error", error);
  });
  return request.json(); // parses JSON response into native JavaScript objects
  // To ask sir
  // request
  //   .then((res) => {
  //     if (res.ok) {
  //       return res.json(); // parses JSON response into native JavaScript objects
  //     } else {
  //       return res.text().then((data) => {
  //         console.log();
  //       });
  //     }
  //   })
  //   .catch((error) => {
  //     console.log("Only Network Error", error);
  //   });

  // request
  //   .then((response) => {
  //     if (response.ok) {
  //       //success case
  //       console.log("Success!");
  //       //example of reading response header data
  //       console.log(response.headers.get("Content-Type"));
  //       //we are assuming JSON
  //       return response.json();
  //     } else {
  //       // error
  //       response.text().then((text) => console.log(text));
  //     }
  //   })
  //   .catch((error) => {
  //     console.log("Only Network Error", error);
  //   });

  // if(response.ok)
  // {
  //
  // }
  // else{
  //   return response.text().then((data)=>{console.log()})
  // }
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
