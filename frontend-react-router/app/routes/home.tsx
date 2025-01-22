import { api } from "~/apiCalls";
import type { Route } from "./+types/home";
import { Form, useOutletContext } from "react-router";
import Posts from "~/components/posts";
import type { OutletContextType } from "~/types";
import CreatePost from "~/components/createPost";

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
  const action = formData.get("action");
  let response;

  if (action === "postInteraction") {
    response = api.postInteraction(
      formData.get("postId") as any,
      formData.get("postAction") as any
    );
  } else if (action === "createPost") {
    response = await api.createPost(formData.get("text") as any);
    if (response === 201) {
      return true;
    }
    return false;
  } else {
    response = "uknown clientAction";
  }
  return response;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user } = useOutletContext<OutletContextType>();

  return (
    <>
      <h1 className="text-center pb-9">Welcome home</h1>
      <div className="flex-auto justify-items-center self-center">
        {user.isAuthenticated && (
          <div>
            {" "}
            <h2 className="text-left pl-2 font-medium">
              Hey do you want to create a post?
            </h2>
            <CreatePost />
          </div>
        )}
        <Posts posts={loaderData} />
      </div>
    </>
  );
}
