import {
  Outlet,
  redirect,
  useNavigation,
  useSubmit,
  type NavigateFunction,
  type SubmitTarget,
} from "react-router";
import type { Route } from "./+types/authWrapper";
import React, { useState } from "react";
import type { routeAuthType } from "~/types";

export default function AuthWrapper() {
  const [user, setUser] = useState({
    name: localStorage.getItem("username"),
    isAuthenticated:
      localStorage.getItem("isAuthenticated") == "true" ? true : false,
    role: "admin",
  });

  const submit = useSubmit();

  function login(username: string) {
    setUser({ ...user, name: username, isAuthenticated: true });
    localStorage.setItem("username", username);
    localStorage.setItem("isAuthenticated", "true");
    return true;
  }

  function logout() {
    submit({ action: "logout" }, { method: "post", action: "/" });
    // setUser({ ...user, isAuthenticated: false });
    // localStorage.setItem("username", "");
    // localStorage.setItem("isAuthenticated", "false");
  }

  function routePrivacy(
    routeAuth: routeAuthType,
    navigate: NavigateFunction | null
  ) {
    if (
      (user.isAuthenticated && !routeAuth.showAuthenticated) ||
      (!user.isAuthenticated && routeAuth.isPrivate)
    ) {
      if (navigate) {
        navigate("/");
      }
      return true;
    }
    return false;
  }

  return <Outlet context={{ user, setUser, login, logout, routePrivacy }} />;
}
