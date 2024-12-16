import { createPost } from "./apiCalls.js";
import { isLoggedIn } from "./auth.js";
isLoggedIn();

const createBtn = document.getElementById("create-btn");
const form = document.getElementById("form-main");

createBtn.addEventListener("click", validateForm);

// ! rework this if hell

function validateForm() {
  let postText = document.forms["lookupForm"]["post-text"];

  // Remove any existing alert first
  const existingAlert = document.getElementById("form-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alertP = document.createElement("p");
  alertP.id = "form-alert";

  if (postText.value == "") {
    postText.classList.add("red-border");
    alertP.textContent = "You to enter a post text";
    form.appendChild(alertP);
  } else {
    postText.classList.remove("red-border");
    const username = localStorage.getItem("username");
    const test = async () => {
      console.log(await createPost(postText.value, username));
      window.location.replace("/frontend/html/read.html");
    };

    test();
  }
}
