const personalCategory = "Personal";
const IndoorCategory = "Indoor";
const OutdoorCategory = "Outdoor";
const PremiumCategory = "Premium";

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
  } else {
    alert("Not from Category");
    // var listinKey = "listingName";
    // var _listingKey = window.location.href.indexOf("?" + listinKey + "=");
    // let value = params.listingName;
    // document.querySelector(".page_title").innerHTML = value;
  }
});
