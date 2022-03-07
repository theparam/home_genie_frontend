// URL to get the specific listing;
let url = "http://localhost:8080/home/genie/listing/";

let bidOfferUrl = "http://localhost:8080/home/genie/user/bid/create";

let fetchBidOfferUrl = "http://localhost:8080/home/genie/user/bid/";

let acceptBidUrl = "http://localhost:8080/home/genie/user/bid/offer-update";

let declineBidUrl = "http://localhost:8080/home/genie/user/bid/offer-decline";

let getUserUrl = "http://localhost:8080/home/genie/user/";

let Search_Listing_Container = document.querySelector(
  ".Search_Listing_Container"
);
// Getting LoggedInUser
let loggdUserId = "";
let logInUser = window.sessionStorage.getItem("LoggedInUser");
if (logInUser != null) {
  loggdUserId = JSON.parse(logInUser).id;
}
// Object which will contain all information on the listing
let listingInfo;

class BiddingOffer {
  constructor(
    listingId,
    bidderUserId,
    biddingOffer,
    isofferAccepted,
    username,
    userEmail,
    userPhone,
    userBio
  ) {
    this.listingId = listingId;
    this.bidderUserId = bidderUserId;
    this.biddingOffer = biddingOffer;
    this.isOfferAccepted = isofferAccepted;
    this.bidUserName = username;
    this.bidUserEmail = userEmail;
    this.bidUserPhone = userPhone;
    this.bidUserBio = userBio;
  }
}

document.querySelectorAll(".ViewListing").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "Listing.html?view=getListings";
  });
});
window.addEventListener("load", (e) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  let listingId = "";
  var ListingId = "ListingId";
  var _listingIdStatus = window.location.href.indexOf("?" + ListingId + "=");
  if (_listingIdStatus != -1) {
    listingId = params.ListingId;
  }
  url = url + listingId;
  fetchData(url)
    .then((listing) => {
      listingInfo = listing;
      // console.log("Listing: " + JSON.stringify(listing));
      document.getElementById("Listing_Title").innerHTML = listing.title;
      document.getElementById(
        "Listing_Price"
      ).innerHTML = ` <strong>Price:</strong>${listing.price}`;
      document.getElementById(
        "Listing_Owner"
      ).innerHTML = `<strong>Name: </strong>${listing.listingOwner}`;
      document.getElementById(
        "Listing_OwnerEmail"
      ).innerHTML = `<strong>Email: </strong>${listing.email}`;
      document.getElementById(
        "Listing_OwnerNumber"
      ).innerHTML = `<strong>Contact Number: </strong>${listing.contactNumber}`;

      document.getElementById(
        "Listing_OwnerCondition"
      ).innerHTML = `<strong>Conditions (If Applicable): </strong>${listing.condition}`;

      document.getElementById("Listing_OwnerDescription").innerHTML =
        listing.description;
      document.getElementById(
        "Listing_Image"
      ).src = `data:image/jpeg;base64,${listing.image.data}`;

      //Generate Offers if Owner
      if (loggdUserId !== "" && listing.ownerUserId === loggdUserId) {
        document.querySelector(".specific-bids").style.display = "none";

        document.querySelector(".placeBidContainer").style.display = "none";
        if (document.querySelector(".CustomerBidAcceptContainer") !== null) {
          document.querySelector(".CustomerBidAcceptContainer").style.display =
            "none";
        }
        // document.querySelector(".CustomerBidAcceptContainer").style.display =
        ("none");
        if (listing.isOfferAccepted) {
          document.querySelector(
            ".AceeptedOfferDetailContainer"
          ).style.display = "grid";

          // **************
          // Here if bid is accepted then we are showing the Info that bid is accepted contact the person.
          // **************

          GetAcceptedBidOfferContainer(listing.acceptedBiddingOffer);
        } else {
          // **************
          // Here we are showing the offers on the particular bidding.
          // **************

          document.querySelector(".specific-bids").style.display = "grid";

          for (let u = 0; u < listing.biddingOffers.length; u++) {
            let biddingOffer = listing.biddingOffers[u];
            getBidOfferData(biddingOffer).then((data) => {
              document.querySelector(".specific-bids").innerHTML +=
                getBiddingOfferForOwner(data);
            });
          }
        }
      } else {
        document.querySelector(".specific-bids").style.display = "none";
        document.querySelector(".placeBidContainer").style.display = "none";
        document.querySelector(".CustomerBidAcceptContainer").style.display =
          "none";

        if (listing.isOfferAccepted) {
          // **************
          // This is customer Side
          // **************

          getBidOfferData(listing.acceptedBiddingOffer).then((data) => {
            if (data.bidderUserId == loggdUserId) {
              // **************
              // If logged User offer got accepted
              // **************

              document.querySelector(
                ".CustomerBidAcceptContainer"
              ).style.display = "grid";
              CustomerBidAcceptedOfferInfoGenerator(listing.ownerUserId);
            } else {
              // **************
              // If logged User's is not one who's offer got accepted.
              // **************
              document.querySelector(
                ".CustomerBidAcceptContainer"
              ).style.display = "grid";

              document.querySelector(".CustomerBidAcceptContainer").innerHTML +=
                `<p id="OfferAcceptedText">Hmm!!!... Looks Like Owner accepted someone else bid. Best of luck on another Bid.</p>`;
            }
          });
        } else {
          // **************
          // If Listing is open still for bidding then place the bid.
          // **************

          document.querySelector(".placeBidContainer").style.display = "flex";
          document.querySelector(".placeBidContainer").innerHTML =
            placeBidContainer(listing);
        }
      }
    })
    .catch((err) => {
      alert(err);
    });
});

