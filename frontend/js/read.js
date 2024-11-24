import { readPosts } from "./apiCalls.js";
import { isLoggedIn } from "./auth.js";
isLoggedIn();

const postsEl = document.getElementById("posts");
const refreshPostsEl = document.getElementById("refresh-posts");

refreshPostsEl.addEventListener("click", listNewPosts);

async function listNewPosts() {
  const res = await readPosts();

  console.log(res);
  let postsElInnerHtml = res.reduce(
    (posts, post) =>
      posts +
      `
    <div class="post">
    <h3>${post.title}</h3>
    <p>${post.text}</p>
    <p>Likes: ${post.likes} <button>L</button> Saves: ${post.saves} <button>S</button> Reposts: ${post.reposts} <button>R</button> ${post.author} ${post.pub_date}</p>
    </div>
    `,
    ""
  );
  postsEl.innerHTML = postsElInnerHtml;
}
