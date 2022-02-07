function UserAction() {
  // console.log(e);
  // e.preventDefault();
  fname = document.getElementById("firstname").value;
  lname = document.getElementById("lastname").value;
  emailId = document.getElementById("email").value;
  paswd = document.getElementById("password").value;
  console.log(fname);
  const response = new XMLHttpRequest();

  const json = JSON.stringify({
    firstName: fname,
    lastName: lname,
    email: emailId,
    password: paswd,
  }); //
  const url = "http://localhost:8080/home/genie/user/signup";
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
    .then(alert("Success:"));
}
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

let bellIcon = document.getElementById("ShowNotificationPopUp");
bellIcon.addEventListener("click", () => {
  document
    .querySelector(".NotificationPopUpContainer")
    .classList.toggle("popUPActive");
  document.getElementById("showHideMenu").classList.remove("menu_active");
});
