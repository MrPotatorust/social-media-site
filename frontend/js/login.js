import { loginUser } from "./apiCalls.js";
import { isLoggedIn } from "./auth.js";
isLoggedIn();

const loginForm = document.forms["loginForm"];
const loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", login);

async function login() {
  const username = loginForm["username"];
  const password = loginForm["password"];

  const formData = {
    username: username.value,
    password: password.value,
  };
  let res = await loginUser(formData);
  if (res == 200) {
    localStorage.setItem("username", username.value);
    localStorage.setItem("loggedIn", "true");
    window.location.replace("index.html");
  } else {
    console.log(res);
  }
}
