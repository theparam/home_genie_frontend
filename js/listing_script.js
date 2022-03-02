let getCategoryURL = "http://localhost:8080/home/genie/listing/searchlisting/";

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
  var _status = window.location.href.indexOf("?" + CategoryKey + "=");
  if (_status != -1) {
    let value = params.Category;
    document.getElementById("main_Title").innerHTML = value + " Category";

    getListingForCategory(value);
  } else {
    alert("Your Listing");
    // var listinKey = "listingName";
    // var _listingKey = window.location.href.indexOf("?" + listinKey + "=");
    // let value = params.listingName;
    // document.querySelector(".page_title").innerHTML = value;
  }
});

category_Listing_Container.innerHTML = "";
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
          let categoryCardResult = `<div class="card">
         <img src="https://picsum.photos/500/250?random=${
           i + 10
         }" alt="random image">
         <h3>${categoryListing.title}</h3>
         <p>Posted By: <span>${categoryListing.listingOwner}</span></p>
         <div class="browseBtn_Container">
             <a href="#" class="browseBtn" id="${
               categoryListing.id
             }" onclick="ViewListing(this);">View Listing</a>
         </div>`;
          category_Listing_Container.innerHTML += categoryCardResult;
        }
      }
    })
    .catch((err) => {
      alert(err);
    });
};

let ViewListing = (btnObject) => {
  console.log("SpecificListing.html?ListingId=" + btnObject.id);
  window.location.href = "SpecificListing.html?ListingId=" + btnObject.id;
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
