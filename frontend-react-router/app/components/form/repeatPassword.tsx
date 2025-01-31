export default function RepeatPasswordInput() {
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
      </label>
    </>
  );
}
