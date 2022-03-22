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

//hides the message box

let msgboxWrapper = document.querySelector(".messageboxWrapper");

if (msgboxWrapper != null) {
  msgboxWrapper.classList.remove("showMsgbox");
}

// When index page is loaded.
document.addEventListener("DOMContentLoaded", () => {
  let lg_userName = document.querySelectorAll(".loggedUserName");
  if (lg_userName != null) {
    lg_userName.forEach((element) => {
      element.innerHTML =
        loggdInUser.firstName != null || undefined
          ? loggdInUser.firstName
          : "Guest";
    });
  }

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

  getData(urlListing)
    .then((listingRes) => {
      console.log("listingRes: " + listingRes.ownerUserId);
      getData(fetchNotificationUrl + listingRes.ownerUserId)
        .then((owner) => {
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
         <a class="viewlisting" onclick="UpdateOwnerNotifationViewListing(this)" id="${
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
    <a class="viewlisting" onclick="UpdateCustomerNotifationViewListing(this)" id="${
      listing.id + "_" + notificationData.id
    }">View Listing</a>
    </div>
</div>`;
  return container;
}

async function UpdateOwnerNotifationViewListing(btn) {
  let idArr = btn.id.split("_");
  let listingID = idArr[0];
  let notificationID = idArr[1];

  // Update the Noftification First wait for response and open the new listing
  let updateOwnerURL =
    fetchNotificationUrl + `owner-notification/${notificationID}?status="read"`;

  await UpdateNotificationTable(updateOwnerURL);
  // AuthenticateAndRedirect(listingID);
}

async function UpdateCustomerNotifationViewListing(btn) {
  let idArr = btn.id.split("_");
  let listingID = idArr[0];
  let notificationID = idArr[1];

  // Update the Noftification First wait for response and open the new listing
  let updateOwnerURL =
    fetchNotificationUrl +
    `customer-notification/${notificationID}?status="read"`;

  await UpdateNotificationTable(updateOwnerURL);
  // AuthenticateAndRedirect(listingID);
}

async function UpdateNotificationTable(url) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Origin": "*",
    },
    method: "POST",
  });
  return response.json();
}

function AuthenticateAndRedirect(listingID) {
  if (!AuthenticateLogin()) {
    document.querySelector(".msgwrapper").style.border = "1px solid red";
    ShowMessageAndRedirect();
  } else {
    window.location.href = "SpecificListing.html?ListingId=" + listingID;
  }
}

// Close the notification on cross click
let crossIconElement = document.getElementById("CrossIcon");

if (crossIconElement != null) {
  crossIconElement.addEventListener("click", () => {
    document
      .querySelector(".NotificationPopUpContainer")
      .classList.remove("popUPActive");
  });
}

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

let ShowMenubtn = document.getElementById("ShowMenu");

if (ShowMenubtn != null) {
  document.getElementById("ShowMenu").addEventListener("click", () => {
    document.getElementById("showHideMenu").classList.toggle("menu_active");
    document
      .querySelector(".NotificationPopUpContainer")
      .classList.remove("popUPActive");
  });
}

if (bellIcon != null) {
  bellIcon.addEventListener("click", () => {
    toggleNotification();
  });
}

if (dk_bellIcom != null) {
  dk_bellIcom.addEventListener("click", () => {
    toggleNotification();
    document
      .querySelector(".subProfileMenu")
      .classList.remove("activeProfileMenu");
  });
}
const toggleNotification = () => {
  document
    .querySelector(".NotificationPopUpContainer")
    .classList.toggle("popUPActive");
  document.getElementById("showHideMenu").classList.remove("menu_active");
};

let profileBtn = document.querySelector(".ProfileIcon");
if (profileBtn != null) {
  profileBtn.addEventListener("click", (e) => {
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
}
// #region Open the Category to another page.

let personalCategoryElement = document.getElementById("PersonalCategory");
let indoorCategoryElement = document.getElementById("IndoorCategory");
let outdoorServicesElement = document.getElementById("OutdoorServices");
let premiumServicesElement = document.getElementById("PremiumServices");

if (personalCategoryElement != null) {
  personalCategoryElement.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "Listing.html?Category=" + personalCategory;
  });
}
if (indoorCategoryElement != null) {
  indoorCategoryElement.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "Listing.html?Category=" + IndoorCategory;
  });
}
if (outdoorServicesElement != null) {
  outdoorServicesElement.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "Listing.html?Category=" + OutdoorCategory;
  });
}
if (premiumServicesElement != null) {
  premiumServicesElement.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "Listing.html?Category=" + PremiumCategory;
  });
}

// #endregion

document.querySelectorAll(".ViewListing").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    if (AuthenticateLogin()) {
      window.location.href = "Listing.html?view=getListings";
    } else {
      document.querySelector(".msgwrapper").style.border = "1px solid red";
      ShowMessageAndRedirect();
    }
  });
});

//#region Search input Query.
let searchElement = document.getElementById("SearchInputField");
if (searchElement != null) {
  searchElement.addEventListener("keyup", (event) => {
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
}
//#endregion

// Logout Btn Code

let logoutElement = document.querySelectorAll(".logoutBtn");
if (logoutElement != null) {
  logoutElement.forEach((element) => {
    element.addEventListener("click", () => {
      sessionStorage.removeItem("LoggedInUser");
      window.location.href = "Login.html";
    });
  });
}

function AuthenticateLogin() {
  let isLoggedIn = true;
  let loggedInUser = window.sessionStorage.getItem("LoggedInUser");
  if (loggedInUser == null) {
    isLoggedIn = false;
  }
  return isLoggedIn;
}

function ShowMessageAndRedirect() {
  document.querySelector(".msgwrapper").style.border = "1px solid red";
  ShowMessagePopUp("Not Authorized. Kindly login first");

  document.getElementById("CloseMsgBox").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "Login.html";
  });
}

// This method is used to get the notification for the User
async function fetchNotificationForUser(url) {
  return await fetchNotificationData(url)
    .then((notification) => {
      return notification;
    })
    .catch((err) => {
      console.log("Error: " + err);
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
      console.log("Error: " + err);
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
