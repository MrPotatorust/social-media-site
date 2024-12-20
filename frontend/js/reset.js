import { resetPassword } from "./apiCalls.js";

const resetForm = document.forms["reset-form"];

resetForm.addEventListener("submit", submitResetForm);

function submitResetForm(e) {
  console.log(resetForm["reset-email"].value);
  resetPassword(resetForm["reset-email"].value);
  e.preventDefault();
}
