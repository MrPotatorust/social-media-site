import { api } from "~/apiCalls";
import type { Route } from "./+types/home";
import { Form } from "react-router";
import Posts from "~/components/posts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const response = await api.getPosts();
  return response;
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  let response;

  if (formData.get("action") === "postInteraction") {
    response = api.postInteraction(
      formData.get("postId") as any,
      formData.get("postAction") as any
    );
  } else {
    response = "uknown clientAction";
  }
  return response;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1 className="text-center">Welcome home</h1>
      <div className="flex-auto justify-items-center self-center">
        <Posts posts={loaderData} />
      </div>
    </>
  );
}
