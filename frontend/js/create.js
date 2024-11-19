import { createPost } from "./apiCalls.js";

document.getElementById("create-btn").addEventListener("click", validateForm);

const form = document.getElementById("form-main");

function validateForm() {
  let x = document.forms["myForm"]["fname"].value;
  console.log("RUNNING");

  // Remove any existing alert first
  const existingAlert = document.getElementById("form-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  if (x == "") {
    const alertP = document.createElement("p");
    alertP.id = "form-alert";
    alertP.textContent = "INVALID";
    form.appendChild(alertP);
  }
}
