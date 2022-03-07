let submitBtn = document.getElementById("create-btn");

const url = "http://localhost:8080/home/genie/listing/create";

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

document.querySelector(".ViewListing").addEventListener("click", (e) => {
  e.preventDefault();

  window.location.href = "Listing.html?view=getListings";
});

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
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
    alert("Field(s) marked * cannot be left blank");
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

      alert("Listing Created", userData);
      window.location.href = "/html_Files/index.html";
      //UpdateStorageSessions(UserSessionStorageKey, logInUser);
      //   Navigate to specific listing page.
      //window.location.href = "/html_Files/index.html";
    })
    .catch((err) => {
      alert(err);
    });
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
