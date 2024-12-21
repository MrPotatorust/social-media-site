import { submitNewPassword, resetPasswordLinkValidity } from "./apiCalls.js";

// ! REWORK LATER there is no red border highlight and alert system is broken

const passwordSubmitFormWrapper = document.getElementById(
  "password-submit-form-wrapper"
);

let params = new URLSearchParams(location.search);

let resetToken = params.get("token");

const resetForm = document.forms["submit-password-form"];

linkCheckToken(
  resetPasswordLinkValidity,
  resetToken,
  400,
  passwordSubmitFormWrapper
);

// first reusable function

async function linkCheckToken(apiCallFunc, Token, code, element) {
  if ((await apiCallFunc(Token)) == code) {
    console.log(await apiCallFunc(Token));
    element.innerHTML = "<h1>The link is no longer valid</h1>";
  }
}

resetForm.addEventListener("submit", submitPasswordResetForm);

async function submitPasswordResetForm(e) {
  e.preventDefault();
  if (resetForm["reset-password1"].value != resetForm["reset-password2"].value) {
    resetForm.innerHTML += "<p>passwords dont match</p>";
  }
  const apiResponse = await submitNewPassword(
    resetForm["reset-password1"].value,
    resetToken
  );
  if (apiResponse == 200) {
    passwordSubmitFormWrapper.innerHTML = "<h1>Password has been changed</h1>";
  }
}