let GetAcceptedBidOfferContainer = (biddingOfferId) => {
  getBidOfferData(biddingOfferId)
    .then((data) => {
      document.querySelector(
        ".AceeptedOfferDetailContainer"
      ).innerHTML += `<div class="CongratulationTextContainer">
               <p>Congratulation on accepting the bidding.</p>
               <p>Home Genie advises you to contact the person with the following details</p>
           </div>
           <div class="userInfoContainer">
              <div class="UserLabel_P_Wrapper">
                <label for="AcceptedOfferUserName">Name: </label>
                <p id="AcceptedOfferUserName">${data.bidUserName}</p>
              </div>
              <div class="UserLabel_P_Wrapper">
                <label for="AcceptedOfferPhone">Phone: </label>
                <p id="AcceptedOfferPhone">${data.bidUserPhone}</p>
              </div>
              <div class="UserLabel_P_Wrapper">
                <label for="AcceptedOfferUserEmail">Email: </label>
                <p id="AcceptedOfferUserEmail">${data.bidUserEmail}</p>
              </div>
           </div>`;
    })
    .catch((err) => {
      alert("Error: " + err);
    });
};

function CustomerBidAcceptedOfferInfoGenerator(listingOwnerId) {
  getUserUrl = getUserUrl + listingOwnerId;

  fetchUser(getUserUrl)
    .then((user) => {
      console.log("User Detail: " + user);
      document.querySelector(
        ".CustomerBidAcceptContainer"
      ).innerHTML += `<div class="CongratulationTextContainer">
                  <p>Congratulation your offer is accepted by the owner</p>
                  <p>Home Genie advises you to contact the Owner with the following details</p>
              </div>
              <div class="userInfoContainer">
                  <div class="UserLabel_P_Wrapper">
                      <label for="AcceptedOfferUserName">Name: </label>
                      <p id="AcceptedOfferUserName">${user.firstName}</p>
                  </div>
                  <div class="UserLabel_P_Wrapper">
                      <label for="AcceptedOfferPhone">Phone: </label>
                      <p id="AcceptedOfferPhone">${user.phoneNumber}</p>
                  </div>
                  <div class="UserLabel_P_Wrapper">
                      <label for="AcceptedOfferUserEmail">Email: </label>
                      <p id="AcceptedOfferUserEmail">${user.email}</p>
                  </div>
              </div>`;
    })
    .catch((err) => {
      alert("Unable to get user: " + err);
    });
}

async function getBidOfferData(bidOfferId) {
  let url = fetchBidOfferUrl + bidOfferId;
  return await fetchData(url)
    .then((bidOffer) => {
      return bidOffer;
    })
    .catch((err) => {
      alert("Error: " + err);
    });
}

