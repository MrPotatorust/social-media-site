import type { postData } from "~/types";
import Post from "./post";

export default function Posts(props: any) {
  const posts = props.posts.map((post: postData) => (
    <Post key={post.id} postData={post} />
  ));
  return (
    <>
      <h1>Your posts</h1>
      {posts}
    </>
  );
}
