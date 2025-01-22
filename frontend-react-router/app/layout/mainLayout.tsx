import { Outlet, useOutlet, useOutletContext } from "react-router";
import Header from "~/structure/header";
import Footer from "~/structure/footer";
import type { Route } from "../+types/root";
import type { OutletContextType } from "~/types";

export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet context={useOutletContext<OutletContextType>()} />
      {/* <Footer /> */}
    </>
  );
}
