import {
  Form,
  Link,
  useFetcher,
  useNavigate,
  useNavigation,
  useOutletContext,
} from "react-router";
import type { Route } from "./+types/login";
import type { OutletContextType } from "~/types";
import { api } from "~/apiCalls";
import { routeList } from "~/routeList";
import { useEffect } from "react";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  const username = formData.get("username");
  const password = formData.get("password");
  const result = await api.login(formData);
  if (result === 200) {
    return { state: true, username: formData.get("username") };
  } else {
    return { state: false };
  }
}

export default function Login() {
  const { login, routePrivacy } = useOutletContext<OutletContextType>();

  const navigate = useNavigate();
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  let loginFetcher = useFetcher();
  let resetPasswordFetcher = useFetcher();

  let data = loginFetcher?.data;

  useEffect(() => {
    routePrivacy(routeList.Login.routeAuth, navigate);

    if (data?.state && data?.username) {
      login(data.username);
      navigate("/");
    }
  }, [data?.state]);

  return (
    <div className="" id="login-page">
      <div className="grid place-items-center h-screen">
        <loginFetcher.Form
          method="post"
          className="grid grid-cols-6 grid-rows-6 size-96 place-items-center"
          action="/login"
        >
          <h2 className="col-span-6">Login</h2>
          <input
            className="border-2 col-span-4 col-start-2"
            type="text"
            name="username"
          />
          <input
            className="border-2 col-span-4 col-start-2"
            type="password"
            name="password"
          />
          <button className="col-span-4 border-2 col-start-2">Login</button>
          {(loginFetcher.state !== "idle" && <p>Pending...</p>) ||
            (data?.state == true && <p>Login Succesfull</p>) ||
            (data?.state == false && <p>Login Failed</p>)}
          {isNavigating && <p>Redirecting</p>}
        </loginFetcher.Form>
        <Link to="/reset-password" className="border-2">
          Reset Password
        </Link>
      </div>
    </div>
  );
}
