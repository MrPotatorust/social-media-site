import { emailVerificationLinkValidity } from "./apiCalls.js";

const emailPendingHeading = document.getElementById("email-h1");

let params = new URLSearchParams(location.search);

let resetToken = params.get("token");

verifyToken(resetToken);

async function verifyToken(token) {
  const response = await emailVerificationLinkValidity(token);

  console.log(response);

  if (response == 200) {
    emailPendingHeading.innerText = "Successfully verified email!";
  } else {
    emailPendingHeading.innerText = "Link is not valid";
  }
}
