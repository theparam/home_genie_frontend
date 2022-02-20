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
});
