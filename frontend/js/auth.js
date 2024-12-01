import { logOutApi, tokenCheckApi } from "./apiCalls.js";

const routes = {
  "/index.html": {
    auth: "false",
    loggedInRestriction: "false",
  },
  "/create.html": {
    auth: "true",
    loggedInRestriction: "false",
  },
  "/read.html": {
    auth: "false",
    loggedInRestriction: "false",
  },
  "/login.html": {
    auth: "false",
    loggedInRestriction: "true",
  },
  "/register.html": {
    auth: "false",
    loggedInRestriction: "true",
  },
};

export function isLoggedIn() {
  const loggedInStatus = localStorage.getItem("loggedIn");
  const curRoute = window.location.pathname.replace("/frontend/html", "");
  const curRouteAuth = routes[curRoute].auth;
  const curRouteLogInRestriction = routes[curRoute].loggedInRestriction;
  console.log(loggedInStatus);
  console.log(curRouteAuth);

  if (curRouteLogInRestriction == "true" && loggedInStatus == "true") {
    window.location.replace("index.html");
  } else if (loggedInStatus == "false" && curRouteAuth == "true") {
    window.location.replace("login.html");
  }
}

export async function logOut() {
  const res = await logOutApi();

  if (res != 204) {
    console.log("log out failed");
  }
  localStorage.setItem("username", "null");
  localStorage.setItem("loggedIn", "false");
}

export async function tokenCheck() {
  const response = await tokenCheckApi();

  if (response == 203) {
    logOut();
  }
}
