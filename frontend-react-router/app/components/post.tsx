import { Link } from "react-router";
import type { postType } from "~/types";

export default function Post(props: postType) {
  const post = props.postData;
  const profileLink = `profile/${post.author}`;

  return (
    <div className="space-y-1.5 max-w-7xl">
      <p className="text-wrap">{post.text}</p>
      <p>
        <span>Likes: {post.likes}</span>
        <span>Reposts: {post.reposts}</span>
        <span>Saves: {post.saves}</span>
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
