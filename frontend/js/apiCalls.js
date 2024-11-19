export async function readPosts() {
  const url = "http://127.0.0.1:8000/api/read_posts";
  try {
    const response = await fetch(url);
    console.log("succesfully fetched");
    return response.json();
  } catch {
    console.log("Fetch of readPosts failed");
  }
}

export async function createPost(title, text, likes, reposts, saves, author) {
  const url = "http://127.0.0.1:8000/api/create_post";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "The first test",
        text: "Text in the first test",
        likes: 0,
        reposts: 0,
        saves: 0,
        author: 1,
      }),
    });
    console.log( await response.json());
  } catch (err) {
    console.log(`Fetch of createPost failed ${err}`);
  }
}
