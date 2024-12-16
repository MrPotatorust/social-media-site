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

export async function createPost(text, author) {
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

// Currently not in use
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
  } catch (err) {
    return `Fetch of getNewCsrf failed ${err}`;
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
  } catch (err) {
    return `Fetch of logOutApi failed ${err}`;
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
    return response.status;
  } catch (err) {
    return `Fetch of tokenCheckApi failed ${err}`;
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
