let submitBtn = document.getElementById("create-btn");
let long;
let lat;

const url = "http://localhost:8080/home/genie/listing/create";
let locationURL = "https://nominatim.openstreetmap.org/reverse?format=json";
class Listing {
  constructor(
    title,
    description,
    category,
    condition,
    price,
    paymentOption,
    listingOwner,
    ContactNumber,
    Email,
    Address,
    City,
    Province,
    PostalCode,
    ownerUserId
  ) {
    this.title = title;
    this.description = description;
    this.category = category;
    this.condition = condition;
    this.price = price;
    this.paymentOption = paymentOption;
    this.listingOwner = listingOwner;
    this.contactNumber = ContactNumber;
    this.email = Email;
    this.address = Address;
    this.city = City;
    this.province = Province;
    this.postalCode = PostalCode;
    this.ownerUserId = ownerUserId;
  }
}

class StopWatch {
  constructor() {}
  async start() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // success callback
          long = position.coords.longitude;
          lat = position.coords.latitude;
        },
        (error) => {
          // failure callback
          console.log(error);
          if (error.code == error.PERMISSION_DENIED) {
            window.alert("geolocation permission denied");
          }
        }
      );
    } else {
      // no geolocation in navigator. in the case of old browsers
      console.log("Geolocation is not supported by this browser.");
    }

    var id, target, options;
    function success(pos) {
      var crd = pos.coords;

      if (
        target.latitude === crd.latitude &&
        target.longitude === crd.longitude
      ) {
        console.log("Congratulations, you reached the target");
        navigator.geolocation.clearWatch(id);
      }
    }

    function error(err) {
      console.warn("ERROR(" + err.code + "): " + err.message);
    }

    target = {
      latitude: 0,
      longitude: 0,
    };

    options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };

    id = navigator.geolocation.watchPosition(success, error, options);
    console.log(id + " ID");
    console.log(JSON.stringify(target) + " TARGET");
    console.log(JSON.stringify(options) + " OPTIONS");
  }
  stop() {}
  rest() {}
}

document.querySelector(".ViewListing").addEventListener("click", (e) => {
  e.preventDefault();

  window.location.href = "Listing.html?view=getListings";
});

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!AuthenticateLogin()) {
    document.querySelector(".msgwrapper").style.border = "2px solid red";
    ShowMessageAndRedirect();
  } else {
    let loggedInUser = window.sessionStorage.getItem("LoggedInUser");
    if (loggedInUser != null) {
      var loggdUserId = JSON.parse(loggedInUser).id;
    }

    let listingTitle = document.getElementById("listing-title").value;
    let selectedCatOption = document.getElementById("category").value;
    let category = "";
    if (selectedCatOption == "a") {
      category = personalCategory;
    } else if (selectedCatOption == "b") {
      category = IndoorCategory;
    } else if (selectedCatOption == "c") {
      category = OutdoorCategory;
    } else if (selectedCatOption == "d") {
      category = PremiumCategory;
    } else {
      category = personalCategory;
    }
    let description = document.getElementById("description").value;
    let condition = document.getElementById("conditions").value;
    let myFile = document.getElementById("myFile");
    let fixed_price = document.getElementById("fixed-price").value;
    let PaymentOption = "";
    let cashOption = document.getElementById("cash");
    let transferOption = document.getElementById("transfer");
    let chequeOption = document.getElementById("cheque");

    if (cashOption.checked) {
      PaymentOption = "Cash,";
    }
    if (transferOption.checked) {
      PaymentOption += "Bank Transfer,";
    }
    if (chequeOption.checked) {
      PaymentOption += "Cheque";
    }

    let PersonName = document.getElementById("name").value;
    let PersonContact = document.getElementById("contact").value;
    let email = document.getElementById("email").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let province = document.getElementById("province").value;
    let code = document.getElementById("code").value;
    console.log(myFile);

    if (
      (title =
        "" ||
        category == "" ||
        fixed_price == "" ||
        PaymentOption == "" ||
        PersonName == "" ||
        PersonContact == "" ||
        email == "" ||
        city == "" ||
        province == "" ||
        code == "")
    ) {
      document.querySelector(".msgwrapper").style.border = "2px solid red";
      ShowMessagePopUp("Field(s) marked * cannot be left blank");
      setTimeout(() => {
        document
          .querySelector(".messageboxWrapper")
          .classList.remove("showMsgbox");
      }, 2000);
      return;
    }

    let listingObj = new Listing(
      listingTitle,
      description,
      category,
      condition,
      fixed_price,
      PaymentOption,
      PersonName,
      PersonContact,
      email,
      address,
      city,
      province,
      code,
      loggdUserId
    );
    // console.log("listingObj       ",listingObj);
    // console.log("myFile       ",myFile);
    const formData = new FormData();
    // console.log(myFile.files[0]);
    formData.append("file", myFile.files[0]);
    const json = JSON.stringify(listingObj);
    formData.append("homeGenieListings", json.toString());

    console.log("json        ", json);
    postData(url, formData)
      .then((userData) => {
        // User Data from DB
        let logInUser = JSON.stringify(userData);
        console.log("Data: " + logInUser);

        document.querySelector(".msgwrapper").style.border =
          "2px solid #006c84";
        ShowMessageAndRedirectAfterTimeout(
          2000,
          "Congratulation!! Listing created.",
          "index.html"
        );
        //UpdateStorageSessions(UserSessionStorageKey, logInUser);
        //   Navigate to specific listing page.
        //window.location.href = "/html_Files/index.html";
      })
      .catch((err) => {
        document.querySelector(".msgwrapper").style.border = "2px solid red";
        ShowMessagePopUp(`Error occured. Kindly check console.`);
        console.log("Error occured while creating listing: " + err);
      });
  }
});

let fillAddress = (fetchedAddress) => {
  console.log(
    "fetch house ",
    fetchedAddress.address.house_number + "," + fetchedAddress.address.road
  );

  document.getElementById("address").value =
    fetchedAddress.address.house_number + "," + fetchedAddress.address.road;

  document.getElementById("city").value = fetchedAddress.address.city;
  document.getElementById("province").value = fetchedAddress.address.state;
  document.getElementById("code").value = fetchedAddress.address.postcode;

  document.getElementById(
    "liveMap"
  ).src = `https://www.openstreetmap.org/export/embed.html?bbox=${long}%2C${lat}%2C${long}%2C${lat}&amp;layer=mapnik`;
};

let locatnWatch = new StopWatch();
locationbtn.addEventListener("click", async (e) => {
  await locatnWatch.start();

  setTimeout(() => {
    GetLocation()
      .then((locData) => {
        fillAddress(locData);
      })
      .catch((err) => {
        alert(err);
      });
  }, 1000);
});

document.getElementById("myFile").addEventListener("change", (e) => {
  let imgElement = document.getElementById("UploadedImage");
  console.log(imgElement);
  imgElement.src = URL.createObjectURL(
    document.getElementById("myFile").files[0]
  );
});

async function postData(url = "", data) {
  // Default options are marked with *
  const response = await fetch(url, {
    headers: {
      Accept: "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Origin": "*",
    },
    body: data,
    method: "POST",
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function GetLocation() {
  locationURL =
    locationURL + `&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`;
  // Default options are marked with *
  const response = await fetch(locationURL, {
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
  return response.json();
}
