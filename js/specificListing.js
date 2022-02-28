// URL to get the specific listing;
let url = "http://localhost:8080/home/genie/listing/";



let Search_Listing_Container = document.querySelector(
  ".Search_Listing_Container"
);
// Getting LoggedInUser
let loggdUserId = "";
let loggedInUser = window.sessionStorage.getItem("LoggedInUser");
if (loggedInUser != null) {
  loggdUserId = JSON.parse(loggedInUser).id;
}
// Object which will contain all information on the listing
let listingInfo;

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
  postData(url)
    .then((listing) => {
      listingInfo = listing;
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
      document.getElementById("Listing_Image").src = btoa(
        `${listing.image.data}`
      );

      //Generate Offers if Owner
      if (loggdUserId !== "" && listing.ownerUserId === loggdUserId) {
        document.querySelector(".specific-bids").style.display = "grid";
        document.querySelector(".placeBidContainer").style.display = "none";
        document.querySelector(".specific-bids").innerHTML =
          getBiddingOfferForOwner();
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

async function postData(url = "") {
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

let getBiddingOfferForOwner = () => {
  return ` <div class="specific-bid1">
  <div class="specific-bid-grid">
      <img src="https://picsum.photos/300/200?random=11" alt="">
      <div class="specific-bid-info">
          <p><strong>Bidded Price: </strong><span class="specific-red">$ 35.00</span></p>
          <p><strong>Name: </strong>Nikkie Watson</p>
          <p><strong>Email: </strong>nikki@gmail.com</p>
          <p><strong>Phone Number: </strong>+1 111-111-1111</p>
      </div>
      <p><strong>Description: </strong>6 years eperience as a Professional Hairstylist. Working
          Currently at Poco Beauty Salon.</p>
  </div>
  <div class="specific-button-grid">
      <button type="button">Accept</button>
      <button type="button">Decline</button>
  </div>
</div>
<div class="specific-bid2">
  <div class="specific-bid-grid">
      <img src="https://picsum.photos/300/200?random=11" alt="">
      <div class="specific-bid-info">
          <p><strong>Bidded Price: </strong><span class="specific-red">$ 38.00</span></p>
          <p><strong>Name: </strong>Anna Johnson</p>
          <p><strong>Email: </strong>anna@gmail.com</p>
          <p><strong>Phone Number: </strong>+1 111-111-1111</p>
      </div>
      <p><strong>Description: </strong>7 years eperience as a Professional Hairstylist. Working
          Currently as Hair Stylist for Dream Editorials.</p>
  </div>
  <div class="specific-button-grid">
      <button type="button">Accept</button>
      <button type="button">Decline</button>
  </div>
</div>
<div class="specific-bid3">
  <div class="specific-bid-grid">
      <img src="https://picsum.photos/300/200?random=11" alt="">
      <div class="specific-bid-info">
          <p><strong>Bidded Price: </strong><span class="specific-red">$ 40.00</span></p>
          <p><strong>Name: </strong>Troy Smith</p>
          <p><strong>Email: </strong>troy@gmail.com</p>
          <p><strong>Phone Number: </strong>+1 111-111-1111</p>
      </div>
      <p><strong>Description: </strong>10 years eperience as a Professional Hairstylist. Working
          Currently as Hair Stylist professional photographers.</p>
  </div>
  <div class="specific-button-grid">
      <button type="button">Accept</button>
      <button type="button">Decline</button>
  </div>
</div>
<div class="specific-bid3">
  <div class="specific-bid-grid">
      <img src="https://picsum.photos/300/200?random=11" alt="">
      <div class="specific-bid-info">
          <p><strong>Bidded Price: </strong><span class="specific-red">$ 40.00</span></p>
          <p><strong>Name: </strong>Troy Smith</p>
          <p><strong>Email: </strong>troy@gmail.com</p>
          <p><strong>Phone Number: </strong>+1 111-111-1111</p>
      </div>
      <p><strong>Description: </strong>10 years eperience as a Professional Hairstylist. Working
          Currently as Hair Stylist professional photographers.</p>
  </div>
  <div class="specific-button-grid">
      <button type="button">Accept</button>
      <button type="button">Decline</button>
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
  let userOffer = parseInt(
    document.getElementById("bidOffer").value.replace("$", "")
  );
  let listingID = listingInfo.id;
  alert(listingID);
};
