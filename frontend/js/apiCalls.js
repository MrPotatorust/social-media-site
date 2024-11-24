export async function readPosts() {
  const url = "http://127.0.0.1:8000/api/read_posts";
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
  const url = "http://127.0.0.1:8000/api/create_post";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        text: text,
        author: author,
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
  const url = "http://127.0.0.1:8000/api/get_new_csrf";

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
