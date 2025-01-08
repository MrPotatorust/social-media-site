import {
  Form,
  useFetcher,
  useNavigate,
  useNavigation,
  useOutletContext,
} from "react-router";
import { useContext, useEffect } from "react";
import type { Route } from "../+types/root";
import ButtonTest from "~/components/buttonTest";
import type { OutletContextType } from "~/types";
import { loginApi } from "~/apiCalls";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  const username = formData.get("username");
  const password = formData.get("password");
  const result = await loginApi(formData);
  if (result === 200) {
    return { state: true, username: formData.get("username") };
  } else {
    return { state: false };
  }
}

export default function Login() {
  const { user, login } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  let fetcher = useFetcher();

  let data = fetcher?.data;

  useEffect(() => {
    if (data?.state && data?.username) {
      login(data.username);
      navigate("/");
    }
  }, [data?.state]);

  return (
    <div id="login-page">
      <h1>Login page</h1>
      <fetcher.Form method="post" className="flex items-center justify-center">
        <input className="border-2" type="text" name="username" />
        <input className="border-2" type="password" name="password" />
        <button>Login</button>
        {fetcher.state !== "idle" && <p>Pending...</p>}
        {data?.state == true && <p>Login Succesfull</p>}
        {data?.state == false && <p>Login Failed</p>}
        {isNavigating && <p>Redirecting</p>}
      </fetcher.Form>
      <ButtonTest />
    </div>
  );
}