let getBiddingOfferForOwner = (bidOffer) => {
  return `<div class="specific-bid3">
   <div class="specific-bid-grid">
       <img src="https://picsum.photos/300/200?random=11" alt="">
       <div class="specific-bid-info">
           <p><strong>Bidded Price: </strong><span class="specific-red">$${bidOffer.biddingOffer}</span></p>
           <p><strong>Name: </strong>${bidOffer.bidUserName}</p>
           <p><strong>Email: </strong>${bidOffer.bidUserEmail}</p>
           <p><strong>Phone Number: </strong>${bidOffer.bidUserPhone}</p>
       </div>
       <p><strong>Description: </strong>${bidOffer.bidUserBio}</p>
   </div>
   <div class="specific-button-grid">
       <button type="button" id=${bidOffer.id} onclick="DeclineOfferFn(this)">Decline</button>
       <button type="button" id=${bidOffer.id} onclick="AcceptOfferFn(this)">Accept</button>
   </div>
 </div>`;
};

function AcceptOfferFn(acceptBtn) {
  getBidOfferData(acceptBtn.id).then((bidOffer) => {
    postBidData(acceptBidUrl, JSON.stringify(bidOffer))
      .then((response) => {
        let res = JSON.stringify(response);
        console.log("res Data: " + res);
        alert("Congratulation on accepting the offer.");
        location.reload();
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  });
}

function DeclineOfferFn(declineBtn) {
  getBidOfferData(declineBtn.id).then((bidOffer) => {
    postBidData(declineBidUrl, JSON.stringify(bidOffer))
      .then((response) => {
        alert("Offer Deleted");
        location.reload();
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  });
}

let placeBidContainer = (listing) => {
  return `<div class="bidLabelInputContainer">
  <label for="bidOffer">Price :</label>
  <div class="IconContainer id="plusAmount" onclick="IncreaseAmount(this)">
      <i class="fa fa-plus" aria-hidden="true"></i>
  </div>
  <input type="text" value=${listing.price} id="bidOffer" class="bidAmountField" placeholder="$xx.xx">
  <div class="IconContainer id="minusAmount" onclick="DecreaseAmount(this)">
      <i class="fa fa-minus" aria-hidden="true"></i>
  </div>
</div>
<button class="placeBidBtnSubmit" id="bitSubmitBtn" onclick="PlaceBidFn()">Place bid</button>`;
};

let IncreaseAmount = (btnObj) => {
  let price = parseInt(
    document.getElementById("bidOffer").value.replace("$", "")
  );
  price = price + 1;
  document.getElementById("bidOffer").value = "$" + price;
};

let DecreaseAmount = (btnObj) => {
  let price = parseInt(
    document.getElementById("bidOffer").value.replace("$", "")
  );

  if (price == 0) {
    alert("Price cannot be less than 0");
  } else {
    price = price - 1;
    document.getElementById("bidOffer").value = "$" + price;
  }
};

let PlaceBidFn = () => {
  let biddingOffer = parseInt(
    document.getElementById("bidOffer").value.replace("$", "")
  );
  let listingID = listingInfo.id;
  alert(listingID);
  let parsedUser = JSON.parse(logInUser);
  let biddingOfferObj = new BiddingOffer(
    listingID,
    loggdUserId,
    biddingOffer,
    "false",
    parsedUser.fullName,
    parsedUser.email,
    parsedUser.phoneNumber,
    parsedUser.bio
  );

  let bidOfferJSON = JSON.stringify(biddingOfferObj);
  console.log("JSON: " + bidOfferJSON);
  postBidData(bidOfferUrl, bidOfferJSON)
    .then((bidData) => {
      // User Data from DB
      let bidOffer = JSON.stringify(bidData);
      console.log("Data: " + bidOffer);

      // alert("Ofer Sent");
      // // window.location.href = "/html_Files/index.html";
      // //UpdateStorageSessions(UserSessionStorageKey, logInUser);
      // //   Navigate to specific listing page.
      // //window.location.href = "/html_Files/index.html";
    })
    .catch((err) => {
      alert(err);
    });
};

async function postBidData(url = "", data) {
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
  return response.json();
}

async function fetchData(url = "") {
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

// fetch the user
async function fetchUser(url = "") {
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
