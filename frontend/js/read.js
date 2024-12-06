import { readPosts, postBtnInteraction } from "./apiCalls.js";
import { isLoggedIn } from "./auth.js";
isLoggedIn();

const postsEl = document.getElementById("posts");
const refreshPostsEl = document.getElementById("refresh-posts");

refreshPostsEl.addEventListener("click", listNewPosts);

listNewPosts();

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
    <p>
    Likes: <span class="likes">${
      post.likes_count
    }</span> <button class="post-btn-int ${
        post.liked ? "toggled-like-btn" : ""
      }" id="${post.id}" name="likes">L</button> 
    Saves: <span class="saves">${
      post.saves_count
    }</span> <button class="post-btn-int ${
        post.saved ? "toggled-like-btn" : ""
      }" id="${post.id}" name="saves">S</button>
    Reposts: <span class="reposts">${
      post.reposts_count
    }</span> <button class="post-btn-int ${
        post.reposted ? "toggled-like-btn" : ""
      }" id="${post.id}" name="reposts">R</button>
    <a href="profile.html?user=${post.author}">${post.author}</a> ${post.pub_date}
    </p>
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
  const target = event.target;
  target.classList.toggle("toggled-like-btn");

  const spanEl = target.closest(`p`).querySelector(`.${target.name}`);

  if (target.classList.contains("toggled-like-btn")) {
    spanEl.innerText = parseInt(spanEl.innerText) + 1;
  } else {
    spanEl.innerText = parseInt(spanEl.innerText) - 1;
  }
  console.log(spanEl);
  postBtnInteraction(target.id, target.name);
}
