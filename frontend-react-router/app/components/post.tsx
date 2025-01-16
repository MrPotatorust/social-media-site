import { Link, useSubmit } from "react-router";
import type { postType } from "~/types";
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
  ArrowUpCircleIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

import {
  HandThumbDownIcon as HandThumbDownIconActive,
  HandThumbUpIcon as HandThumbUpIconActive,
  ArrowUpCircleIcon as ArrowUpCircleIconActive,
  BookmarkIcon as BookmarkIconActive,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export default function Post(props: postType) {
  const post = props.postData;
  const profileLink = `profile/${post.author}`;
  const submit = useSubmit();
  console.log(post.liked, post.disliked);
  const [postState, setPostState] = useState({
    likes: post.like_count,
    dislikes: post.dislike_count,
    reposts: post.repost_count,
    saves: post.save_count,
    liked: post.liked,
    disliked: post.disliked,
    reposted: post.reposted,
    saved: post.saved,
  });

  function postInteraction(e: React.MouseEvent) {
    const postId =
      e.currentTarget?.parentNode?.parentNode?.parentElement?.getAttribute(
        "data-key"
      );
    const postAction = e.currentTarget?.getAttribute("name");
    if (postId && postAction) {
      setPostState((oldPost) => {
        if (postAction === "like" && oldPost.likes >= 0) {
          return {
            ...oldPost,
            liked: !oldPost.liked,
            likes: oldPost.likes + (oldPost.liked ? -1 : 1),
            disliked: oldPost.disliked && false,
            dislikes: oldPost.disliked
              ? oldPost.dislikes - 1
              : oldPost.dislikes,
          };
        } else if (postAction === "dislike" && oldPost.dislikes >= 0) {
          return {
            ...oldPost,
            disliked: !oldPost.disliked,
            dislikes: oldPost.dislikes + (oldPost.disliked ? -1 : 1),
            liked: oldPost.liked && false,
            likes: oldPost.liked ? oldPost.likes - 1 : oldPost.likes,
          };
        } else if (postAction === "repost" && oldPost.reposts >= 0) {
          return {
            ...oldPost,
            reposted: !oldPost.reposted,
            reposts: oldPost.reposts + (oldPost.reposted ? -1 : 1),
          };
        } else if (postAction === "save" && oldPost.saves >= 0) {
          return {
            ...oldPost,
            saved: !oldPost.saved,
            saves: oldPost.saves + (oldPost.saved ? -1 : 1),
          };
        } else {
          return oldPost;
        }
      });
      submit(
        { action: "postInteraction", postId: postId, postAction: postAction },
        { method: "post" }
      );
    }
  }

  return (
    <div className="space-y-1.5 max-w-7xl" data-key={post.id}>
      <p className="text-wrap">{post.text}</p>
      <div>
        <span>
          <HandThumbUpIcon
            className={
              !postState.liked ? "size-6 inline-block cursor-pointer" : "hidden"
            }
            onClick={(e) => postInteraction(e)}
            name="like"
          />{" "}
          <HandThumbUpIconActive
            className={
              postState.liked ? "size-6 inline-block cursor-pointer" : "hidden"
            }
            onClick={(e) => postInteraction(e)}
            name="like"
          />{" "}
          {postState.likes}
        </span>
        <span>
          <HandThumbDownIcon
            className={
              !postState.disliked
                ? "size-6 inline-block cursor-pointer"
                : "hidden"
            }
            onClick={(e) => postInteraction(e)}
            name="dislike"
          />{" "}
          <HandThumbDownIconActive
            className={
              postState.disliked
                ? "size-6 inline-block cursor-pointer"
                : "hidden"
            }
            onClick={(e) => postInteraction(e)}
            name="dislike"
          />{" "}
          {postState.dislikes}
        </span>
        <span>
          <ArrowUpCircleIcon
            className={
              !postState.reposted
                ? "size-6 inline-block cursor-pointer"
                : "hidden"
            }
            onClick={(e) => postInteraction(e)}
            name="repost"
          />{" "}
          <ArrowUpCircleIconActive
            className={
              postState.reposted
                ? "size-6 inline-block cursor-pointer"
                : "hidden"
            }
            onClick={(e) => postInteraction(e)}
            name="repost"
          />{" "}
          {postState.reposts}
        </span>
        <span>
          <BookmarkIcon
            className={
              !postState.saved ? "size-6 inline-block cursor-pointer" : "hidden"
            }
            onClick={(e) => postInteraction(e)}
            name="save"
          />{" "}
          <BookmarkIconActive
            className={
              postState.saved ? "size-6 inline-block cursor-pointer" : "hidden"
            }
            onClick={(e) => postInteraction(e)}
            name="save"
          />{" "}
          {postState.saves}
        </span>
        <span className="block">
          <Link className="underline" to={profileLink}>
            {post.author}
          </Link>{" "}
          {post.pub_date}
        </span>
      </div>
    </div>
  );
}
