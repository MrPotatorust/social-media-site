import {
  Form,
  Link,
  redirect,
  useOutletContext,
  useFetcher,
  useSubmit,
} from "react-router";
import type { OutletContextType } from "~/types";

export default function Header() {
  const { user, logout } = useOutletContext<OutletContextType>();
  const isAuth = user.isAuthenticated;
  const profileLink = `profile/${user.name}`;

  return (
    <nav className="flex flex-row">
      <ul className="flex flex-row">
        <li className="m-2">
          {isAuth && <Link to={profileLink}>Profile</Link>}
        </li>
        <li className="m-2">{!isAuth && <Link to="login">Login</Link>}</li>
        <li className="m-2">
          {isAuth && (
            <a className="cursor-pointer" onClick={() => logout()}>
              Log out
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
}
