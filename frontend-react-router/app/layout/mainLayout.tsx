import { Outlet, useOutlet, useOutletContext } from "react-router";
import Header from "~/structure/header";
import Footer from "~/structure/footer";
import type { Route } from "../+types/root";

export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet context={useOutletContext()} />
      <Footer />
    </>
  );
}
