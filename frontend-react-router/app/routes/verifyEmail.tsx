import type { Route } from "./+types/verifyEmail";

export async function clientLoader(params: Route.ClientLoaderArgs) {}

export default function VerifyEmail() {
  return <div>Verify email</div>;
}
