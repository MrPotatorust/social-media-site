import type { postData } from "~/types";
import Post from "./post";

export default function Posts(props: any) {
  let posts;
  if (props.posts || props.posts != "failed to get an object instance") {
    posts = props.posts.map((post: postData) => (
      <Post key={post.id} postData={post} />
    ));
  }
  return (
    <>
      <h1>Your posts</h1>
      {posts ? (
        posts
      ) : (
        <h1 className="text-xl text-red-500 font-bold">
          sorry posts are currently unavailable
        </h1>
      )}
    </>
  );
}
