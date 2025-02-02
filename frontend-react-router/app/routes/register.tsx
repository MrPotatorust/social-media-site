import type { Route } from "./+types/register";
import { Form, useFetcher, useNavigate, useNavigation } from "react-router";
import RepeatPasswordInput from "~/components/form/repeatPassword";
import { errorMapFunction, validation } from "~/customFunctions";
import { api } from "~/apiCalls";
import { useEffect } from "react";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  let errors: any = {};

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password1 = formData.get("password1") as string;
  const password2 = formData.get("password2") as string;

  errors.firstName = validation.validateName(firstName);
  errors.lastName = validation.validateName(lastName);
  errors.username = validation.validateUsername(username);
  errors.password1 = validation.validatePassword(password1);
  errors.password2 = validation.validatePassword(password2);
  errors.arePasswordsMatch = password1 === password2;

  if (
    errors.username.length === 0 &&
    errors.password1.length === 0 &&
    errors.password2.length === 0 &&
    errors.arePasswordsMatch
  ) {
    const response = await api.registerUser({
      firstName,
      lastName,
      email,
      username,
      password: password1,
    });

    if (response === "succesfully registered") {
      return { valid: true };
    } else {
      for (const field in response) {
        response[field].map((error: string) => errors[field].push(error));
      }
    }
  }
  return { errors: errors };
}

export default function Registration() {
  const registrationFetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (registrationFetcher.data?.valid === true) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [registrationFetcher.data]);

  const errors = registrationFetcher.data?.errors;

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
          {errors?.firstName && errors.firstName.map(errorMapFunction)}
        </label>
        <label>
          Last Name
          <input
            className="border-2"
            type="text"
            name="lastName"
            placeholder="Wick"
          />
          {errors?.lastName && errors.lastName.map(errorMapFunction)}
        </label>
        <label>
          Username
          <input
            className="border-2"
            type="text"
            name="username"
            placeholder="Johnkane1"
          />
          {errors?.username && errors?.username.map(errorMapFunction)}
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
        <RepeatPasswordInput
          password1Errors={errors?.password1}
          password2Errors={errors?.password2}
          arePasswordsMatch={errors?.arePasswordsMatch}
        />
        {errors?.password && errors?.password.map(errorMapFunction)}
        <button className="border-2">Register</button>
        {registrationFetcher.data?.valid === true && <p>Login succesfull!</p>}
        {registrationFetcher.data?.valid === true && (
        <p>Redirecting to login in 3 seconds</p>
        )}
      </registrationFetcher.Form>
    </div>
  );
}
