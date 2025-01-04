export async function readPosts(searchQuery) {
  let modifiedSearchQuery;

  if (searchQuery) {
    modifiedSearchQuery = searchQuery;
  } else {
    modifiedSearchQuery = "null";
  }
  const url = `http://127.0.0.1:8000/api/read-posts/${modifiedSearchQuery}`;
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

export async function createPost(text) {
  const url = "http://127.0.0.1:8000/api/create-post";
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
      }),
    });
    return await response.status;
  } catch (err) {
    return `Fetch of createPost failed ${err}`;
  }
}

export async function registerUser(formData) {
  const url = "http://127.0.0.1:8000/api/register";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
      }),
    });
    return await response.json();
  } catch (err) {
    return `Fetch of registerUser failed ${err}`;
  }
}

export async function loginUser(formData) {
  const url = "http://127.0.0.1:8000/api/login";

  try {
    const response = await fetch(url, {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
      }),
    });

    return await response.status;
  } catch (err) {
    return `Fetch of loginUser failed ${err}`;
  }
}

//? Currently not in use
export async function getNewCsrf() {
  const url = "http://127.0.0.1:8000/api/get-new-csrf";

  try {
    const response = await fetch(url, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (err) {
    return `Fetch of getNewCsrf failed ${err}`;
  }
}

export async function logOutApi() {
  const url = "http://127.0.0.1:8000/api/logout";

  try {
    const response = await fetch(url, {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.status;
  } catch (err) {
    return `Fetch of logOutApi failed ${err}`;
  }
}

export async function tokenCheckApi() {
  const url = "http://127.0.0.1:8000/api/token-check";

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

export async function postBtnInteraction(postId, action) {
  const url = "http://127.0.0.1:8000/api/handle-post-interaction";

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

export async function getProfile(user) {
  const url = `http://127.0.0.1:8000/api/get-profile/${user}`;
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

export async function getMedia(mediaPath) {
  const url = `http://127.0.0.1:8000/api/get-image/${mediaPath}`;
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

export async function resetPassword(email) {
  const url = `http://127.0.0.1:8000/api/send-reset-password`;
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
    return await response.json();
  } catch (err) {
    return `Fetch of resetPassword failed ${err}`;
  }
}

export async function submitNewPassword(password, token) {
  const url = `http://127.0.0.1:8000/api/submit-password`;
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
    return await response.status;
  } catch (err) {
    return `Fetch of submitNewPassword failed ${err}`;
  }
}

export async function resetPasswordLinkValidity(token) {
  const url = `http://127.0.0.1:8000/api/reset-password-link-validity`;
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
    return await response.status;
  } catch (err) {
    return `Fetch of resetPasswordLinkValidity failed ${err}`;
  }
}

export async function sendEmailVerification() {
  const url = `http://127.0.0.1:8000/api/send-email-verification`;
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.status;
  } catch (err) {
    return `Fetch of sendEmailVerification failed ${err}`;
  }
}

export async function emailVerificationLinkValidity(token) {
  const url = `http://127.0.0.1:8000/api/email-verification-link-validity`;
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
    return await response.status;
  } catch (err) {
    return `Fetch of emailVerificationLinkValidity failed ${err}`;
  }
}
