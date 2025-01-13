import type { Route } from "./+types/profile";
import { api } from "~/apiCalls";

export async function clientLoader({ params }: Route.LoaderArgs) {
  let profile = await api.getProfile(params.username);
  return profile;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  console.log("sent request to profile");
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { country, description, email_verified, last_action, user } =
    loaderData;
  return (
    <>
      <h1>You are looking at the profile page</h1>
      <div>
        <h2>{user.username}</h2>
        <h3>Bio:</h3>
        <p>{description}</p>
        <p>Country: {country.iso}</p>
        <p>
          Email verified:{" "}
          {email_verified ? (
            <strong>verified</strong>
          ) : (
            <strong>not verified</strong>
          )}
        </p>
      </div>
    </>
  );
}
