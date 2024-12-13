import { isLoggedIn, logOut, tokenCheck } from "./auth.js";

// ! THIS IS A PROBLEM BECAUSE THE isLoggedIN can finish before the tokenCheck can log out the user
// ! FIX LATER

tokenCheck();
isLoggedIn();

const navElements = {
  home: {
    html: `<li><a class="align-center" href="../html/index.html">home</a></li>`,
    condition: true,
  },
  create: {
    html: `<li><a class="align-center" href="../html/create.html">create post</a></li>`,
    condition: true,
  },
  read: {
    html: `<li><a class="align-center" href="../html/read.html">read posts</a></li>`,
    condition: true,
  },
  register: {
    html: `<li class="align-right"><a href="../html/login.html">login</a></li>`,
    condition() {
      return localStorage.getItem("loggedIn") === "false";
    },
  },
  profile: {
    html: `<li class="align-center"><a href="../html/profile.html?user=${localStorage.getItem(
      "username"
    )}" id="profile">profile</a></li>`,
    condition() {
      return localStorage.getItem("loggedIn") === "true";
    },
  },
  reset: {
    html: `<li class="align-center"><a href="../html/reset.html id="reset">reset password</a></li>`,
    condition() {
      return localStorage.getItem("loggedIn") === "false";
    },
  },
  logout: {
    html: `<li class="align-right"><a href="" id="logout-btn">Log out</a></li>`,
    condition() {
      return localStorage.getItem("loggedIn") === "true";
    },
  },
};

// ! THIS LOOP WILL BE LATER USED FOR CONDITIONAL RENDERING OF THE HEADER
const navEL = document.getElementsByTagName("nav")[0];
const navUl = document.createElement("ul");
navUl.id = "nav-ul";

Object.values(navElements).forEach((item) => {
  const shouldRender =
    typeof item.condition === "function" ? item.condition() : item.condition;
  if (shouldRender) {
    navUl.innerHTML += item.html;
  }
});
navEL.appendChild(navUl);

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", logOut);
