let bellIcon = document.getElementById("ShowNotificationPopUp");
let dk_bellIcom = document.getElementById("dk-ShowNotificationPopUp");
let updateBtn = document.getElementById("updBtn");
let url = "http://localhost:8080/home/genie/user/update/";
const UserSessionStorageKey = "LoggedInUser";

class User {
  constructor(firstName, lastName, phoneNumber, email, address, bio, paswd) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.Address = address;
    this.Bio = bio;
    this.password = paswd;
  }
}

document.addEventListener("keydown", (e) => {
  if (!e.repeat) {
    if (e.key === "Escape") {
      document.getElementById("showHideMenu").classList.remove("menu_active");
      document
        .querySelector(".NotificationPopUpContainer")
        .classList.remove("popUPActive");
      document
        .querySelector(".subProfileMenu")
        .classList.remove("activeProfileMenu");
    }
  }
});

document.getElementById("ShowMenu").addEventListener("click", () => {
  document.getElementById("showHideMenu").classList.toggle("menu_active");
  document
    .querySelector(".NotificationPopUpContainer")
    .classList.remove("popUPActive");
});

bellIcon.addEventListener("click", () => {
  toggleNotification();
});

dk_bellIcom.addEventListener("click", () => {
  toggleNotification();
  document
    .querySelector(".subProfileMenu")
    .classList.remove("activeProfileMenu");
});

const toggleNotification = () => {
  document
    .querySelector(".NotificationPopUpContainer")
    .classList.toggle("popUPActive");
  document.getElementById("showHideMenu").classList.remove("menu_active");
};

updateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let fName = document.getElementById("upd-fName").value;
  let lName = document.getElementById("upd-lName").value;
  let phnNumber = document.getElementById("upd-pNumber").value;
  let email = document.getElementById("upd-email").value;
  let address = document.getElementById("upd-Address").value;
  let bio = document.getElementById("upd-Bio").value;
  let password = document.getElementById("upd-password").value;

  let userObj = new User(
    fName,
    lName,
    phnNumber,
    email,
    address,
    bio,
    password
  );

  let json = JSON.stringify(userObj);
  let userId = "";
  let loggedInUser = window.sessionStorage.getItem("LoggedInUser");
  if (loggedInUser != null) {
    var loggdUserId = JSON.parse(loggedInUser).id;
    url = url + loggdUserId;
    postData(url, json)
      .then((userData) => {
        //User Data from DB
        let updatedUser = JSON.stringify(userData);

        console.log("Data: " + updatedUser);

        alert("User update Successful");
        UpdateStorageSessions(UserSessionStorageKey, updatedUser);
      })
      .catch((err) => {
        alert(err);
      });
  } else {
    alert("Error.. Not a logged in user");
  }
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
    method: "PUT",
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
