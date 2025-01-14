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

  static async tokenCheck() {
    const url = `${api.baseUrl}/token-check`;

    try {
      const response = await fetch(url, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.status;
    } catch (err) {
      return `Fetch of tokenCheckApi failed ${err}`;
    }
  }

  static async postBtnInteraction(postId: number, action: string) {
    const url = `${api.baseUrl}/handle-post-interaction`;

    try {
      const response = await fetch(url, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          action: action,
        }),
      });
      return await response.status;
    } catch (err) {
      return `Fetch of postBtn failed ${err}`;
    }
  }
  static async getProfile(user: string) {
    const url = `${this.baseUrl}/get-profile/${user}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      return await response.json();
    } catch (err) {
      return `Fetch of getProfile failed ${err}`;
    }
  }

  static async getPosts(searchQuery?: string) {
    let modifiedSearchQuery;

    if (searchQuery) {
      modifiedSearchQuery = searchQuery;
    } else {
      modifiedSearchQuery = "null";
    }
    const url = `${api.baseUrl}/read-posts/${modifiedSearchQuery}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    } catch (err) {
      return `Fetch of readPosts failed ${err}`;
    }
  }
}
