import { submitNewPassword, resetPasswordLinkValidity } from "./apiCalls.js";

// ! REWORK LATER there is no red border highlight and alert system is broken

const passwordSubmitFormWrapper = document.getElementById(
  "password-submit-form-wrapper"
);

const checkingLinkHeading = document.getElementById("checking-link");

const resetForm = document.createElement("form");
resetForm.innerHTML = `
<label>
<input type="password" name="reset-password1" id="reset-password1">
</label>
<label>
<input type="password" name="reset-password2" id="reset-password2">
</label>
<button>Change password</button>
`;
resetForm.method = "post";
resetForm.name = "submit-password-form";
resetForm.addEventListener("submit", submitPasswordResetForm);

let params = new URLSearchParams(location.search);

let resetToken = params.get("token");

linkCheckToken(
  resetPasswordLinkValidity,
  resetToken,
  200,
  passwordSubmitFormWrapper
);

async function linkCheckToken(apiCallFunc, Token, code, parentElement) {
  const response = await apiCallFunc(Token);

  if (response == 400) {
    console.log(response);
    parentElement.innerHTML = "<h1>The link is no longer valid</h1>";
  } else if (response == code) {
    checkingLinkHeading.replaceWith(resetForm);
  }
}

async function submitPasswordResetForm(e) {
  e.preventDefault();
  if (
    resetForm["reset-password1"].value != resetForm["reset-password2"].value
  ) {
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
