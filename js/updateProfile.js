let updateBtn = document.getElementById("updBtn");
let url = "http://localhost:8080/home/genie/user/update/";
let urlImg = "http://localhost:8080/home/genie/user/update-image/"
const UserSessionStorageKey = "LoggedInUser";
const video = document.getElementById("video");
// Elements for taking the snapshot
const canvas = document.getElementById("canvas");
class User {
  constructor(firstName, lastName, phoneNumber, email, address, bio, paswd) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.Address = address;
    this.Bio = bio;
    this.password = paswd;
  }
}

window.addEventListener("load", (e) => {
  let loggedInUser = JSON.parse(window.sessionStorage.getItem("LoggedInUser"));
  if (loggedInUser != null) {
    document.getElementById("upd-fName").value =
      loggedInUser.firstName != null ? loggedInUser.firstName : "";
    document.getElementById("upd-lName").value =
      loggedInUser.lastName != null ? loggedInUser.lastName : "";
    document.getElementById("upd-pNumber").value =
      loggedInUser.phoneNumber != null ? loggedInUser.phoneNumber : "";
    document.getElementById("upd-email").value =
      loggedInUser.email != null ? loggedInUser.email : "";
    document.getElementById("upd-Address").value =
      loggedInUser.address != null ? loggedInUser.address : "";
    document.getElementById("upd-Bio").value =
      loggedInUser.bio != null ? loggedInUser.bio : "";
    document.getElementById("upd-password").value =
      loggdUserId.password != null ? loggedInUser.password : "";
  }
});

updateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let fName = document.getElementById("upd-fName").value;
  let lName = document.getElementById("upd-lName").value;
  let phnNumber = document.getElementById("upd-pNumber").value;
  let email = document.getElementById("upd-email").value;
  let address = document.getElementById("upd-Address").value;
  let bio = document.getElementById("upd-Bio").value;
  let password = document.getElementById("upd-password").value;

  let userObj = new User(
    fName,
    lName,
    phnNumber,
    email,
    address,
    bio,
    password
  );

  console.log(userObj);
  let json = JSON.stringify(userObj);
  let userId = "";
  let loggedInUser = window.sessionStorage.getItem("LoggedInUser");
  if (loggedInUser != null) {
    var loggdUserId = JSON.parse(loggedInUser).id;
    url = url + loggdUserId;
    postUserData(url, json)
      .then((userData) => {
        //User Data from DB
        let updatedUser = JSON.stringify(userData);

        console.log("Data: " + updatedUser);

        alert("User update Successful");
        UpdateStorageSessions(UserSessionStorageKey, updatedUser);
      })
      .catch((err) => {
        alert(err);
      });
  } else {
    alert("Error.. Not a logged in user");
  }
});

async function postUserData(url = "", data) {
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
    method: "PUT",
  }).catch((err) => {
    return err;
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const UpdateStorageSessions = (key, value) => {
  myStorage = window.sessionStorage;

  if (myStorage.getItem(key) == null) {
    myStorage.setItem(key, value);
  } else {
    myStorage.removeItem(key);
    myStorage.setItem(key, value);
  }
};

document.getElementById("Open_Camera").addEventListener("click", (e) => {
  canvas.style.display = "none";
  video.style.display = "grid";
  video.style.width = "320px";
  video.style.height = "240px";

  canvas.style.width = "0";
  canvas.style.height = "0";
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      //video.src = window.URL.createObjectURL(stream);
      video.srcObject = stream;
      // video.play();  // or autplay
    });
  } else {
    console.log("media devices not available in this browser");
  }
});

document.getElementById("Stop_Camera").addEventListener("click", (e) => {
  console.log("stop_camera")
  e.preventDefault();
  canvas.style.width = "320px";
  canvas.style.height = "240px";

  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  let image_data_url = canvas.toDataURL("image/jpeg");

  const tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  video.style.width = "0";
  video.style.height = "0";
  video.style.display = "none";
  console.log("image_data_url   ",image_data_url);
  canvas.style.display = "grid";
  // document.getElementById("CameraImg").src = image_data_url;
  var blob = dataURItoBlob(image_data_url);
  console.log("blob  ",blob);
  // console.log("blob forms   ",blob.forms[0]);
  var file = new File([blob], "image.png");
  console.log("file  ",file);

  // var fd = new FormData(document.forms[0]);
  const formData = new FormData();
  formData.append("file", file);
  let loggedInUser = window.sessionStorage.getItem("LoggedInUser");
  // console.log("window.sessionStorage ",loggedInUser);
  // console.log(myFile.files[0]);
  console.log("loggedInUser   ", loggedInUser)
  if (loggedInUser != null) {
    var loggdUserId = JSON.parse(loggedInUser).id;
    console.log("loggdUserId  ",loggdUserId);
    urlImg = urlImg + loggdUserId;
    console.log("urlImg   ",  urlImg.toString());
    postImageData(urlImg,formData)
    .then((userData) => {
        //User Data from DB
        let updatedUser = JSON.stringify(userData);

        console.log("Data: " + updatedUser);

        alert("User update Successful");
        UpdateStorageSessions(UserSessionStorageKey, updatedUser);
      })
      .catch((err) => {
        alert(err);
      });
  } else {
    alert("Error.. Not a logged in user");
  }
});


async function postImageData(url = "", data) {
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
  }).catch((err) => {
    return err;
  });
  return response.json(); // parses JSON response into native JavaScript objects
}


function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
}