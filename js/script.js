// Const variable area
const personalCategory = "Personal";
const IndoorCategory = "Indoor";
const OutdoorCategory = "Outdoor";
const PremiumCategory = "Premium";

let listingURL = "http://localhost:8080/home/genie/listing/";

let fetchBidOffers = "http://localhost:8080/home/genie/user/bid/";

let loggdInUser = "";
let bellIcon = document.getElementById("ShowNotificationPopUp");
let dk_bellIcom = document.getElementById("dk-ShowNotificationPopUp");

let loggedInUser = window.sessionStorage.getItem("LoggedInUser");
if (loggedInUser != null) {
  loggdInUser = JSON.parse(loggedInUser);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("user_Name").innerHTML = loggdInUser.fullName;
});

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
  let loggedInUser = window.sessionStorage.getItem("LoggedInUser");
  if (loggedInUser != null) {
    document
      .querySelector(".subProfileMenu")
      .classList.toggle("activeProfileMenu");
  }

  document
    .querySelector(".NotificationPopUpContainer")
    .classList.remove("popUPActive");
});

// #region Open the Category to another page.
document.getElementById("PersonalCategory").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "Listing.html?Category=" + personalCategory;
});

document.getElementById("IndoorCategory").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "Listing.html?Category=" + IndoorCategory;
});

document.getElementById("OutdoorServices").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "Listing.html?Category=" + OutdoorCategory;
});

document.getElementById("PremiumServices").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "Listing.html?Category=" + PremiumCategory;
});

// #endregion

document.querySelectorAll(".ViewListing").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    if (AuthenticateLogin()) {
      window.location.href = "Listing.html?view=getListings";
    } else {
      ShowMessageAndRedirect();
    }
  });
});

//#region Search input Query.
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
//#endregion

// Logout Btn Code
document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("LoggedInUser");
  window.location.href = "Login.html";
});

function AuthenticateLogin() {
  let isLoggedIn = true;
  let loggedInUser = window.sessionStorage.getItem("LoggedInUser");
  if (loggedInUser == null) {
    isLoggedIn = false;
  }
  return isLoggedIn;
}

function ShowMessageAndRedirect() {
  alert("Kindly login first.");
  window.location.href = "Login.html";
}

// //#region  get notification when page is opened.
// window.addEventListener("load", (e) => {
//   // Send the request to get the data for the notification for the logged in user.
//   // data will be received from the array itself.
//   let notification = JSON.parse(notiData);
//   for (let j = 0; j < notification.length; j++) {
//     let notificationData = notification[j];

//     let ListingID = notificationData.listingId;
//     let BiddingID = notificationData.biddingId;

//     // Get the bidding user info first

//     getBiddingOffers(BiddingID).then((bidData) => {
//       let listinURLWithID = listingURL + ListingID;
//       fetchListingData(listinURLWithID).then((listingData) => {
//         let notification = GenerateNotification(
//           notificationData,
//           listingData,
//           bidData
//         );

//         document.querySelector(".NotificationPopUp").innerHTML += notification;
//       });
//     });
//     // Get the listing as well.

//     console.log("Notification Data: " + notification[j].userId);
//   }
// });
// //#endregion

// let GenerateNotification = (notification, listing, bidData) => {
//   let notificationContainer = `<div class="Notification_id1">
//   <h3>${listing.title}</h3>
//   <p>${bidData.bidUserName} sent you an offer of ${bidData.biddingOffer}</p>
//   <div>
//   <button class="browseBtn" id="${listing.id}" onclick="viewNotifiedListing(this);">View Listing</button>
//   </div>
// </div>`;

//   return notificationContainer;
// };

// let viewNotifiedListing = (btnObject) => {
//   console.log("SpecificListing.html?ListingId=" + btnObject.id);
//   window.location.href = "SpecificListing.html?ListingId=" + btnObject.id;
// };

// async function getBiddingOffers(bidOfferId) {
//   let url = fetchBidOffers + bidOfferId;
//   return await fetchListingData(url)
//     .then((bidOffer) => {
//       return bidOffer;
//     })
//     .catch((err) => {
//       alert("Error: " + err);
//     });
// }

// async function fetchListingData(url = "") {
//   // Default options are marked with *
//   const response = await fetch(url, {
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "*",
//       "Access-Control-Allow-Credentials": "true",
//       "Access-Control-Allow-Methods": "GET",
//       "Access-Control-Allow-Origin": "*",
//     },
//     method: "GET",
//   }).catch((err) => {
//     return err;
//   });
//   return response.json(); // parses JSON response into native JavaScript objects
// }
