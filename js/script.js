let loginBtn = document.getElementById("LoginBtn");
let bellIcon = document.getElementById("ShowNotificationPopUp");

document.addEventListener("keydown", (e) => {
  if (!e.repeat) {
    if (e.key === "Escape") {
      document.getElementById("showHideMenu").classList.remove("menu_active");
      document
        .querySelector(".NotificationPopUpContainer")
        .classList.remove("popUPActive");
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
  document
    .querySelector(".NotificationPopUpContainer")
    .classList.toggle("popUPActive");
  document.getElementById("showHideMenu").classList.remove("menu_active");
});

loginBtn.addEventListener("click", () => {
  // e.preventDefault();
  let emailId = document.getElementById("email").value;
  let paswd = document.getElementById("password").value;

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
