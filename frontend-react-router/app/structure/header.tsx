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

  return (
    <nav className="flex flex-row">
      <ul className="flex flex-row">
        <li className="m-2">{isAuth && <Link to="profile">Profile</Link>}</li>
        <li className="m-2">{!isAuth && <Link to="login">Login</Link>}</li>
        <li className="m-2">
          {isAuth && (
            //<Form>
            <a className="cursor-pointer" onClick={() => logout()}>
              Log out
            </a>
            //</Form>
          )}
        </li>
      </ul>
    </nav>
  );
}
