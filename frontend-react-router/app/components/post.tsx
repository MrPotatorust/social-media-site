import { Link } from "react-router";
import type { postProps } from "~/types";

export default function Post(props: postProps) {
  return (
    <div key={props.id}>
      <p>{props.text}</p>
      <p>
        <span>Likes: {props.likes}</span>
        <span>Reposts: {props.reposts}</span>
        <span>Saves: {props.saves}</span>
        <Link to="profile"></Link>
      </p>
    </div>
  );
}
