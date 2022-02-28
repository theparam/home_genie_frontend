let url = "http://localhost:8080/home/genie/listing/searchlisting/";
let Search_Listing_Container = document.querySelector(
  ".Search_Listing_Container"
);
let searchResultCount = document.getElementById("searchCount");
let SearchQueryTitle = document.getElementById("searchTitle");
let categoryQueryTitle = document.getElementById("category_title");

window.addEventListener("load", (e) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  let searchValue = "";
  let categoryValue = "";
  var SearchKey = "SearchKey";
  var _searchStatus = window.location.href.indexOf("?" + SearchKey + "=");
  if (_searchStatus != -1) {
    searchValue = params.SearchKey;
  }

  var categoryKey = "category";
  var _categoryStatus = window.location.href.indexOf("&" + categoryKey + "=");
  if (_categoryStatus != -1) {
    categoryValue = params.category;
  }
  searchValue = encodeURIComponent(searchValue.trim());
  let searchQuery = searchValue + "/" + categoryValue;

  let searchparam = {
    title: searchValue,
    category: categoryValue,
  };

  url = url + `?title=${searchValue}` + `&category=${categoryValue}`;
  alert;
  SearchQueryTitle.innerHTML = searchValue;
  categoryQueryTitle.innerHTML = categoryValue;
  postData(url)
    .then((searchedData) => {
      let SearchArray = JSON.stringify(searchedData);
      console.log("respnos " + SearchArray);
      for (let i = 0; i < searchedData.length; i++) {
        searchResultCount.innerHTML = searchedData.length;
        let searchedListing = searchedData[i];
        console.log("Data: " + JSON.stringify(searchedListing));
        let searchCardResult = `<div class="card">
         <img src="https://picsum.photos/500/250?random=${
           i + 10
         }" alt="random image">
         <h3>${searchedListing.title}</h3>
         <p>Posted By: <span>${searchedListing.listingOwner}</span></p>
         <div class="browseBtn_Container">
             <a href="#" class="browseBtn" id="${
               searchedListing.id
             }" onclick="ViewListing(this);">View Listing</a>
         </div>`;
        Search_Listing_Container.innerHTML += searchCardResult;
      }
    })
    .catch((err) => {
      alert(err);
    });
});

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
