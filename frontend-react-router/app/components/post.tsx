import { Link } from "react-router";
import type { postType } from "~/types";
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

export default function Post(props: postType) {
  const post = props.postData;
  const profileLink = `profile/${post.author}`;

  console.log(props);

  return (
    <div className="space-y-1.5 max-w-7xl">
      <p className="text-wrap">{post.text}</p>
      <p>
        <span>
          <HandThumbUpIcon className="size-6" /> {post.like_count}
        </span>
        <span>
          <HandThumbDownIcon className="size-6" /> {post.dislike_count}
        </span>
        <span>Reposts: {post.repost_count}</span>
        <span>Saves: {post.save_count}</span>
        <span>
          <Link to={profileLink}>
            {post.author}, {post.pub_date}
          </Link>
        </span>
        <Link to="profile"></Link>
      </p>
    </div>
  );
}
