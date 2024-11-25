import { isLoggedIn, logOut } from "./auth.js";

isLoggedIn();

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", logOut);
