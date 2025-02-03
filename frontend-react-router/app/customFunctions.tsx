export function errorMapFunction(error: string) {
  return <p className="text-red-700">{error}</p>;
}

export class validation {

  //! I can optimize the whole process later on using this function
  static arePasswordsValid(password1: string | null, password2: string | null) {
    let errors = [];

    
  }

  static validatePassword(password: string | null) {
    let errors = [];

    if (!password) {
      return errors.push("Enter a password.");
    }

    if (password.length < 8) {
      errors.push("Password is too short.");
    }
    if (password == password.toLowerCase()) {
      errors.push("You have to have atleast one uppercase letter.");
    }
    if (/^\d+$/.test(password)) {
      errors.push("Password cannot be entirely numeric.");
    }
    if (!/\d/.test(password)) {
      errors.push("Your password has to contain atleast one number.");
    }

    return errors;
  }

  static validateUsername(username: string | null) {
    let errors = [];

    if (!username) {
      errors.push("Enter a username.");
      return errors;
    }

    if (!/^[a-zA-Z0-9@.+_-]+$/.test(username)) {
      errors.push(
        "Contains invalid special characters (only @ . + - _ allowed)."
      );
    }

    if (username.length < 6) {
      errors.push("Username is too short.");
    }
    return errors;
  }

  static validateName(name: string | null) {
    let errors = [];

    if (!name) {
      errors.push("Enter a name.");
      return errors;
    }

    if (!/^[a-zA-Z]+$/.test(name)) {
      errors.push(
        "You can use only letters (Contains invalid special characters or numbers)."
      );
    }

    return errors;
  }
}
