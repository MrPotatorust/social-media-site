import type { Route } from "./+types/register";
import { Form, useFetcher } from "react-router";
import RepeatPasswordInput from "~/components/form/repeatPassword";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  console.log(formData);
  let errors = "nooo";

  return { errors: errors };
}

export default function Registration() {
  const registrationFetcher = useFetcher();

  // const errors = registrationFetcher.errors;

  return (
    <div>
      <h2>Register1</h2>
      <registrationFetcher.Form method="post">
        <label>
          First name
          <input
            className="border-2"
            type="text"
            name="firstName"
            placeholder="John"
          />
        </label>
        <label>
          Last Name
          <input
            className="border-2"
            type="text"
            name="lastName"
            placeholder="Wick"
          />
        </label>
        <label>
          Email
          <input
            className="border-2"
            type="email"
            name="email"
            placeholder="john.wick@continental.com"
          />
        </label>
        <RepeatPasswordInput />
        <button className="border-2">Register</button>
      </registrationFetcher.Form>
    </div>
  );
}
