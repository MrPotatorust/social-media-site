import { registerUser, loginUser } from "./apiCalls.js";

const registerForm = document.forms["registerForm"];
const loginForm = document.forms["loginForm"];

const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");

registerBtn.addEventListener("click", register);
loginBtn.addEventListener("click", login);

function register() {

  const firstName = registerForm["first-name"];
  const lastName = registerForm["last-name"];
  const username = registerForm["username"];
  const email = registerForm["email"];
  const password = registerForm["password1"];
  const passwordCheck = registerForm["password2"];

  const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const existingAlert = document.getElementById("form-alert");
  if (existingAlert) {
    firstName.classList.remove("red-border");
    lastName.classList.remove("red-border");
    username.classList.remove("red-border");
    email.classList.remove("red-border");
    password.classList.remove("red-border");
    passwordCheck.classList.remove("red-border");
    existingAlert.remove();
  }

  let validForm = true;
  const alertP = document.createElement("p");
  alertP.id = "form-alert";

  if (!firstName.value) {
    alertP.textContent += "Enter a First name";
    firstName.classList.add("red-border");
    validForm = false;
  }
  if (!lastName.value) {
    alertP.textContent += "Enter a Last name";
    lastName.classList.add("red-border");
    validForm = false;
  }
  if (username.value.length < 7) {
    alertP.textContent += "Username is too short.";
    username.classList.add("red-border");
    validForm = false;
  }
  if (!email.value.toLowerCase().match(re)) {
    alertP.textContent += "\n Enter a valid email";
    email.classList.add("red-border");
    validForm = false;
  }
  if (password.value.length < 10) {
    alertP.textContent += "\n Password is too short";
    password.classList.add("red-border");
    validForm = false;
  }
  if (
    password.value != passwordCheck.value ||
    !password.value ||
    !passwordCheck.value
  ) {
    alertP.textContent += "\n Passwords dont match";
    password.classList.add("red-border");
    passwordCheck.classList.add("red-border");
    validForm = false;
  }
  if (validForm == true) {
    let newForm = {
      first_name: firstName.value,
      last_name: lastName.value,
      username: username.value,
      email: email.value,
      password: password.value,
    }
    registerUser(newForm);
  } else {
    registerForm.appendChild(alertP);
  }
}

function login() {
  const username = loginForm["username"];
  const password = loginForm["password"];

  loginUser();
}
