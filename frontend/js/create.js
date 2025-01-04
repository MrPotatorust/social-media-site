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
    const test = async () => {
      const response = await createPost(postText.value);
      console.log(response);
      if (response === 201) {
        window.location.replace("/frontend/html/read.html");
      } else {
        console.log("something went wrong", response);
      }
    };

    test();
  }
}
