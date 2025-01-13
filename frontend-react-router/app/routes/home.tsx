import { api } from "~/apiCalls";
import type { Route } from "./+types/home";
import { Form } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientAction(request: Route.ActionArgs) {
  console.log("request sent to home");
}

export default function Home() {
  return (
    <>
      <h1>Hello</h1>
    </>
  );
}
