let updateBtn = document.getElementById("updBtn");
let url = "http://localhost:8080/home/genie/user/update/";
const UserSessionStorageKey = "LoggedInUser";
const video = document.getElementById("video");

// Elements for taking the snapshot
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
//// context.scale(0.5, 0.5);
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

  let json = JSON.stringify(userObj);
  let userId = "";
  let loggedInUser = window.sessionStorage.getItem("LoggedInUser");
  if (loggedInUser != null) {
    var loggdUserId = JSON.parse(loggedInUser).id;
    url = url + loggdUserId;
    postData(url, json)
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

async function postData(url = "", data) {
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
  e.preventDefault();
  // canvas.style.display = "none";
  // video.style.display = "flex";
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
  e.preventDefault();
  //canvas.width = video.videoWidth;
  //canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0);

  const imageBlob = canvas.toBlob(handleBlob, "image/jpeg");
  const tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());

  // canvas.style.display = "flex";
  // video.style.display = "none";
});

function handleBlob(blob) {
  // we can turn the blob into DOMString
  const objectURL = window.URL.createObjectURL(blob);
  const copyImg = document.createElement("img");
  //(objectURL is only contains the address of image object in browser memory)
  //it is vaid for current browser session
  copyImg.src = objectURL;
  document.body.appendChild(copyImg);
  console.log(objectURL);

  //if we want to store the image into server, one way is to
  //create base64 rendition of the the blob using FileReader
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    console.log(reader.result);
  });
  // if you want to deal with it as base64 string (e.g. img src)
  reader.readAsDataURL(blob);
  //if you want to read it binary
  //reader.readAsArrayBuffer(blob);
}
