import { Outlet } from "react-router";
import type { Route } from "./+types/authWrapper";
import { useState } from "react";
import { loginApi } from "~/apiCalls";

export default function AuthWrapper() {
  const [user, setUser] = useState({ name: "", isAuthenticated: false });

  function login(username: string) {
    setUser({ ...user, name: username, isAuthenticated: true });
    localStorage.setItem("username", username);
    localStorage.setItem("isAuthenticated", "true");

    return true;
  }
  function logout() {
    setUser({ ...user, isAuthenticated: false });
  }

  return <Outlet context={{ user, setUser, login, logout }} />;
}
