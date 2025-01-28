import { api } from "~/apiCalls";
import type { Route } from "./+types/home";
import { Form, useOutletContext } from "react-router";
import Posts from "~/components/posts";
import type { OutletContextType } from "~/types";
import CreatePost from "~/components/createPost";
import TredingHashtags from "~/components/trendingHashtags";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const posts = await api.getPosts();
  const trendingHashtags = await api.getTrendingHashtags();

  const url = request.url;
  const searchParams = new URLSearchParams(
    url.substr(url.lastIndexOf("?") + 1)
  );

  if (searchParams.get("action") === "getComments") {
    const response = await api.getComments(searchParams.get("postId") as any);
    return {
      posts: posts,
      trendingHashtags: trendingHashtags,
      response: response,
    };
  }
  return { posts: posts, trendingHashtags: trendingHashtags };
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  let response;

  console.log(action);

  if (action === "postInteraction") {
    response = api.postInteraction(
      formData.get("postId") as any,
      formData.get("postAction") as any
    );
  } else if (action === "createPost") {
    response = await api.createPost(formData.get("text") as string);
    if (response === 201) {
      return true;
    }
    return false;
  } else if (action === "comment") {
    response = await api.createPost(
      formData.get("text") as string,
      formData.get("commentId") as string
    );
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
        <div>
          <Posts posts={loaderData.posts} />
        </div>
        <TredingHashtags hashtags={loaderData.trendingHashtags} />
      </div>
    </>
  );
}
