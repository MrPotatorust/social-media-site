import { useNavigate, useNavigation } from "react-router";
import type { Route } from "./+types/verifyEmail";
import { api } from "~/apiCalls";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  console.log(params.token);
  if (params.token) {
    const response = await api.emailVerificationLinkValidity(params.token);
    if (response === 200) {
      return true;
    }
  }
  return false;
}

export default function VerifyEmail({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  if (loaderData === true) {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
  }

  return (
    <div>
      <h1 className="text-4xl">Verify email</h1>
      {loaderData ? (
        <>
          <h1 className="text-2xl text-green-700">
            Email Successfully verified
          </h1>
          <p>Redirecting to home in 3 seconds...</p>
        </>
      ) : (
        <h1 className="text-2xl text-red-600">This link is no longer valid</h1>
      )}
    </div>
  );
}
