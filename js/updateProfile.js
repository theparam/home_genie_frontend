let bellIcon = document.getElementById("ShowNotificationPopUp");
let dk_bellIcom = document.getElementById("dk-ShowNotificationPopUp");

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

document.querySelector(".ProfileIcon").addEventListener("click", (e) => {
  e.preventDefault();
  document
    .querySelector(".subProfileMenu")
    .classList.toggle("activeProfileMenu");
  document
    .querySelector(".NotificationPopUpContainer")
    .classList.remove("popUPActive");
});
