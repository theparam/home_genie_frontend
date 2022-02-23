// Const variable area
const personalCategory = "Personal";
const IndoorCategory = "Indoor";
const OutdoorCategory = "Outdoor";
const PremiumCategory = "Premium";

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

// Homepage Coding

document.getElementById("PersonalCategory").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "Listing.html?Category=" + "Personal";
});

document.getElementById("IndoorCategory").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "Listing.html?Category=" + "Indoor";
});

document.getElementById("OutdoorServices").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "Listing.html?Category=" + "Outdoor";
});

document.getElementById("PremiumServices").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "Listing.html?Category=" + "Premium";
});

document
  .getElementById("SearchInputField")
  .addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();

      let searchText = document.getElementById("SearchInputField").value;
      let selectedCategory = document.getElementById("categories").value;

      let categoryValue = personalCategory;
      if (selectedCategory == "personal-care-services") {
        categoryValue = personalCategory;
      } else if (selectedCategory == "indoor-services") {
        categoryValue = IndoorCategory;
      } else if (selectedCategory == "outdoor-services") {
        categoryValue = OutdoorCategory;
      } else {
        categoryValue = PremiumCategory;
      }
      window.location.href =
        "Search.html?SearchKey=" + searchText + "&category=" + categoryValue;
    }
  });