import { useEffect } from "react";
import type { Route } from "./+types/resetPassword";
import { Form, useFetcher, useNavigate } from "react-router";
import { api } from "~/apiCalls";
import { routeList } from "~/routeList";
import { useOutletContext } from "react-router";
import type { OutletContextType } from "~/types";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");

  if (typeof email === "string") {
    const response = await api.resetPassword(email);

    if (response === 200) {
      return true;
    }
  }
  return false;
}

export default function ResetPassword() {
  const { routePrivacy } = useOutletContext<OutletContextType>();

  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    routePrivacy(routeList.Login.routeAuth, navigate);
  }, []);
  //   useEffect(() => {
  //     if (fetcher.data) {
  //       navigate("/");
  //     }
  //   }, [fetcher.data]);

  return (
    <div className="flex-auto justify-items-center self-center">
      <h2>Reset Password Here</h2>
      <fetcher.Form method="post">
        <label>
          Email
          <input
            className="border-2"
            name="email"
            type="email"
            placeholder="john.wick@gmail.com"
            required
          />
        </label>
        <button>Submit</button>
      </fetcher.Form>
      {fetcher.data && <p>if your email exist a reset email has been sent</p>}
    </div>
  );
}
