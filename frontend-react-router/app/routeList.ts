import type VerifyEmail from "./routes/verifyEmail";
import type { RouteListType } from "./types";

export const routeList = <RouteListType>{
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
  ResetPassword: {
    routeAuth: {
      isPrivate: false,
      showAuthenticated: false,
    },
    path: "reset-password",
    file: "routes/resetPassword.tsx",
  },
  VerifyEmail: {
    routeAuth: {
      isPrivate: false,
      showAuthenticated: false,
    },
    path: "verify-email",
    file: "routes/verifyEmail.tsx",
  },
};
