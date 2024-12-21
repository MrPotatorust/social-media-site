import { resetPassword } from "./apiCalls.js";

const resetForm = document.forms["reset-form"];

resetForm.addEventListener("submit", submitEmailResetForm);

function submitEmailResetForm(e) {
  resetPassword(resetForm["reset-email"].value);
  e.preventDefault();
}
