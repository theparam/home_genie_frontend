let signUpBtn = document.getElementById("SignUpBtn");
const url = "http://localhost:8080/home/genie/user/signup";
const UserSessionStorageKey = "LoggedInUser";

class signUpUser {
  constructor(firstName, lastName, phoneNumber, email, paswd) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.password = paswd;
  }
}

signUpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let fName = document.getElementById("SignUp_fName").value;
  let lName = document.getElementById("SignUp_lName").value;
  let phoneNumber = document.getElementById("SignUp_phoneNumber").value;
  let emailId = document.getElementById("SignUp_email").value;
  let pwd = document.getElementById("SignUp_password").value;
  let cpwd = document.getElementById("SignUp_cPassword").value;
  if (
    fName.toString() === "" ||
    lName.toString() === "" ||
    emailId.toString() === "" ||
    pwd.toString() === "" ||
    cpwd.toString() === ""
  ) {
    ShowMessagePopUp("Field(s) cannot be left blank");
    document.querySelector(".msgwrapper").style.border = "1px solid red";
    setTimeout(() => {
      document
        .querySelector(".messageboxWrapper")
        .classList.remove("showMsgbox");
    }, 2000);
    return;
  } else if (pwd.toString() == cpwd.toString()) {
    //   creating user obj
    let signUp_User = new signUpUser(fName, lName, phoneNumber, emailId, pwd);

    const json = JSON.stringify(signUp_User);

    postData(url, json)
      .then((userData) => {
        // User Data from DB
        let logInUser = JSON.stringify(userData);
        console.log("Data: " + logInUser);

        UpdateStorageSessions(UserSessionStorageKey, logInUser);

        document.querySelector(".msgwrapper").style.border = "1px solid green";
        ShowMessageAndRedirectAfterTimeout(
          2000,
          "Signed up Successfully",
          "index.html"
        );
      })
      .catch((err) => {
        ShowMessagePopUp(`Error occured. Kindly check console.`);
        console.log("Error occured while Sign Up: " + err);
      });

    // let userData = fetch(url, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "*",
    //     "Access-Control-Allow-Credentials": "true",
    //     "Access-Control-Allow-Methods": "POST",
    //     "Access-Control-Allow-Origin": "*",
    //   },
    //   body: json,
    //   method: "POST",
    // })
    //   .then((response) => {
    //     alert("Response: " + response.status);
    //     return response.json();
    //   })
    //   .catch((err) => {
    //     return err;
    //   });
  } else {
    document.querySelector(".errorContainr").classList.add("active");
  }
});

async function postData(url = "", data = {}) {
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
