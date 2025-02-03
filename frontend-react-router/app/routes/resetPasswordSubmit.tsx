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
import RepeatPasswordInput from "~/components/form/repeatPasswordInput";
import { errorMapFunction, validation } from "~/customFunctions";

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
  const password1 = formData.get("password1") as string;
  const password2 = formData.get("password2") as string;
  const token = formData.get("token") as string;
  let errors: any = {};

  errors.password1 = validation.validatePassword(password1);
  errors.password2 = validation.validatePassword(password2);
  errors.arePasswordsMatch = password1 === password2;

  console.log("running client Action");

  if (
    errors.password1.length === 0 &&
    errors.password2.length === 0 &&
    errors.arePasswordsMatch
  ) {
    const response = await api.submitNewPassword(password1, token);

    console.log(response);
    if (response.status === "failed") {
      return { fail: true, valid: false };
    }

    if (response.status === 200) {
      return { valid: true };
    }
    errors.generalPassword = response?.json;
  }
  return { errors: errors, valid: false };
}

export default function ResetPasswordSubmit({
  loaderData,
}: Route.ComponentProps) {
  const { routePrivacy } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const errors = fetcher.data?.errors;

  console.log(fetcher.data);

  let mainContent;

  useEffect(() => {
    routePrivacy(routeList.Login.routeAuth, navigate);
  }, []);

  if (fetcher.data?.valid) {
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
        <RepeatPasswordInput
          password1Errors={errors?.password1}
          password2Errors={errors?.password2}
          arePasswordsMatch={errors?.arePasswordsMatch}
        />
        {fetcher.data?.fail ? (
          <h2 className="text-red-700 text-4xl">API FAIL</h2>
        ) : (
          errors?.generalPassword &&
          errors.generalPassword.map((error: string) => errorMapFunction(error))
        )}
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
