let loginBtn = document.getElementById("LoginBtn");
const url = "http://localhost:8080/home/genie/user/login";
const UserSessionStorageKey = "LoggedInUser";

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // e.preventDefault();
  let emailId = document.getElementById("login-email").value;
  let paswd = document.getElementById("login-password").value;

  if (emailId === "" || paswd === "") {
    document.querySelector(".msgwrapper").style.border = "2px solid red";
    ShowMessagePopUp("Field(s) cannot be left blank");
    setTimeout(() => {
      document
        .querySelector(".messageboxWrapper")
        .classList.remove("showMsgbox");
    }, 2000);
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
        ShowMessagePopUp("Login Failed");

        document.querySelector(".msgwrapper").style.border = "2px solid red";
        setTimeout(() => {
          document
            .querySelector(".messageboxWrapper")
            .classList.remove("showMsgbox");
          return;
        }, 2000);
      } else {
        UpdateStorageSessions(UserSessionStorageKey, logInUser);

        document.querySelector(".msgwrapper").style.border =
          "2px solid #006c84";
        ShowMessageAndRedirectAfterTimeout(
          2000,
          "Login Successful",
          "index.html"
        );

        // window.location.href = "/html_Files/index.html";
      }
    })
    .catch((err) => {
      document.querySelector(".msgwrapper").style.border = "2px solid red";
      ShowMessagePopUp(`Error occured. Kindly check console.`);
      console.log("Error occured while Login: " + err);
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

function ShowMessagePopUp(msg) {
  document.getElementById("yourMsg").innerHTML = msg;

  document.querySelector(".messageboxWrapper").classList.add("showMsgbox");
}

function ShowMessageAndRedirectAfterTimeout(time, msg, redirectPath) {
  document.getElementById("yourMsg").innerHTML = msg;

  document.querySelector(".messageboxWrapper").classList.add("showMsgbox");
  setTimeout(function () {
    document.querySelector(".messageboxWrapper").classList.remove("showMsgbox");
    window.location.href = redirectPath;
  }, time);
}

function ShowMessageWithTimeout(time, msg) {
  document.getElementById("yourMsg").innerHTML = msg;

  document.querySelector(".messageboxWrapper").classList.add("showMsgbox");
  setTimeout(function () {
    document.querySelector(".messageboxWrapper").classList.remove("showMsgbox");
  }, time);
}
// Close the notification on cross click
let closeMsgBox = document.getElementById("CloseMsgBox");
if (closeMsgBox != null) {
  document.getElementById("CloseMsgBox").addEventListener("click", (e) => {
    e.preventDefault();

    document.querySelector(".messageboxWrapper").classList.remove("showMsgbox");
  });
}
