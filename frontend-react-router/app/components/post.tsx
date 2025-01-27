import { Link, useFetcher, useOutletContext, useSubmit } from "react-router";
import type { OutletContextType, postData, postType } from "~/types";
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
import { useEffect, useState } from "react";
import CreatePost from "./createPost";

export default function Post(props: postType) {
  const { user } = useOutletContext<OutletContextType>();
  const post = props.postData;

  const profileLink = `profile/${post.author}`;
  const submit = useSubmit();
  const postInteractionFetcher = useFetcher();
  const getCommentsFetcher = useFetcher();

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

  const [error, setError] = useState<string>();

  const [showCreatePost, setCreatePost] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);

  useEffect(() => {
    if (postInteractionFetcher.state === "idle") {
      setPostState({
        likes: post.like_count,
        dislikes: post.dislike_count,
        reposts: post.repost_count,
        saves: post.save_count,
        liked: post.liked,
        disliked: post.disliked,
        reposted: post.reposted,
        saved: post.saved,
      });
    }
  }, [postInteractionFetcher.state]);

  function interactionCheck(e: React.MouseEvent) {
    setError("");
    if (!user.isAuthenticated) {
      setError("you have to be logged in to interact with posts");
      return;
    }

    const postAction = e.currentTarget?.getAttribute("name") || false;

    return { postAction } as any;
  }

  function postInteraction(e: React.MouseEvent) {
    const { postAction } = interactionCheck(e);

    if (post.id && postAction) {
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
      postInteractionFetcher.submit(
        { action: "postInteraction", postId: post.id, postAction: postAction },
        { method: "post" }
      );
    }
  }

  function handleComment(e: React.MouseEvent) {
    const { postAction } = interactionCheck(e);

    if (post.id && postAction) {
      setCreatePost((showCreatePost) => !showCreatePost);
    }
  }

  function loadComments() {
    setShowComments((showComments) => !showComments);
    getCommentsFetcher.submit(
      { postId: post.id, action: "getComments" },
      { method: "GET" }
    );
  }

  //? this is used for setting the key
  let wordCounter = 0;
  //! REWORK THIS BECAUSE TECHNICALLY IT CREATES AN EMPTY SPACE
  function highlightHashtags(text: string) {
    let words = text.split(" ").map((word: string) => {
      if (word.startsWith("#")) {
        wordCounter++;
        return (
          <b key={wordCounter} className="text-cyan-600">
            {" "}
            {word}
          </b>
        );
      }
      return ` ${word}`;
    });

    return words;
  }

  let testResult;

  if (getCommentsFetcher.data?.response) {
    testResult = getCommentsFetcher.data.response.map((post: postData) => (
      <Post key={post.id} postData={post} />
    ));
  }

  return (
    <div className="space-y-1.5 w-96 p-4 mb-8 border rounded-lg border-solid border-slate-500 ">
      <p className="text-wrap">{highlightHashtags(post.text)}</p>
      <div>
        <span>
          <button
            className="pr-4"
            name="comment"
            onClick={(e) => handleComment(e)}
          >
            +
          </button>
        </span>
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
        <span
          className="flex justify-center underline text-sky-600 cursor-pointer"
          onClick={loadComments}
        >
          Comments
        </span>
      </div>
      {showCreatePost && (
        <CreatePost
          isComment={true}
          mainPostId={post.id}
          setParentCommentState={setCreatePost}
        />
      )}
      {error && <h4 className="text-red-500">{error}</h4>}
      {showComments && testResult && testResult}
    </div>
  );
}
