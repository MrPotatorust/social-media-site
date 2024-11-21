export async function readPosts() {
  const url = "http://127.0.0.1:8000/api/read_posts";
  try {
    const response = await fetch(url);
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
    const response = fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData
      })
    });
    return await response.json();
  } catch (err) {
    return `Fetch of registerUser failed ${err}`;
  }
}

export async function loginUser() {
  const url = "http://127.0.0.1:8000/api/login";
  try {
    const response = fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: {},
    });
    return await response.json();
  } catch (err) {
    return `Fetch of loginUser failed ${err}`;
  }
}

