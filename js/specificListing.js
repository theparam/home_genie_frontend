// URL to get the specific listing;
let url = "http://localhost:8080/home/genie/listing/";
let bidOfferUrl = "http://localhost:8080/home/genie/user/bid/create";

let fetchBidOfferUrl = "http://localhost:8080/home/genie/user/bid/";

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
        document.querySelector(".specific-bids").style.display = "grid";
        document.querySelector(".placeBidContainer").style.display = "none";
        for (let u = 0; u < listing.biddingOffers.length; u++) {
          let biddingOffer = listing.biddingOffers[u];
          getBidOfferData(biddingOffer).then((data) => {
            document.querySelector(".specific-bids").innerHTML +=
              getBiddingOfferForOwner(data);
          });
        }
      } else {
        document.querySelector(".placeBidContainer").style.display = "flex";
        document.querySelector(".specific-bids").style.display = "none";
        document.querySelector(".placeBidContainer").innerHTML =
          placeBidContainer(listing);
      }
    })
    .catch((err) => {
      alert(err);
    });
});

async function getBidOfferData(bidOfferId) {
  let url = fetchBidOfferUrl + bidOfferId;
  return await fetchData(url)
    .then((bidOffer) => {
      console.log("Bid Offer: " + JSON.stringify(bidOffer));
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
       <button type="button">Decline</button>
       <button type="button">Accept</button>
   </div>
 </div>`;
};

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
