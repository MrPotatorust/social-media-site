import {
  Outlet,
  redirect,
  useNavigation,
  type NavigateFunction,
} from "react-router";
import type { Route } from "./+types/authWrapper";
import { useState } from "react";
import { loginApi } from "~/apiCalls";
import { useNavigate } from "react-router";
import type { routeAuthType } from "~/types";

export default function AuthWrapper() {
  const [user, setUser] = useState({
    name: localStorage.getItem("username"),
    isAuthenticated:
      localStorage.getItem("isAuthenticated") == "true" ? true : false,
  });

  function login(username: string) {
    setUser({ ...user, name: username, isAuthenticated: true });
    localStorage.setItem("username", username);
    localStorage.setItem("isAuthenticated", "true");
    return true;
  }

  function logout() {
    setUser({ ...user, isAuthenticated: false });
  }

  function routePrivacy(routeAuth: routeAuthType, navigate: NavigateFunction) {
    if (
      (user.isAuthenticated && !routeAuth.showAuthenticated) ||
      (!user.isAuthenticated && routeAuth.isPrivate)
    ) {
      navigate("/");
      return true;
    }
    return false;
  }

  return <Outlet context={{ user, setUser, login, logout, routePrivacy }} />;
}
