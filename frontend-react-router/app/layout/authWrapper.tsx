import {
  Outlet,
  redirect,
  useFetcher,
  useNavigation,
  useSubmit,
  type FetcherWithComponents,
  type NavigateFunction,
  type SubmitTarget,
} from "react-router";
import React, { useEffect, useState } from "react";
import type { RouteAuthType } from "~/types";

export default function AuthWrapper() {
  const [user, setUser] = useState({
    name: localStorage.getItem("username"),
    isAuthenticated:
      localStorage.getItem("isAuthenticated") == "true" ? true : false,
    role: "admin",
  });

  const submit = useSubmit();
  const logoutFetcher = useFetcher();

  function login(username: string) {
    setUser({ ...user, name: username, isAuthenticated: true });
    localStorage.setItem("username", username);
    localStorage.setItem("isAuthenticated", "true");
    return true;
  }

  async function logout() {
    logoutFetcher.submit({ action: "logout" }, { method: "post", action: "/" });
  }

  useEffect(() => {
    if (logoutFetcher.data === true) {
      setUser((user) => ({ ...user, isAuthenticated: false }));
      localStorage.setItem("username", "");
      localStorage.setItem("isAuthenticated", "false");
    }
  }, [logoutFetcher.data]);

  function routePrivacy(
    routeAuth: RouteAuthType,
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
