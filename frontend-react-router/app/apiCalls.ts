import type { RegisterUserType, SubmitPasswordType } from "./types";

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

  static async postInteraction(postId: number, action: string) {
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
      return false;
    }
  }

  static async getPosts(searchQuery?: string) {
    let modifiedSearchQuery;

    if (searchQuery) {
      modifiedSearchQuery = searchQuery;
    } else {
      modifiedSearchQuery = "null";
    }
    const url = `${api.baseUrl}/get-posts/${modifiedSearchQuery}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    } catch (err) {
      return `Fetch of getPosts failed ${err}`;
    }
  }

  static async createPost(text: string, commentId = "") {
    const url = `${api.baseUrl}/create-post`;
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          ...(commentId
            ? { commentId: commentId, action: "comment" }
            : { action: "createPost" }),
        }),
      });
      return await response.status;
    } catch (err) {
      return `Fetch of createPost failed ${err}`;
    }
  }

  static async getTrendingHashtags() {
    const url = `${api.baseUrl}/get-trending-hashtags`;
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      return await response.json();
    } catch (err) {
      return `Fetch of createPost failed ${err}`;
    }
  }
  static async getMedia(mediaPath: string) {
    const url = `${api.baseUrl}/get-image/${mediaPath}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      return await response.blob();
    } catch (err) {
      return `Fetch of getProfile failed ${err}`;
    }
  }
  static async getComments(postId: number) {
    const url = `${api.baseUrl}/get-comments/${postId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      return await response.json();
    } catch (err) {
      return `Fetch of getComments failer ${err}`;
    }
  }

  static async resetPassword(email: string) {
    const url = `${api.baseUrl}/send-reset-password`;
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      return response.status;
    } catch (err) {
      return `Fetch of resetPassword failed ${err}`;
    }
  }

  static async submitNewPassword(password: string, token: string) {
    const url = `${api.baseUrl}/submit-password`;
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          token: token,
        }),
      });
      return {
        json: await response.json(),
        status: response.status,
      };
    } catch (err) {
      return {
        json: `Fetch of submitNewPassword failed ${err}`,
        status: "failed",
      };
    }
  }

  static async resetPasswordLinkValidity(token: string) {
    const url = `${api.baseUrl}/reset-password-link-validity`;
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      });
      return response.status;
    } catch (err) {
      return `Fetch of resetPasswordLinkValidity failed ${err}`;
    }
  }

  static async sendEmailVerification() {
    const url = `${api.baseUrl}/send-email-verification`;
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.status;
    } catch (err) {
      return `Fetch of sendEmailVerification failed ${err}`;
    }
  }

  static async emailVerificationLinkValidity(token: string) {
    const url = `${api.baseUrl}/email-verification-link-validity`;
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      });
      return response.status;
    } catch (err) {
      return `Fetch of emailVerificationLinkValidity failed ${err}`;
    }
  }
  static async registerUser({
    firstName,
    lastName,
    username,
    email,
    password,
  }: RegisterUserType) {
    const url = `${api.baseUrl}/register`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          lastName: lastName,
          username: username,
          email: email,
          password: password,
        }),
      });
      return await response.json();
    } catch (err) {
      return `Fetch of registerUser failed ${err}`;
    }
  }
}
