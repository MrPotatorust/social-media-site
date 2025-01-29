import type { Route } from "./+types/resetPasswordSubmit";
import { api } from "~/apiCalls";
import type { OutletContextType } from "~/types";
import {
  Link,
  useFetcher,
  useNavigate,
  useNavigation,
  useOutletContext,
} from "react-router";
import { useEffect } from "react";
import { routeList } from "~/routeList";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (params.token) {
    if ((await api.resetPasswordLinkValidity(params.token)) === 200) {
      return { success: true, token: params.token };
    }
  }
  return { success: false };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const password = formData.get("password1");
  const token = formData.get("token");

  if (typeof password === "string" && typeof token === "string") {
    const response = await api.submitNewPassword(password, token);
    if (response === 200) {
      return true;
    }
  }
  return false;
}

export default function ResetPasswordSubmit({
  loaderData,
}: Route.ComponentProps) {
  const { routePrivacy } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  let mainContent;

  useEffect(() => {
    routePrivacy(routeList.Login.routeAuth, navigate);
  });

  if (fetcher.data) {
    mainContent = (
      <>
        <h1 className="text-4xl text-green-500">Successfully reset password</h1>
        <Link to="/" className="text-blue-500">
          Return to homepage
        </Link>
      </>
    );
  } else if (loaderData.success) {
    mainContent = (
      <fetcher.Form method="post">
        <label>
          Password
          <input type="password" name="password1" required />
        </label>
        <label>
          Repeat password
          <input type="password" name="password2" required />
        </label>
        <input
          type="text"
          name="token"
          defaultValue={loaderData.token}
          hidden
        />
        <button>Submit</button>
      </fetcher.Form>
    );
  } else if (!loaderData.success) {
    mainContent = <h2 className="text-4xl text-red-600">Invalid Token</h2>;
  } else {
    mainContent = (
      <h2 className="text-4xl text-red-600">Error with loader function</h2>
    );
  }

  return (
    <div>
      <h1>Verify password</h1>
      {mainContent}
    </div>
  );
}
