function validatePassword(password: string) {
  let errors = [];

  if (password.length < 8) {
    errors.push("Password is too short");
  }
  if (password == password.toLowerCase()) {
    errors.push("You have to have atleast one uppercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Your password contains atleast one number");
  }

  return errors;
}

function validateUsername(username: string) {
  let errors = [];

  if (username.length < 6) {
    errors.push("Username is too short");
  }
  return errors;
}
