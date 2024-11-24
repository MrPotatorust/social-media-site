import { createPost } from "./apiCalls.js";
import { isLoggedIn } from "./auth.js";
isLoggedIn();

const createBtn = document.getElementById("create-btn");
const form = document.getElementById("form-main");

createBtn.addEventListener("click", validateForm);

// ! rework this if hell

function validateForm() {
  let postTitle = document.forms["lookupForm"]["post-title"];
  let postText = document.forms["lookupForm"]["post-text"];

  // Remove any existing alert first
  const existingAlert = document.getElementById("form-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alertP = document.createElement("p");
  alertP.id = "form-alert";

  if (postTitle.value == "" || postText.value == "") {
    alertP.textContent = "You have an empty field/s!";
    form.appendChild(alertP);
  } else {
    const username = localStorage.getItem("username");
    console.log(username);
    createPost(postTitle.value, postText.value, username);
  }

  if (postTitle.value == "") {
    postTitle.classList.add("red-border");
  } else {
    postTitle.classList.remove("red-border");
  }
  if (postText.value == "") {
    postText.classList.add("red-border");
  } else {
    postText.classList.remove("red-border");
  }
}
