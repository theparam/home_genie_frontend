let emailId = document.getElementById("fg-Password-email").value;
let fg_password = document.getElementById("fg-PasswordBtn");
let VerifyOTP = document.getElementById("VerifyOTP");
const url = "http://localhost:8080/home/genie/user/login";
// let fetchByEmailURL = "http://localhost:8080//home/genie/user/";

fg_password.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".OTP-wrapper").classList.add("otpdiv_active");
  document.querySelector(".SendOTPBtn").classList.add("SendOTPhidden");
  document.querySelector(".fg-Password-buttons").classList.add("hiddenBtn");
  document.getElementById("fg-Password-email").disabled = true;
});

VerifyOTP.addEventListener("click", (e) => {
  e.preventDefault();
  document
    .querySelector(".fg-Password-wrapper")
    .classList.add("nonactiveState");
  document.querySelector(".generate_passwordDiv").classList.add("activeState");

  // if (emailId == "") {
  //   emailId = "sverm25@mylangara.ca";
  // }
  // alert(emailId);
  // fetchByEmailURL = fetchByEmailURL + "62076b1633a7bc0c91395416";
  // alert(fetchByEmailURL);
  // fetch(fetchByEmailURL)
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     alert(JSON.stringify(data));
  //     console.log(JSON.stringify(data));

  //     //   authors.map(function (author) {
  //     //     let li = document.createElement("li");
  //     //     let name = document.createElement("h2");
  //     //     let email = document.createElement("span");

  //     //     name.innerHTML = `${author.name}`;
  //     //     email.innerHTML = `${author.email}`;
  //     //   });
  //   })
  //   .catch((err) => {
  //     alert("Err: " + err);
  //   });
});

// Work to send Email for OTP
let SendEmail = () => {
  //   let RandomNumber = Math.floor(Math.random() * 10000 + 1);
  //   var Body =
  //     "Hello " +
  //     `<br> OTP to Reset your password is <strong>${RandomNumber}</strong>.` +
  //     "<br> Thanks and Regards <br> Team HOME GENIE";
  //   alert(emailId);
  //   Email.send({
  //     Host: "smtp.gmail.com",
  //     Username: "avinash6252@gmail.com",
  //     Password: "password",
  //     To: "vshubham799@gmail.com",
  //     From: "tumaurtum79@gmail.com",
  //     Subject: "Passwprd Reset OTP",
  //     Body: Body,
  //   }).then((message) => alert(message));
};

// Function to restrict only number input in the otp field
let inputNumberOnly = (e) => {
  var ASCIICode = e.keyCode;
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
  return true;
};

// Work done to send the new password set to the new database.
document.getElementById("fg-ConfirmBtn").addEventListener("click", (e) => {
  e.preventDefault();
  let newPassword = document.getElementById("fg-NewPassword").value;
  const json = JSON.stringify({
    email: emailId,
    password: newPassword,
  });
  //   change the url for forgetpassword.
  postData(url, json)
    .then((userData) => {
      // User Data from DB
      let logInUser = JSON.stringify(userData);
      console.log("Data: " + logInUser);

      alert("Password Reset Sucessfull");
      window.location.href = "/html_Files/Login.html";
    })
    .catch((err) => {
      alert(err);
    });
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
    method: "POST",
  }).catch((err) => {
    return err;
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
