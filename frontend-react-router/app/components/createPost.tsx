import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { createPostType } from "~/types";

export default function CreatePost(props: createPostType) {
  const fetcher = useFetcher();

  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");
    // if (props.setParentCommentState) {
    //   props.setParentCommentState(false);
    // }
  }, [fetcher.data]);

  return (
    <fetcher.Form method="post" className="flex flex-col items-center">
      <textarea
        className="border-solid border-2 w-96 h-24 p-1 align-top mb-2 rounded-xl"
        placeholder="Share your thoughts"
        name="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <input
        type="text"
        name="action"
        defaultValue={props.isComment ? "comment" : "createPost"}
        hidden
      />
      {props.isComment && (
        <input
          type="text"
          name="commentId"
          defaultValue={props.mainPostId}
          hidden
        />
      )}
      <button
        type="submit"
        className="border-solid border-2 w-20 justify-center rounded-xl"
        onClick={() =>
          props.setParentCommentState && props.setParentCommentState(false)
        }
      >
        Post
      </button>
    </fetcher.Form>
  );
}
