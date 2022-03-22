let getCategoryURL = "http://localhost:8080/home/genie/listing/searchlisting/";

let getUserListingUrl =
  "http://localhost:8080/home/genie/listing/listingByOwner/";

let category_Listing_Container = document.querySelector(
  ".Category_Listing_Container"
);

window.addEventListener("load", (e) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  // If Category
  // ******************************************
  var CategoryKey = "Category";
  var viewKey = "view";

  var _status = window.location.href.indexOf("?" + CategoryKey + "=");
  var _viewKeyStatus = window.location.href.indexOf("?" + viewKey + "=");
  if (_status != -1) {
    let value = params.Category;
    document.getElementById("main_Title").innerHTML = value + " Category";

    getListingForCategory(value);
  } else if (_viewKeyStatus != -1) {
    document.getElementById("main_Title").innerHTML = "Your Listings";
    getListingOfUser();
  }
});

category_Listing_Container.innerHTML = "";

document.querySelectorAll(".ViewListing").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    if (!AuthenticateLogin()) {
      ShowMessageAndRedirect();
    } else {
      window.location.href = "Listing.html?view=getListings";
    }
  });
});

let getListingOfUser = () => {
  getUserListingUrl = getUserListingUrl + `${loggdInUser.id}`;
  postData(getUserListingUrl)
    .then((categoryData) => {
      let categoryArray = JSON.stringify(categoryData);

      if (categoryData.length == 0) {
        category_Listing_Container.innerHTML += `<p>No Listing Try Creating One!!</p> <a href="CreateListing.html">Create Listing</a>`;
      } else {
        for (let i = 0; i < categoryData.length; i++) {
          // searchResultCount.innerHTML = categoryData.length;
          let categoryListing = categoryData[i];
          let imageSource = "";
          if (categoryListing.image != null) {
            imageSource = `data:image/jpeg;base64,${categoryListing.image.data}`;
          } else {
            imageSource = `https://picsum.photos/500/250?random=${i + 10}`;
          }
          let categoryCardResult = `<div class="card">
         <img src="${imageSource}" alt="random image">
         <h3>${categoryListing.title}</h3>
         <p>Posted By: <span>${categoryListing.listingOwner}</span></p>
         <div class="browseBtn_Container">
             <a href="#" class="browseBtn" id="${categoryListing.id}" onclick="ViewListing(this);">View Listing</a>
         </div>`;
          category_Listing_Container.innerHTML += categoryCardResult;
        }
      }
    })
    .catch((err) => {
      ShowMessagePopUp(`Error occured. Kindly check console.`);
      console.log("Error occured while getting listing of user: " + err);
    });
};

let getListingForCategory = (CategoryValue) => {
  getCategoryURL = getCategoryURL + `?category=${CategoryValue}`;
  postData(getCategoryURL)
    .then((categoryData) => {
      let categoryArray = JSON.stringify(categoryData);

      if (categoryData.length == 0) {
        category_Listing_Container.innerHTML += `No Listing Try Creating One!! <a href="CreateListing.html">Create Listing</a>`;
      } else {
        for (let i = 0; i < categoryData.length; i++) {
          // searchResultCount.innerHTML = categoryData.length;
          let categoryListing = categoryData[i];
          let imageSource = "";
          if (categoryListing.image != null) {
            imageSource = `data:image/jpeg;base64,${categoryListing.image.data}`;
          } else {
            imageSource = `https://picsum.photos/500/250?random=${i + 10}`;
          }
          let categoryCardResult = `<div class="card">
          <img src="${imageSource}" alt="random image">
         <h3>${categoryListing.title}</h3>
         <p>Posted By: <span>${categoryListing.listingOwner}</span></p>
         <div class="browseBtn_Container">
             <a href="#" class="browseBtn" id="${categoryListing.id}" onclick="ViewListing(this);">View Listing</a>
         </div>`;
          category_Listing_Container.innerHTML += categoryCardResult;
        }
      }
    })
    .catch((err) => {
      ShowMessagePopUp(`Error occured. Kindly check console.`);
      console.log(
        "Error occured while getting listing of specific category: " + err
      );
    });
};

let ViewListing = (btnObject) => {
  if (!AuthenticateLogin()) {
    ShowMessageAndRedirect();
  } else {
    console.log("SpecificListing.html?ListingId=" + btnObject.id);
    window.location.href = "SpecificListing.html?ListingId=" + btnObject.id;
  }
};

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
