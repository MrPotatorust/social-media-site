import {readPosts} from "./apiCalls.js";

const postsEl = document.getElementById("posts");

const refreshPostsEl = document.getElementById("refresh-posts");

refreshPostsEl.addEventListener("click", listNewPosts);

async function listNewPosts() {
  const res = await readPosts();

  console.log(res);
  let postsElInnerHtml = res.reduce(
    (posts, post) => posts + `
    <div class="post">
    <h3>${post.title}</h3>
    <p>${post.text}</p>
    <p>Likes: ${post.likes} Saves: ${post.saves} Reposts: ${post.reposts} ${post.author} ${post.pub_date}</p>
    </div>
    `,
    ""
  );
  console.log(postsElInnerHtml);
  postsEl.innerHTML = postsElInnerHtml;
}
