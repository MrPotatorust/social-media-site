export class api {
  static baseUrl = "http://127.0.0.1:8000/api";
  static async login(formData: FormData) {
    const url = `${api.baseUrl}/login`;

    try {
      const response = await fetch(url, {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      return response.status;
    } catch (err) {
      return `Fetch of login failed ${err}`;
    }
  }

  static async logout() {
    const url = `${api.baseUrl}/logout`;

    try {
      const response = await fetch(url, {
        credentials: "include",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.status;
    } catch (err) {
      return `Fetch of logout failed ${err}`;
    }
  }
}
