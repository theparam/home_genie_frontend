let updateBtn = document.getElementById("updateBtn");
let url = "http://localhost:8080/home/genie/user/update/";
let urlImg = "http://localhost:8080/home/genie/user/update-image/";
const UserSessionStorageKey = "LoggedInUser";
const video = document.getElementById("video");

let defaultUserImageBtn = document.getElementById("defaultUserImage");

// Elements for taking the snapshot
const canvas = document.getElementById("canvas");
class User {
  constructor(firstName, lastName, phoneNumber, email, address, bio, paswd) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.address = address;
    this.bio = bio;
    this.password = paswd;
  }
}

window.addEventListener("load", (e) => {
  let loggedInUser = JSON.parse(window.sessionStorage.getItem("LoggedInUser"));

  if (loggedInUser != null) {
    let fName = loggedInUser.firstName;
    let lName = loggedInUser.lastName;

    document.getElementById("userName").innerHTML = fName + " " + lName;
    document.getElementById("upd-pNumber").value =
      loggedInUser.phoneNumber != null ? loggedInUser.phoneNumber : "";
    document.getElementById("upd-email").value =
      loggedInUser.email != null ? loggedInUser.email : "";
    document.getElementById("upd-Address").value =
      loggedInUser.address != null ? loggedInUser.address : "";
    setBioData();
    document.getElementById("upd-password").value =
      loggedInUser.password != null ? loggedInUser.password : "";

    if (loggedInUser.image != null || loggedInUser.image != undefined) {

      video.style.display = "none";
      canvas.style.width = "100%";
      canvas.style.height = "350px";
      var img = new Image();
      img.onload = function () {
        /// draw image to canvas
        canvas
          .getContext("2d")
          .drawImage(this, 0, 0, canvas.width, canvas.height);
      };
      img.src = `data:image/jpeg;base64,${loggedInUser.image.data}`;
      canvas.style.display = "grid";
      console.log(canvas.style.display);
    } else {
      defaultUserImage.style.display = "block";
      video.style.display = "none";
      canvas.style.display = "none";
    }
  }
});

function setBioData() {
  let loggedInUser = JSON.parse(window.sessionStorage.getItem("LoggedInUser"));
  if (loggedInUser != null && loggedInUser.bio !=null) {
    let arr = loggedInUser.bio.split(":");

    let site = arr[0];
    let dob = arr[1];
    let gender = arr[2];
    let language = arr[3];
    let educationBackground = arr[4];
    let previousJobExp = arr[5];

    document.getElementById("Site").value = site;
    document.getElementById("dob").value = dob;
    document.getElementById("gender").value = gender;
    document.getElementById("Language").value = language;
    document.getElementById("educationBackground").value = educationBackground;
    document.getElementById("previousJobExp").value = previousJobExp;
  }
}

updateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let loggedUser = JSON.parse(window.sessionStorage.getItem("LoggedInUser"));
  let fName = loggedUser.firstName;
  let lName = loggedUser.lastName;
  let phnNumber = document.getElementById("upd-pNumber").value;
  let email = document.getElementById("upd-email").value;
  let address = document.getElementById("upd-Address").value;
  let bio = EncodeBio();
  let password = document.getElementById("upd-password").value;

  console.log(bio);
  let userObj = new User(
    fName,
    lName,
    phnNumber,
    email,
    address,
    bio,

    password
  );

  let json = JSON.stringify(userObj);
  let loggedInUser = window.sessionStorage.getItem("LoggedInUser");
  if (loggedInUser != null) {
    var loggdUserId = JSON.parse(loggedInUser).id;
    url = url + loggdUserId;
    postUserData(url, json)
      .then((userData) => {
        //User Data from DB
        let updatedUser = JSON.stringify(userData);

        console.log("Data: " + updatedUser);

        UpdateStorageSessions(UserSessionStorageKey, updatedUser);

        ShowMessagePopUp("Profile Updated Successfully");
        setTimeout(() => {
          document
            .querySelector(".messageboxWrapper")
            .classList.remove("showMsgbox");

          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        ShowMessagePopUp(`Error occured. Kindly check console.`);
        console.log("Error occured while Updating Profile: " + err);
      });
  } else {
    ShowMessagePopUp("Unable to update. Not authorized");
    setTimeout(() => {
      document
        .querySelector(".messageboxWrapper")
        .classList.remove("showMsgbox");
    }, 2000);
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

document.getElementById("fileBtn").addEventListener("change", () => {
  defaultUserImageBtn.src = URL.createObjectURL(
    document.getElementById("fileBtn").files[0]
  );

  UploadImageFile(document.getElementById("fileBtn").files[0]);
  defaultUserImageBtn.style.display = "block";
  canvas.style.display = "none";
  video.style.display = "none";
});

document.getElementById("Open_Camera").addEventListener("click", (e) => {
  defaultUserImage.style.display = "none";
  canvas.style.display = "none";
  video.style.display = "grid";
  video.style.width = "100%";

  canvas.style.width = "0";
  canvas.style.height = "0";
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
    });
  } else {
    console.log("media devices not available in this browser");
  }
});

document.getElementById("Stop_Camera").addEventListener("click", (e) => {
  defaultUserImage.style.display = "none";
  e.preventDefault();
  canvas.style.width = "100%";
  canvas.style.height = "350px";

  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  let image_data_url = canvas.toDataURL("image/jpeg");

  const tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  video.style.width = "0";
  video.style.height = "0";
  video.style.display = "none";
  console.log("image_data_url   ", image_data_url);
  canvas.style.display = "grid";

  var blob = dataURItoBlob(image_data_url);
  console.log("blob  ", blob);

  var file = new File([blob], "image.png");
  console.log("file  ", file);
  UploadImageFile(file);
});

function UploadImageFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  let loggedInUser = window.sessionStorage.getItem("LoggedInUser");

  console.log("loggedInUser   ", loggedInUser);
  if (loggedInUser != null) {
    var loggdUserId = JSON.parse(loggedInUser).id;
    console.log("loggdUserId  ", loggdUserId);
    urlImg = urlImg + loggdUserId;
    console.log("urlImg   ", urlImg.toString());
    postImageData(urlImg, formData)
      .then((userData) => {
        //User Data from DB
        let updatedUser = JSON.stringify(userData);

        console.log("Data: " + updatedUser);
        UpdateStorageSessions(UserSessionStorageKey, updatedUser);

        ShowMessagePopUp("Image Updated Successfully.");
        setTimeout(() => {
          document
            .querySelector(".messageboxWrapper")
            .classList.remove("showMsgbox");

          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        alert(err);
      });
  } else {
    alert("Error.. Not a logged in user");
  }
}

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
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

function myFunction() {
  document.getElementById("default-img").style.display = "none";
}
