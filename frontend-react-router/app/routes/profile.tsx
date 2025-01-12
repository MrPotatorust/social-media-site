import type { Route } from "./+types/profile";

export async function clientAction({ request }: Route.ClientActionArgs) {
  console.log("sent request to profile");
}

export default function Profile() {
  return (
    <div>
      <p>You are looking at the profile page</p>
    </div>
  );
}
