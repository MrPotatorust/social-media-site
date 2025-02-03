import React from "react";
import type { RepeatPasswordInput } from "~/types";
import { errorMapFunction } from "~/customFunctions";

export default function RepeatPasswordInput(props: RepeatPasswordInput) {
  const { password1Errors, password2Errors, arePasswordsMatch } = props;

  return (
    <>
      {" "}
      <label>
        Password
        <input
          className="border-2"
          type="password"
          name="password1"
          placeholder="******"
          required
        />
        {password1Errors &&
          password1Errors.map((error) => errorMapFunction(error))}
      </label>
      <label>
        Repeat Password
        <input
          className="border-2"
          type="password"
          name="password2"
          placeholder="******"
          required
        />
        {password1Errors &&
          password2Errors.map((error) => errorMapFunction(error))}
      </label>
      {arePasswordsMatch == false && (
        <p className="text-red-700">Passwords dont match</p>
      )}
    </>
  );
}
