// Const variable area
const personalCategory = "Personal";
const IndoorCategory = "Indoor";
const OutdoorCategory = "Outdoor";
const PremiumCategory = "Premium";

let listingURL = "http://localhost:8080/home/genie/listing/";

let fetchBidOffers = "http://localhost:8080/home/genie/user/bid/";

let fetchNotificationUrl = "http://localhost:8080/home/genie/user/";

let notificationArray = [];
let loggdInUser = "";
let bellIcon = document.getElementById("ShowNotificationPopUp");
let dk_bellIcom = document.getElementById("dk-ShowNotificationPopUp");

let loggedInUser = window.sessionStorage.getItem("LoggedInUser");
if (loggedInUser != null) {
  loggdInUser = JSON.parse(loggedInUser);
}

// When index page is loaded.
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("mb_user_Name").innerHTML = document.getElementById(
    "dk_user_Name"
  ).innerHTML = loggdInUser.fullName;

  GetNotification("Owner");
  GetNotification("Customer");

  // Some code require async await
  // if (notificationArray.length > 3) {
  //   for (let a = 0; a < notificationArray.length; a++) {
  //     if (a > 2) {
  //       break;
  //     } else {
  //       document.querySelector(".NotificationPopUp").innerHTML +=
  //         notificationArray[a];
  //     }
  //   }
  // } else {
  //   for (let a = 0; a < notificationArray.length; a++) {
  //     document.querySelector(".NotificationPopUp").innerHTML +=
  //       notificationArray[a];
  //   }
  // }
});

function GetNotification(user) {
  let userId = loggdInUser.id;
  let iconFlag = false;
  let url = "";
  if (user === "Owner") {
    url = fetchNotificationUrl + "getOwnerNotifications/" + userId;
  } else {
    url = fetchNotificationUrl + "getCustomerNotifications/" + userId;
  }

  fetchNotificationForUser(url)
    .then((data) => {
      for (let n = 0; n < data.length; n++) {
        if (data[n].status == "unread") {
          iconFlag = true;
          console.log(iconFlag);
        }
        if (user == "Owner") {
          GenerateNoticationforUserAsOwner(data[n]);
        } else {
          GenerateNoticationforUserAsCustomer(data[n]);
        }
      }

      if (iconFlag) {
        document.getElementById("dk_NotificationGenie").src =
          document.getElementById("mb_NotificationGenie").src =
            "../img/New_Notification_Genie.png";
      }
    })
    .catch((err) => {
      console.log("error: " + err);
    });
}

// Generate notification contaiers for the Owner
function GenerateNoticationforUserAsOwner(notificationData) {
  let urlListing = listingURL + notificationData.listingId;

  console.log("Owner url " + urlListing);
  getData(urlListing)
    .then((listingRes) => {
      getBidOfferDataForUser(notificationData.bidOfferId)
        .then((bidRes) => {
          let ownerNotification = getOwnerNotificationContainer(
            notificationData,
            listingRes,
            bidRes
          );

          // notificationArray.push(ownerNotification);
          document.querySelector(".NotificationPopUp").innerHTML +=
            ownerNotification;
        })
        .catch((err) => {
          console.log("Error: " + err);
        });
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
}

// Generate notification contaiers for the Owner
function GenerateNoticationforUserAsCustomer(notificationData) {
  let urlListing = listingURL + notificationData.listingId;

  console.log("url customer " + urlListing);
  getData(urlListing)
    .then((listingRes) => {
      console.log("listingRes: " + listingRes.ownerUserId);
      getData(fetchNotificationUrl + listingRes.ownerUserId)
        .then((owner) => {
          console.log("Owner: " + owner);
          let customerNotification = getCustomerNotificationContainer(
            notificationData,
            listingRes,
            owner
          );
          // notificationArray.push(customerNotification);
          document.querySelector(".NotificationPopUp").innerHTML +=
            customerNotification;
        })
        .catch((err) => {
          console.log("Error: " + err);
        });
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
}

function getOwnerNotificationContainer(
  notificationData,
  listing,
  biddingOffer
) {
  let container = ` <div class="ownerNotification">
     <h3 class="listingTitle">${listing.title}</h1>
       <p>You have received a new offer by <span id="custonerName">${
         biddingOffer.bidUserName
       }</span></p>
       <div class="viewbtnWrapper">
         <a class="viewlisting" id="${
           listing.id + "_" + notificationData.id
         }">View Listing</a>
       </div>
   </div>`;
  return container;
}
function getCustomerNotificationContainer(notificationData, listing, owner) {
  let container = `<div class="customerNotification">
  <h3 class="listingTitle">${listing.title}</h1>
    <p>Horray!! <span id="ownerName">${
      owner.firstName
    }</span> accepted your offer</p>
    <div class="viewbtnWrapper">
    <a class="viewlisting" id="${
      listing.id + "_" + notificationData.id
    }">View Listing</a>
    </div>
</div>`;
  return container;
}

// Close the notification on cross click
document.getElementById("CrossIcon").addEventListener("click", () => {
  document
    .querySelector(".NotificationPopUpContainer")
    .classList.remove("popUPActive");
});

// Clase all open divs on escape button
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

// This method is used to get the notification for the User
async function fetchNotificationForUser(url) {
  return await fetchNotificationData(url)
    .then((notification) => {
      return notification;
    })
    .catch((err) => {
      alert("Error: " + err);
    });
}

async function fetchNotificationData(url = "") {
  // Default options are marked with *
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Origin": "*",
    },
    method: "GET",
  }).catch((err) => {
    return err;
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

// get bid ofer by id

async function getBidOfferDataForUser(bidOfferId) {
  let url = fetchBidOffers + bidOfferId;
  return await getData(url)
    .then((bidOffer) => {
      return bidOffer;
    })
    .catch((err) => {
      alert("Error: " + err);
    });
}

async function getData(url = "") {
  // Default options are marked with *
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Origin": "*",
    },
    method: "GET",
  }).catch((err) => {
    return err;
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
