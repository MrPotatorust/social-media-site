export async function readPosts() {
  const url = "http://127.0.0.1:8000/api/read-posts";
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

export async function createPost(title, text, author) {
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
        title: title,
        text: text,
        username: author,
      }),
    });
    return await response.json();
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
  // let csrfToken = await getNewCsrf()

  try {
    const response = await fetch(url, {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": "",
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

export async function getNewCsrf() {
  const url = "http://127.0.0.1:8000/api/get-new-csrf";

  try {
    const response = await fetch(url, {
      credentials: "include", // Important for cookies
      method: "GET", // Explicitly set method
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch {
    return "null";
  }
}

export async function logOutApi() {
  const url = "http://127.0.0.1:8000/api/logout";

  try {
    const response = await fetch(url, {
      credentials: "include", // Important for cookies
      method: "DELETE", // Explicitly set method
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.status;
  } catch {
    return "null";
  }
}

export async function tokenCheckApi() {
  const url = "http://127.0.0.1:8000/api/token-check";

  try {
    const response = await fetch(url, {
      credentials: "include", // Important for cookies
      method: "POST", // Explicitly set method
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
      }),
    });
    return await response.status;
  } catch {
    return "null";
  }
}

export async function postBtnInteraction(postId, action) {
  const url = "http://127.0.0.1:8000/api/handle-post-interaction";

  try {
    const response = await fetch(url, {
      credentials: "include", // Important for cookies
      method: "POST", // Explicitly set method
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: postId,
        username: localStorage.getItem("username"),
        action: action
      }),
    });
    return await response.status;
  } catch {
    return "null";
  }
}
