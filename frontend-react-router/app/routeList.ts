import type { routeListType } from "./types";

export const routeList = <routeListType>{
  Home: {
    routeAuth: {
      isPrivate: false,
      showAuthenticated: true,
    },
    path: null,
    file: "routes/home.tsx",
  },
  Login: {
    routeAuth: {
      isPrivate: false,
      showAuthenticated: false,
    },
    path: "login",
    file: "routes/login.tsx",
  },
  Profile: {
    routeAuth: {
      isPrivate: true,
      showAuthenticated: true,
    },
    path: "profile",
    file: "routes/profile.tsx",
  },
};
