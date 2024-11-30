import { readPosts } from "./apiCalls.js";
import { isLoggedIn } from "./auth.js";
isLoggedIn();

const postsEl = document.getElementById("posts");
const refreshPostsEl = document.getElementById("refresh-posts");

refreshPostsEl.addEventListener("click", listNewPosts);

listNewPosts();

async function listNewPosts() {
  const res = await readPosts();

  let postsElInnerHtml = res.reduce(
    (posts, post) =>
      posts +
      `
    <div class="post">
    <h3>${post.title}</h3>
    <p>${post.text}</p>
    <p>
    Likes: ${post.likes} <button class="post-btn-int" value="${post.id}" name="likes" >L</button> 
    Saves: ${post.saves} <button class="post-btn-int" value="${post.id}" name="saves" >S</button>
    Reposts: ${post.reposts} <button class="post-btn-int" value="${post.id}" name="reposts" on>R</button>
    ${post.author} ${post.pub_date}</p>
    </div>
    `,
    ""
  );
  postsEl.innerHTML = postsElInnerHtml;
  const postBtns = document.getElementsByClassName("post-btn-int");

  Array.from(postBtns).forEach((button) => {
    button.addEventListener("click", handlePostBtnInteraction);
  });
}

function handlePostBtnInteraction(event) {
  console.log(event.target);
}
